import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";
import { Button, TextField, Stack, IconButton, Icon } from "@mui/material";

import { useState, useRef, useEffect, useReducer, useMemo } from "react";

import menuesJson from "../MenuDataJson.json";
import { currentMenuType, MenuPropsType } from "./currentMenuTypes";

import { TableBasic, TableBasicProps } from "../component/tableBasic";

import BtnReadSave from "./btnReadSave";

import SettingsIcon from "@mui/icons-material/Settings";
import KeyboardDoubleArrowUpIcon from "@mui/icons-material/KeyboardDoubleArrowUp";
import KeyboardDoubleArrowDownIcon from "@mui/icons-material/KeyboardDoubleArrowDown";
//Coustom hooks
import { useFlashReset } from "../hooks/useFlashReset";
import { useAutoUpdate } from "../hooks/useAutoUpdate";
import { useSocketStore } from "../socketStore";
import { IconsManifest } from "react-icons";

import { CalShowValue, CalculateColorState } from "./genericFn";

import CardSetting from "./card";
type menusType = typeof menuesJson;

type settingSelectType = {
  address: number;
  options: string[];
  lable: string;
};

type settingNumberType = {
  offset: number;
  address: number;
  addition: number;
  unit: string;
  factor: number;
  minValue: number;
  maxValue: number;
  lable: string;
};

type settingType = {
  number?: settingNumberType;
  select?: settingSelectType;
};

type stateAddType = {
  stateIndex: number;
  address: number;
  readOnly: boolean;
};

type StateType = {
  filter: number;
  valueChenged: boolean[];
  valueSetting: number[];
  commFault: boolean;
};

function extractMenu(menu: currentMenuType, allmenu: menusType): settingType[] {
  let extract: settingType[] = [];

  for (const item of menu.items) {
    //----------Select
    if (item.data?.settingOption) {
      //if (item.label != "Seg L") continue;
      const settingOption = item.data.settingOption;
      if (settingOption.options in allmenu) {
        let itemSelect: settingSelectType = {
          lable: item.label,
          address: settingOption.value,
          options: allmenu[
            settingOption.options as keyof typeof allmenu
          ] as string[],
        };
        extract.push({ select: itemSelect });
      }
    }
    //----------Number
    if (item.data?.setting) {
      const setting = item.data.setting;
      let itemNumber: settingNumberType = {
        lable: item.label,
        address: setting.value,
        addition: setting.addition,
        unit: setting.unit,
        factor: setting.factor,
        minValue: setting.minValue,
        maxValue: setting.maxValue,
        offset: setting.offset,
      };
      extract.push({ number: itemNumber });
    }
  }

  return extract;
}

function stateAddExtractor(
  settingBuf: settingType[],
  numOfFloor: number,
): stateAddType[] {
  const result: stateAddType[] = [];

  result.push({
    address: 1,
    stateIndex: 0,
    readOnly: true,
  });
  let globalIndex = 1;
  for (const setting of settingBuf) {
    const baseAddress = setting.number?.address ?? setting.select?.address;
    if (baseAddress === undefined) continue;
    for (let i = 0; i < numOfFloor; i++) {
      result.push({
        address: baseAddress + i,
        stateIndex: globalIndex + i,
        readOnly: false,
      });
    }
    globalIndex += numOfFloor;
  }
  return result;
}

export default function MenuMultyGroup({
  currentMenu,
  allMenu,
}: MenuPropsType) {
  const PCI_Setting = useSocketStore((s) => s.PCI_Setting);
  const stateRef = useRef<stateRefType>({
    interval: null,
    speed: 150,
    processRun: false,
    userEngage: false,
    F_userEngage: false,
    preNof: 0,
  });
  const [, forceUpdate] = useReducer((x) => x + 1, 0);
  const [flash, setFlash] = useFlashReset(false, 500);

  let setting = extractMenu(currentMenu, allMenu);
  const [state, setState] = useState<StateType>({
    valueChenged: Array(setting.length * 24).fill(0),
    valueSetting: Array(setting.length * 24).fill(0),
    commFault: false,
    filter: 0,
  });

  const nof = state.valueSetting[0];

  const stateAddBuf = stateAddExtractor(setting, nof);

  //----------

  const filterOptions: string[] = setting.map((item) => {
    if (item.number?.lable) return item.number.lable;
    else if (item.select?.lable) return item.select.lable;
    return "";
  });

  const filter = filterOptions[state.filter];
  let settingFilter = setting.find((value) => {
    if (value.select?.lable == filter) return true;
    else if (value.number?.lable == filter) return true;
    return false;
  });

  //console.log(settingFilter);
  type renderValuesType = {
    stateIndex: number;
    number?: settingNumberType;
    select?: settingSelectType;
  };
  type MyRow = {
    id: number;
    floor: number;
    renderValues: renderValuesType;
  };

  //-----------Creat  Table Rows
  let tableData: MyRow[] = [];

  if (settingFilter?.select || settingFilter?.number) {
    const startAdd =
      settingFilter.select?.address ?? settingFilter.number?.address ?? 0;
    let globalCounter = 0;
    for (let i = 0; i < nof; i++) {
      const Add = startAdd + i;
      const found = stateAddBuf.find((value) => value.address === Add);
      if (found) {
        const indexState = found?.stateIndex;
        if (settingFilter.select) {
          tableData.push({
            id: globalCounter,
            floor: i + 1,
            renderValues: {
              stateIndex: indexState,
              select: settingFilter.select,
            },
          });
        } else if (settingFilter.number) {
          tableData.push({
            id: globalCounter,
            floor: i + 1,
            renderValues: {
              stateIndex: indexState,
              number: settingFilter.number,
            },
          });
        }
        globalCounter++;
      }
    }
  }

  const bgColor = useMemo(() => {
    return Array.from({ length: state.valueChenged.length }, (_, index) => {
      return CalculateColorState({
        flash: flash,
        userEngage: stateRef.current.userEngage,
        chnage: state.valueChenged[index],
        commFault: state.commFault,
      });
    });
  }, [flash, state, stateRef.current.userEngage, state.commFault]);

  const startChange = (
    direction: number,
    index: number,
    min: number,
    max: number,
  ) => {
    stateRef.current.userEngage = true;

    if (stateRef.current.interval) return;
    stateRef.current.speed = 500;
    const run = () => {
      setState((prev) => {
        const current = prev.valueSetting[index];
        let next = current + direction;
        next = Math.max(min, Math.min(max, next));
        if (next === current) return prev;
        const newValueSetting = [...prev.valueSetting];
        newValueSetting[index] = next;
        return {
          ...prev,
          valueSetting: newValueSetting,
        };
      });
      stateRef.current.speed *= 0.85;
      stateRef.current.interval = setTimeout(run, stateRef.current.speed);
    };
    run();
  };

  const stopChange = () => {
    if (stateRef.current.interval != null)
      clearInterval(stateRef.current.interval);
    stateRef.current.interval = null;
  };

  const processPCI = async (write: boolean) => {
    if (stateRef.current.processRun) return;

    stateRef.current.userEngage = false;
    stateRef.current.processRun = true;

    try {
      const stateAddFilter = stateAddBuf.filter((stateAdd) => {
        if (!write) return true;
        if (stateAdd.readOnly === false) return true;
      });

      //console.log(stateAddFilter.length);
      const res = await PCI_Setting(
        stateAddFilter.map((stateAdd) => {
          return stateAdd.address;
        }),
        write
          ? stateAddFilter.map((stateAdd) => {
              return state.valueSetting[stateAdd.stateIndex];
            })
          : [],
        write,
        true,
      );

      /*let newValues: (number | null)[] = Array(state.valueSetting.length).fill(
        null,
      );*/

      let allRecived = true;
      let newValues = Array(state.valueSetting.length).fill(null);
      stateAddFilter.forEach((stateAdd) => {
        const found = res.registers.find(
          (register) => register.add === stateAdd.address,
        );
        if (found) {
          newValues[stateAdd.stateIndex] = found.value;
        } else {
          allRecived = false;
          console.log("allRecived = false;");
        }
      });

      //console.log(stateAddFilter);
      //console.log(res);
      //console.log(newValues);
      if (allRecived) {
        setState((prev) => {
          for (let i = 0; i < newValues.length; i++) {
            if (newValues[i] == null) newValues[i] = prev.valueSetting[i];
          }
          return {
            ...prev,
            valueSetting: [...newValues],
            commFault: false,
            valueChenged: prev.valueChenged.map(() => false),
          };
        });
        setFlash(true);
      }
    } catch (err) {
      console.error(err);
      setState((prev) => ({
        ...prev,
        commFault: true,
      }));
    }
    stateRef.current.processRun = false;
  };

  if (nof > stateRef.current.preNof) {
    stateRef.current.preNof = nof;
    console.log("stateRef.current.preNof");
    processPCI(false);
  }

  const tableProps: TableBasicProps<MyRow> = {
    columns: [
      {
        id: "floor",
        label: "Floor",
        Width: "15%",
      },
      {
        id: "renderValues",
        label: () => {
          return (
            <FormControl variant="standard" sx={{ width: "100%" }}>
              <InputLabel id="demo-simple-select-standard-label"></InputLabel>
              <Select
                labelId="demo-simple-select-standard-label"
                id="demo-simple-select-standard"
                value={state.filter}
                onChange={(e) => {
                  setState((prev) => {
                    return {
                      ...prev,
                      filter: e.target.value,
                    };
                  });
                }}
              >
                {filterOptions.map((name, index) => (
                  <MenuItem key={name} value={index}>
                    {name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          );
        },
        render: (row) => {
          if (row.renderValues.select) {
            return (
              <FormControl variant="standard" sx={{ width: "100%" }}>
                <InputLabel id="demo-simple-select-standard-label"></InputLabel>
                <Select
                  labelId="demo-simple-select-standard-label"
                  id="demo-simple-select-standard"
                  value={state.valueSetting[row.renderValues.stateIndex]}
                  onOpen={() => {
                    if (!stateRef.current.userEngage)
                      stateRef.current.F_userEngage = true;
                    stateRef.current.userEngage = true;
                  }}
                  onClose={() => {
                    if (stateRef.current.F_userEngage) {
                      stateRef.current.F_userEngage = false;
                      //forceUpdate();
                    }
                  }}
                  onChange={(e) => {
                    setState((prev) => {
                      let newState: StateType = { ...prev };
                      newState.valueSetting[row.renderValues.stateIndex] =
                        e.target.value;
                      newState.valueChenged[row.renderValues.stateIndex] = true;
                      return newState;
                    });
                  }}
                  sx={{
                    bgcolor: bgColor[row.renderValues.stateIndex],
                    textAlign: "center",
                  }}
                >
                  {row.renderValues.select.options.map((name, index) => (
                    <MenuItem key={name} value={index}>
                      {name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            );
          } else if (row.renderValues.number) {
            return (
              <Stack
                justifyContent="center"
                direction="row"
                spacing={0}
                alignItems="center"
                sx={{
                  display: "flex",
                  width: "100%",
                  background: "#bfbfbf",
                }}
              >
                <IconButton
                  onMouseDown={() =>
                    startChange(
                      1,
                      row.renderValues.stateIndex,
                      row.renderValues.number?.minValue ?? 0,
                      row.renderValues.number?.maxValue ?? 0,
                    )
                  }
                  onMouseUp={stopChange}
                  onMouseLeave={stopChange}
                  onTouchStart={() =>
                    startChange(
                      1,
                      row.renderValues.stateIndex,
                      row.renderValues.number?.minValue ?? 0,
                      row.renderValues.number?.maxValue ?? 0,
                    )
                  }
                  onTouchEnd={stopChange}
                  onTouchCancel={stopChange}
                  disabled={stateRef.current.processRun}
                  sx={{ width: "20%" }}
                  color="error"
                >
                  <KeyboardDoubleArrowUpIcon />
                </IconButton>
                <TextField
                  type="number"
                  value={CalShowValue({
                    value: state.valueSetting[row.renderValues.stateIndex],
                    addition: row.renderValues.number.addition ?? 0,
                    factor: row.renderValues.number.factor ?? 0,
                    offset: row.renderValues.number.offset ?? 0,
                  })}
                  size="small"
                  sx={{
                    bgcolor: bgColor,
                  }}
                  InputProps={{
                    readOnly: true,
                  }}
                />
                <IconButton
                  onMouseDown={() =>
                    startChange(
                      -1,
                      row.renderValues.stateIndex,
                      row.renderValues.number?.minValue ?? 0,
                      row.renderValues.number?.maxValue ?? 0,
                    )
                  }
                  onMouseUp={stopChange}
                  onMouseLeave={stopChange}
                  onTouchStart={() =>
                    startChange(
                      -1,
                      row.renderValues.stateIndex,
                      row.renderValues.number?.minValue ?? 0,
                      row.renderValues.number?.maxValue ?? 0,
                    )
                  }
                  onTouchEnd={stopChange}
                  onTouchCancel={stopChange}
                  disabled={stateRef.current.processRun}
                  sx={{ width: "20%" }}
                  color="error"
                >
                  <KeyboardDoubleArrowDownIcon />
                </IconButton>
              </Stack>
            );
          }
          return "row.floor";
        },
      },
    ],
    tableData: tableData,
  };

  return (
    <>
      <CardSetting title={currentMenu.title}>
        <TableBasic
          columns={tableProps.columns}
          tableData={tableProps.tableData}
        ></TableBasic>
        <BtnReadSave
          disabledRead={stateRef.current.processRun}
          disabledSave={stateRef.current.processRun}
          handleRead={() => processPCI(false)}
          handleSave={() => processPCI(true)}
        />
      </CardSetting>
    </>
  );
}

type stateRefType = {
  processRun: boolean;
  userEngage: boolean;
  F_userEngage: boolean;
  interval: ReturnType<typeof setTimeout> | null;
  speed: number;
  preNof: number;
};

/*
               <Button
                  size="small"
                  variant="contained"
                  onMouseDown={() => startChange(-1)}
                onMouseUp={stopChange}
                onMouseLeave={stopChange}
                disabled={stateRef.current.processRun}
                onTouchStart={() => startChange(-1)}
                onTouchEnd={stopChange}
                onTouchCancel={stopChange}
                onTouchMove={stopChange}
                >
                  ↓
                </Button>
                */
