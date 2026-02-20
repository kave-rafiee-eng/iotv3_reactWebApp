import React, { forwardRef, useEffect } from "react";
import { Box } from "@mui/material";
import { registerType, picMonitorType } from "./types";
import { useCounterStore } from "./monitorStor";

type SectionProps = {
  color: string;
  /*setAdds: ((addArr: number[]) => void) | null;
  registers: picMonitorType | null;*/
  id: number;
};

const Section = forwardRef<HTMLDivElement, SectionProps>(
  ({ color, id }, ref) => {
    const registers = useCounterStore(
      (state) => state.monitorData[id].registers,
    );

    const AddReadRegister = useCounterStore((state) => state.AddReadRegister);

    console.log("render Section id : " + id);

    useEffect(() => {
      AddReadRegister(
        id,
        Array.from({ length: 5 }, (_, index) => id + index),
      );
    });

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
          fontSize: "3rem",
          color: "white",
          flexDirection: "column",
        }}
      >
        <h3> id = {id}</h3>
        {registers.map((register) => {
          return (
            <>
              <h6>
                {register.address} = {register.value}
              </h6>
            </>
          );
        })}
      </Box>
    );
  },
);

Section.displayName = "Section";
export default Section;
