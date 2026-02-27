import React, { forwardRef, useEffect, useRef } from "react";
import { Box, Typography } from "@mui/material";
import { registerType, picMonitorType } from "./../types";

import { useMonitorStore } from "./../monitorStor";

import { useAddressesPool } from "./../hooks/adrressPool";

type SectionProps = {
  color: string;
  id: number;
};
type adrressesPoolType = number[];

const SecLocation = forwardRef<HTMLDivElement, SectionProps>(
  ({ color, id }, ref) => {
    const AddReadRegister = useMonitorStore((state) => state.AddReadRegister);

    const { addToPool } = useAddressesPool(id);

    const registers = useMonitorStore(
      (state) => state.monitorData[id].registers,
    );

    return (
      <Box
        ref={ref}
        sx={{
          height: "100%",
          scrollSnapAlign: "start",
          bgcolor: color,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          color: "white",
          flexDirection: "column",
          p: 0,
          gap: 0,
        }}
      >
        <h3> id:{id} / SecLocation</h3>
      </Box>
    );
  },
);

SecLocation.displayName = "Section_home";
export default SecLocation;
