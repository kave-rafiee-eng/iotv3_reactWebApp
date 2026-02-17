import { create } from "zustand";

function Delay(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

const PCI_TYPE = {
  ADD_ADVANCE: 1,
  ADD_CLIENT: 3,
  TYPE_SET_R: 1,
  TYPE_SET_W: 2,
};

export const useSocketStore = create((set, get) => ({
  SetCommModal: null,
  socket: null,
  connected: false,
  listeners: [],

  connect: () => {
    if (get().socket) return;

    const ws = new WebSocket("ws://localhost:3001");
    ws.binaryType = "arraybuffer";
    ws.onopen = () => {
      console.log("WS connected");
      set({ connected: true });
    };

    ws.onclose = () => {
      console.log("WS disconnected");
      set({ connected: false, socket: null });

      setTimeout(() => {
        console.log("Reconenct");
        get().connect();
      }, 2000);
    };

    ws.onmessage = (event) => {
      const data = event.data;

      get().listeners.forEach((cb) => cb(data));
    };

    set({ socket: ws });
  },

  send: (data) => {
    const ws = get().socket;
    if (ws && ws.readyState === 1) {
      //ws.send(JSON.stringify(data));
      ws.send(data);
    } else {
      console.log("socket not connected");
    }
  },

  subscribe: (callback) => {
    set((state) => ({
      listeners: [...state.listeners, callback],
    }));

    return () => {
      set((state) => ({
        listeners: state.listeners.filter((cb) => cb !== callback),
      }));
    };
  },

  SetCommModalState: (set) => {
    get().SetCommModal = set;
  },

  _waitToGetData: (TimeOut) => {
    return new Promise((resolve, reject) => {
      const unsubscribe = get().subscribe((data) => {
        console.log("message received:", data);
        unsubscribe();
        resolve(data);
      });

      setTimeout(() => {
        unsubscribe();
        reject("timeout");
      }, TimeOut);
    });
  },

  _GetPid: () => {
    return Math.floor(Math.random() * 255);
  },

  _PCI_send: (pid, bytes, enModal) => {
    const numOfTry = 5;

    return new Promise((resolve, reject) => {
      let resolved = false;

      const unsubscribe = get().subscribe((data) => {
        const resArray = new Uint8Array(data);
        if (resArray.length >= 10 && resArray[0] === pid && !resolved) {
          resolved = true;
          unsubscribe();
          const reciveData = {
            pid: resArray[0],
            add: resArray[1],
            type: resArray[2],
            numOfRegister: resArray[2],
            registerAdd: resArray[4] * 256 + resArray[5],
            registerValue: resArray[6] * 256 + resArray[7],
            crcL: resArray[8],
            crcH: resArray[9],
          };
          resolve(reciveData);
        }
      });

      (async () => {
        for (let i = 0; i < numOfTry && !resolved; i++) {
          console.log(`PCI Send pid :${pid} / try :${i}`);
          if (i > 0)
            if (enModal) {
              get().SetCommModal((prev) => {
                return {
                  ...prev,
                  open: true,
                  severity: "warning",
                  title: `communication failure try ${i}`,
                };
              });
            }
          get().send(bytes);
          await Delay(1000);
        }
        if (!resolved) {
          resolved = true;
          unsubscribe();

          reject(new Error("No response from device PID :" + pid));
        }
      })();
    });
  },

  PCI_Setting: async (addresses, newValues, readOrWrite, enModal) => {
    const inputs = {
      addresses,
      newValues,
      readOrWrite,
      enModal,
    };

    if (inputs.readOrWrite) console.log("PCI:writeSetting");
    else console.log("PCI:readSetting");

    const ADD = PCI_TYPE.ADD_ADVANCE;
    const PID = get()._GetPid();
    const TYPE = inputs.readOrWrite ? PCI_TYPE.TYPE_SET_W : PCI_TYPE.TYPE_SET_R;
    const NUM_OF_REGISTER = inputs.addresses.length;
    const dataArr = [PID, ADD, TYPE, NUM_OF_REGISTER];

    for (let i = 0; i < inputs.addresses.length; i++) {
      const RA_H = (inputs.addresses[i] >> 8) & 0xff;
      const RA_L = inputs.addresses[i] & 0xff;
      dataArr.push(RA_H);
      dataArr.push(RA_L);
      if (inputs.readOrWrite) {
        const RV_H = (inputs.newValues[i] >> 8) & 0xff;
        const RV_L = inputs.newValues[i] & 0xff;
        dataArr.push(RV_H);
        dataArr.push(RV_L);
      }
    }

    const crc = MODBUS_CRC16_v1(dataArr);
    const bytes = new Uint8Array([...dataArr, (crc >> 8) & 0xff, crc & 0xff]);

    const colseingModal = () => {
      get().SetCommModal((prev) => {
        return {
          ...prev,
          open: false,
        };
      });
    };

    const openingModalError = () => {
      get().SetCommModal((prev) => {
        return {
          ...prev,
          open: true,
          severity: "error",
          title: `No response from device `,
        };
      });
    };

    try {
      const res = await get()._PCI_send(PID, bytes, enModal);
      if (enModal) colseingModal();
      return res;
    } catch (err) {
      if (enModal) openingModalError();
      throw err;
    }
  },
}));

function MODBUS_CRC16_v1(buf) {
  let crc = 0xffff;
  for (let i = 0; i < buf.length; i++) {
    crc ^= buf[i];
    for (let bit = 0; bit < 8; bit++) {
      if (crc & 0x0001) {
        crc >>= 1;
        crc ^= 0xa001;
      } else {
        crc >>= 1;
      }
    }
    crc &= 0xffff;
  }
  return crc;
}

/*
import { useEffect } from "react";
import { useSocketStore } from "./socketStore";

export default function TestPage() {
  const send = useSocketStore((s) => s.send);
  const subscribe = useSocketStore((s) => s.subscribe);
  const connected = useSocketStore((s) => s.connected);

  useEffect(() => {
    const unsubscribe = subscribe((data) => {
      console.log("message received:", data);
    });

    return unsubscribe; // هنگام خروج از صفحه
  }, []);

  return (
    <div>
      <h2>status: {connected ? "🟢 online" : "🔴 offline"}</h2>

      <button
        onClick={() =>
          send({
            type: "ping",
            value: 123,
          })
        }
      >
        send websocket
      </button>
    </div>
  );
}
  */
