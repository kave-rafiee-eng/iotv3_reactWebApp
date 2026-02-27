import React, { forwardRef, useEffect, useRef } from "react";
import { Box, Typography } from "@mui/material";
import { registerType, picMonitorType } from "./../types";

import { useMonitorStore } from "./../monitorStor";
import { Monitor_Segment } from "./../monitorComponent/segment";
import { useAddressesPool } from "./../hooks/adrressPool";
import { Monitor_mode } from "../monitorComponent/mode";

type SectionProps = {
  color: string;
  id: number;
};
type adrressesPoolType = number[];

const SecHome = forwardRef<HTMLDivElement, SectionProps>(
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
        <h3>id:{id} / SecHome</h3>
        <Box sx={{ height: "50%", width: "100%" }}>
          <Monitor_Segment
            registers={registers}
            addToPoolAddressesFn={addToPool}
          />
        </Box>
      </Box>
    );
  },
);

SecHome.displayName = "Section_home";
export default SecHome;
