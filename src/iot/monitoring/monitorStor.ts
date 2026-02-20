import { create } from "zustand";

type registerType = {
  address: number;
  value: number;
};
type monitorDataType = {
  readAddresses: number[];
  registers: registerType[];
};

type monitorStorType = {
  monitorData: monitorDataType[];
  send: (index: number, newValue: number) => void;
  AddReadRegister: (index: number, values: number[]) => void;
  ResetMonitorData: () => void;
};

export const useCounterStore = create<monitorStorType>((set, get) => ({
  monitorData: [
    {
      readAddresses: [1],
      registers: [
        {
          value: 1,
          address: 1,
        },
      ],
    },
    {
      readAddresses: [1],
      registers: [
        {
          value: 2,
          address: 2,
        },
      ],
    },
  ],

  ResetMonitorData: () =>
    set((state) => {
      return {
        monitorData: [
          {
            readAddresses: [1],
            registers: [
              {
                value: 2,
                address: 2,
              },
            ],
          },
          {
            readAddresses: [1],
            registers: [
              {
                value: 2,
                address: 2,
              },
            ],
          },
        ],
      };
    }),

  AddReadRegister: (index, values) =>
    set((state) => {
      const newMonitorData = [...state.monitorData];

      newMonitorData[index] = {
        ...newMonitorData[index],
        readAddresses: values,
      };

      return { monitorData: newMonitorData };
      //state.monitorData[index].readAddresses = values;
      //return { monitorData: state.monitorData };
    }),

  send: (index, newValue) =>
    set((state) => {
      const newRegisters = [...state.monitorData[index].registers];
      state.monitorData[index].registers = newRegisters;
      return { monitorData: state.monitorData };
    }),

  /*items: [{ active: false }, { active: false }, { active: false }],
  updateItem: (index, value) =>
    set((state) => {
      const newItems = [...state.items];
      newItems[index] = { ...newItems[index], active: value };
      return { items: newItems };
    }),

  activeIndex: 0,
  updateActiveIndex: (index) => set({ count: newCount }),
*/
  /*count: 0,
  increment: () => set((state) => ({ count: state.count + 1 })),
  decrement: () => set((state) => ({ count: state.count - 1 })),
  reset: () => set({ count: 0 }),
  update: (newCount) => set({ count: newCount }), */
}));
