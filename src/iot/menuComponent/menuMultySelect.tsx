import { menuTypes } from "../defMenuType";

import OutlinedInput from "@mui/material/OutlinedInput";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";
import CardSetting from "./card";

import { Button, TextField, Stack } from "@mui/material";
import { useState, useRef, useEffect, useReducer, useMemo } from "react";

import { useSocketStore } from "../socketStore";

import BtnReadSave from "./btnReadSave";
import { useFlashReset } from "../hooks/useFlashReset";
import { useAutoUpdate } from "../hooks/useAutoUpdate";

import { currentMenuType, MenuPropsType } from "./currentMenuTypes";
import menuesJson from "../MenuDataJson.json";

import { TableBasic, TableBasicProps } from "../component/tableBasic";

type menusType = typeof menuesJson;

type StateType = {
  valueChenged: boolean[];
  valueSetting: number[];
  commFault: boolean;
};

type stateRefType = {
  processRun: boolean;
  userEngage: boolean;
  F_userEngage: boolean;
};

type settingType = {
  addresses: number[];
  options: string[];
  itemLabels: string[];
};

function ExtractMenu(
  menu: currentMenuType,
  allMenu: menusType,
): settingType | false {
  for (const item of menu.items) {
    if (item.data?.MselectOne) {
      const MselectOne = item.data.MselectOne;

      let numItems = MselectOne.numItems;
      let startAdd = MselectOne.values;
      let addresses = Array.from({ length: numItems }, (_, index) => {
        return startAdd + index;
      });

      let options: string[] = [];
      if (MselectOne.options in allMenu) {
        options = allMenu[
          MselectOne.options as keyof typeof allMenu
        ] as string[];
      }

      let itemLabels: string[] = [];
      if (MselectOne.itemLabels in allMenu) {
        itemLabels = allMenu[
          MselectOne.itemLabels as keyof typeof allMenu
        ] as string[];
      }

      return {
        addresses: (addresses = Array.from({ length: numItems }, (_, index) => {
          return startAdd + index;
        })),
        options: options,
        itemLabels: itemLabels,
      };
    }
  }
  return false;
}

export default function MenuMultySelect({
  currentMenu,
  allMenu,
}: MenuPropsType) {
  const PCI_Setting = useSocketStore((s) => s.PCI_Setting);

  const setting = useMemo(() => {
    return ExtractMenu(currentMenu, allMenu);
  }, [currentMenu, allMenu]);

  let sizeArr = 0;
  if (typeof setting != "boolean") sizeArr = setting.addresses.length;

  const [state, setState] = useState<StateType>({
    valueChenged: Array(sizeArr).fill(0),
    valueSetting: Array(sizeArr).fill(0),
    commFault: false,
  });

  const stateRef = useRef<stateRefType>({
    processRun: false,
    userEngage: false,
    F_userEngage: false,
  });
  const [, forceUpdate] = useReducer((x) => x + 1, 0);

  const [flash, setFlash] = useFlashReset(false, 500);

  const bgColor = useMemo(() => {
    return Array.from({ length: state.valueChenged.length }, (_, index) => {
      if (flash) return "success.light";
      else if (stateRef.current.userEngage) {
        if (state.valueChenged[index]) return "#ffcc80";
        else return "#fff3e0";
      } else if (state.commFault) return "error.light";
      else return "white";
    });
  }, [flash, state, stateRef.current.userEngage, state.commFault]);

  useAutoUpdate({
    ProcessRead: () => {
      processPCI(false);
    },
    StopFn: () => {
      return stateRef.current.userEngage || stateRef.current.processRun;
    },
    max: 10,
  });

  if (typeof setting == "boolean")
    return (
      <>
        <h3>extractMenu Error</h3>
      </>
    );

  const processPCI = async (write: boolean) => {
    if (stateRef.current.processRun) return;

    stateRef.current.userEngage = false;
    stateRef.current.processRun = true;

    try {
      const res = await PCI_Setting(
        setting.addresses,
        write ? state.valueSetting : [],
        write,
        true,
      );

      let newValues: (number | null)[] = Array(state.valueSetting.length).fill(
        null,
      );

      res.registers.forEach((register) => {
        let offset = register.add - setting.addresses[0];
        if (offset >= 0 && offset < newValues.length) {
          newValues[offset] = register.value;
        }
      });

      if (newValues.every((val) => val != null)) {
        setState((prev) => ({
          ...prev,
          valueSetting: newValues,
          commFault: false,
          valueChenged: prev.valueChenged.map(() => false),
        }));
      }

      setFlash(true);
    } catch (err) {
      console.error(err);
      setState((prev) => ({
        ...prev,
        commFault: true,
      }));
    }

    stateRef.current.processRun = false;
  };

  type MyRow = {
    id: number;
    state: string;
    prog: string;
  };

  let tableData: MyRow[] = Array.from(
    { length: setting.itemLabels.length },
    (_, index) => {
      return {
        id: index,
        state: setting.itemLabels[index],
        prog: setting.itemLabels[index],
      };
    },
  );

  const props: TableBasicProps<MyRow> = {
    columns: [
      {
        id: "prog",
        label: "prog",
        Width: "10%",
      },
      {
        Width: "70%",
        id: "state",
        label: "state",
        render: (row) => {
          return (
            <FormControl variant="standard" sx={{ width: "100%" }}>
              <InputLabel id="demo-simple-select-standard-label">
                {row.state}
              </InputLabel>
              <Select
                labelId="demo-simple-select-standard-label"
                id="demo-simple-select-standard"
                value={state.valueSetting[row.id]}
                onOpen={() => {
                  if (!stateRef.current.userEngage)
                    stateRef.current.F_userEngage = true;
                  stateRef.current.userEngage = true;
                }}
                onClose={() => {
                  if (stateRef.current.F_userEngage) {
                    stateRef.current.F_userEngage = false;
                    forceUpdate();
                  }
                }}
                onChange={(e) => {
                  setState((prev) => {
                    let newState: StateType = { ...prev };
                    newState.valueSetting[row.id] = e.target.value;
                    newState.valueChenged[row.id] = true;
                    return newState;
                  });
                }}
                sx={{
                  bgcolor: bgColor[row.id],
                  textAlign: "center",
                }}
              >
                {setting.options.map((name, index) => (
                  <MenuItem key={name} value={index}>
                    {name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          );
        },
      },
    ],
    tableData: tableData,
  };

  return (
    <CardSetting title={currentMenu.title}>
      <TableBasic
        height={"50vh"}
        columns={props.columns}
        tableData={props.tableData}
      ></TableBasic>
      <BtnReadSave
        disabledRead={stateRef.current.processRun}
        disabledSave={stateRef.current.processRun}
        handleRead={() => processPCI(false)}
        handleSave={() => processPCI(true)}
      />
    </CardSetting>
  );
}
/*
    <CardSetting title={currentMenu.title}>
      <TableBasic
        columns={props.columns}
        tableData={props.tableData}
      ></TableBasic>
      <BtnReadSave
        disabledRead={stateRef.current.processRun}
        disabledSave={stateRef.current.processRun}
        handleRead={() => processPCI(false)}
        handleSave={() => processPCI(true)}
      />
    </CardSetting>*/
