import { menuTypes } from "./../defMenuType";

import { Button, TextField, Stack } from "@mui/material";
import { useState, useRef, useEffect } from "react";

import CardSetting from "./card";

import { useSocketStore } from "./../socketStore";
import BtnReadSave from "./btnReadSave";

import { useFlashReset } from "./../hooks/useFlashReset";
import { useAutoUpdate } from "./../hooks/useAutoUpdate";

export default function MenuOneParameter({ currentMenu }) {
  const PCI_Setting = useSocketStore((s) => s.PCI_Setting);

  const [state, setState] = useState({
    valueSetting: 0,
    commFault: false,
  });
  const stateRef = useRef({
    interval: null,
    speed: 150,
    userEngage: false,
    processRun: false,
  });

  let setting = {
    minValue: 0,
    maxValue: 0,
    factor: 0,
    addition: 0,
    unit: "",
    address: 0,
    stepValue: 1,
  };

  let item = currentMenu.items.find(
    (item) => item.type === menuTypes.ITEM_TYPE_SETTING_ON_PARAMETER,
  );

  setting.address = item.data.setting.value;
  setting.addition = item.data.setting.addition;
  setting.unit = item.data.setting.unit;
  setting.factor = item.data.setting.factor;
  if (setting.factor == 0) setting.stepValue = 1;
  else if (setting.factor > 0) setting.stepValue = setting.factor;
  else setting.stepValue = 1 / Math.abs(setting.factor);
  setting.minValue = item.data.setting.minValue * setting.stepValue;
  setting.maxValue = item.data.setting.maxValue * setting.stepValue;

  const [flash, setFlash] = useFlashReset(false, 500);

  const startChange = (direction) => {
    stateRef.current.userEngage = true;

    if (stateRef.current.interval) return;
    stateRef.current.speed = 500;
    const run = () => {
      setState((prev) => {
        let newValue = prev.valueSetting + setting.stepValue * direction;
        newValue = CheckRange(
          newValue,
          setting.minValue,
          setting.maxValue,
          setting.stepValue,
        );
        return {
          ...prev,
          valueSetting: newValue,
        };
      });
      stateRef.current.speed *= 0.85;
      stateRef.current.interval = setTimeout(run, stateRef.current.speed);
    };
    run();
  };

  const stopChange = () => {
    clearInterval(stateRef.current.interval);
    stateRef.current.interval = null;
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
        <Stack direction="row" spacing={1} alignItems="center">
          <Button
            variant="contained"
            onMouseDown={() => startChange(-1)}
            onMouseUp={stopChange}
            onMouseLeave={stopChange}
            disabled={stateRef.current.processRun}
          >
            ↓
          </Button>

          <TextField
            value={state.valueSetting}
            size="small"
            sx={{
              width: 80,
              bgcolor: bgColor,
            }}
            step={setting.stepValue}
            InputProps={{
              readOnly: true,
            }}
          />

          <Button
            variant="contained"
            onMouseDown={() => startChange(1)}
            onMouseUp={stopChange}
            onMouseLeave={stopChange}
            disabled={stateRef.current.processRun}
          >
            ↑
          </Button>
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

function roundToStep(value, min, step) {
  return +(Math.round((value - min) / step) * step + min).toFixed(2);
}

function CheckRange(value, min, max, step) {
  if (value < min) value = min;
  else if (value > max) value = max;
  else value = roundToStep(value, min, step);
  return value;
}
/*
            onChange={(e) => {
              let newValue = Number(e.target.value);
              if (typeof newValue === "number" && !isNaN(newValue)) {
              } else newValue = minValue;

              setvalueSetting(
                CheckRange(
                  newValue,
                  setting.minValue,
                  setting.maxValue,
                  setting.stepValue,
                ),
              );
            }}*/
