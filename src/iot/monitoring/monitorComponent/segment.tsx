import React, { forwardRef, useEffect, useRef } from "react";
import { Box, Typography } from "@mui/material";
import { registerType, picMonitorType } from "./../types";

import { componentMonitorPropType, getValueByAdd } from "./typeFunction";
import { P5Segment } from "./p5Segment";

let readRegisters: number[] = [1, 1];

export function Monitor_Segment({
  registers,
  addToPoolAddressesFn,
}: componentMonitorPropType) {
  const test = useRef(0);
  useEffect(() => {
    console.log("Segment ");
    readRegisters[0] = test.current;
    test.current++;
    addToPoolAddressesFn(readRegisters);
  });

  // {getValueByAdd(registers, 1)}
  return (
    <Box width={"100%"} height={"100%"} sx={{ background: "green" }}>
      <P5Segment />
    </Box>
  );
}
