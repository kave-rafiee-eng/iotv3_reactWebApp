import { menuTypes } from "./../defMenuType";

import OutlinedInput from "@mui/material/OutlinedInput";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";
import CardSetting from "./card";

import { Button, TextField, Stack } from "@mui/material";
import { useState, useRef, useEffect, useReducer } from "react";

import { useSocketStore } from "./../socketStore";

import BtnReadSave from "./btnReadSave";
import { useFlashReset } from "./../hooks/useFlashReset";
import { useAutoUpdate } from "./../hooks/useAutoUpdate";

export default function MenuOneSelect({ currentMenu, allMenu }) {
  const PCI_Setting = useSocketStore((s) => s.PCI_Setting);

  const [state, setState] = useState({
    valueSetting: 0,
    commFault: false,
  });
  const stateRef = useRef({
    interval: null,
    speed: 150,
    processRun: false,
    userEngage: false,
  });
  const [, forceUpdate] = useReducer((x) => x + 1, 0);

  let setting = {
    address: 0,
    addition: 0,
    numOptions: 0,
    options: [],
  };

  let item = currentMenu.items.find(
    (item) => item.type === menuTypes.ITEM_TYPE_SETTING_ON_SELECT,
  );

  setting.label = item.label;
  setting.address = item.data.settingOption.value;
  setting.addition = item.data.settingOption.addition;
  setting.numOptions = item.data.settingOption.numOptions;
  if (allMenu[item.data.settingOption.options])
    setting.options = allMenu[item.data.settingOption.options];

  console.log(setting);

  const [flash, setFlash] = useFlashReset(false, 500);

  const UpdateSelect = (newValue) => {
    setState((prev) => {
      return {
        ...prev,
        valueSetting: newValue,
      };
    });
  };

  let bgColor = "transparent";
  if (flash) bgColor = "success.light";
  else if (stateRef.current.userEngage) bgColor = "blue";
  else if (state.commFault) bgColor = "red";

  const ProcessWrite = async () => {
    if (stateRef.current.processRun) return;
    stateRef.current.userEngage = false;
    stateRef.current.processRun = true;
    try {
      const res = await PCI_Setting(
        [setting.address],
        [state.valueSetting],
        true,
        true,
      );
      setState((prev) => {
        return {
          ...prev,
          valueSetting: res.registerValue,
          commFault: false,
        };
      });
      setFlash(true);
    } catch (err) {
      console.error(err);

      setState((prev) => {
        return {
          ...prev,
          commFault: true,
        };
      });
    }
    stateRef.current.processRun = false;
  };

  const ProcessRead = async () => {
    if (stateRef.current.processRun) return;
    stateRef.current.userEngage = false;
    stateRef.current.processRun = true;
    try {
      const res = await PCI_Setting([setting.address], [], false, true);
      setState((prev) => {
        return {
          ...prev,
          valueSetting: res.registerValue,
          commFault: false,
        };
      });
      setFlash(true);
    } catch (err) {
      console.error(err);

      setState((prev) => {
        return {
          ...prev,
          commFault: true,
        };
      });
    }
    stateRef.current.processRun = false;
  };

  useAutoUpdate({
    ProcessRead: ProcessRead,
    StopFn: () => {
      return stateRef.current.userEngage || stateRef.current.processRun;
    },
  });

  const CardChild = () => {
    return (
      <>
        <Stack
          direction="row"
          spacing={1}
          alignItems="center"
          justifyContent="center"
        >
          <FormControl sx={{ minWidth: 100 }}>
            <InputLabel id="DateSelect-lable">{setting.label}</InputLabel>
            <Select
              labelId="DateSelect-lable"
              value={state.valueSetting}
              onOpen={() => {
                stateRef.current.userEngage = true;
              }}
              onClose={() => {
                forceUpdate();
              }}
              onChange={(e) => {
                UpdateSelect(e.target.value);
              }}
              sx={{
                width: "100%",
                bgcolor: bgColor,
              }}
              input={<OutlinedInput label={setting.label} />}
            >
              {setting.options.map((name, index) => (
                <MenuItem key={name} value={index}>
                  {name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Stack>

        <BtnReadSave
          disabledRead={stateRef.current.processRun}
          disabledSave={stateRef.current.processRun}
          handleRead={ProcessRead}
          handleSave={ProcessWrite}
        />
      </>
    );
  };
  return (
    <>
      <CardSetting title={currentMenu.title} Child={CardChild} />
    </>
  );
}
