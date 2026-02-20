import {
  Box,
  Typography,
  Button,
  Paper,
  IconButton,
  colors,
} from "@mui/material";
import Grid from "@mui/material/Grid";
import { Fragment, useRef, useState, useEffect, useLayoutEffect } from "react";
import KeyboardDoubleArrowUpIcon from "@mui/icons-material/KeyboardDoubleArrowUp";
import KeyboardDoubleArrowDownIcon from "@mui/icons-material/KeyboardDoubleArrowDown";
import { ReactNode } from "react";
import { JSX } from "react";
import Section from "./section";

import { registerType, picMonitorType } from "./types";

import SectionTest from "./secstionTest";

type scrolRefType = {
  activeIndex: number;
  timeout: ReturnType<typeof setTimeout> | null;
};
type pageBufType = {
  branch: string;
  order: number;
  component: "Section";
};

import { useCounterStore } from "./monitorStor";

export default function FullPageScroll() {
  const sendSim = useCounterStore((state) => state.send);
  const ResetMonitorData = useCounterStore((state) => state.ResetMonitorData);
  const AddReadRegister = useCounterStore((state) => state.AddReadRegister);

  const statePciRef = useRef<picMonitorType>({
    registers: [],
    commFault: false,
  });

  console.log("render 11111");
  const sectionsRef = useRef<(HTMLDivElement | null)[]>([]);

  const handleSetReadRegister = (addresses: number[]) => {
    statePciRef.current.registers = addresses.map((add) => {
      return {
        add: add,
        value: 0,
      };
    });
  };

  const pageBuf = useRef<pageBufType[]>([
    {
      branch: "a",
      order: 0,
      component: "Section",
    },
    {
      branch: "a",
      order: 1,
      component: "Section",
    },
  ]);

  const scrolRef = useRef<scrolRefType>({
    timeout: null,
    activeIndex: 0,
  });
  const containerRef = useRef<HTMLDivElement | null>(null);

  const scrollToSection = (element: HTMLDivElement | null) => {
    if (element != undefined) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  const handleScroll = () => {
    if (!containerRef.current) return;
    clearTimeout(scrolRef.current.timeout!);
    scrolRef.current.timeout = setTimeout(() => {
      const container = containerRef.current!;
      const scrollY = container.scrollTop;
      const sectionHeight = container.clientHeight;
      scrolRef.current.activeIndex = Math.round(scrollY / sectionHeight);

      //increment();
      //console.log("Scroll Y:", scrollY, "Active Index:", value);
    }, 150);
  };

  const colors = ["red", "green", "blue"];

  return (
    <Grid
      container
      direction="column"
      spacing={1}
      sx={{
        width: "100%",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <Grid
        size={{ xs: 12, sm: 12, md: 4, lg: 4, xl: 4 }}
        direction={"column"}
        sx={{
          display: "flex",
          flexDirection: "column",
          p: 0.5,
          bgcolor: "background.paper",
          height: "90vh",
        }}
      >
        <Box
          ref={containerRef}
          sx={{
            width: "100%",
            flexDirection: "column",
            flexGrow: 1,
            overflowY: "scroll",
            scrollSnapType: "y mandatory",
          }}
          onScroll={handleScroll}
        >
          {pageBuf.current.map((section, index) => {
            let ComponentToRender;
            switch (section.component) {
              case "Section":
                ComponentToRender = Section;
                break;
            }
            return (
              <ComponentToRender
                id={index}
                key={index}
                color={colors[index % 3]}
                ref={(el) => {
                  sectionsRef.current[index] = el;
                }}
              />
            );
          })}
        </Box>

        <Paper
          elevation={3}
          sx={{
            height: "10vh",
            mt: "auto",
            justifyContent: "center",
            alignItems: "center",
            display: "flex",
            background: "#9e9e9e",
          }}
        >
          <Button
            variant="contained"
            onClick={() => {
              /*statePciRef.current = {
                registers: [
                  {
                    value: 1,
                    add: 0,
                  },
                ],
                commFault: false,
              };
              console.log(statePciRef.current);*/
              //AddReadRegister(scrolRef.current.activeIndex, [0, 1, 2, 3]);
              sendSim(scrolRef.current.activeIndex, 0);
            }}
          >
            set State
          </Button>
          <SectionTest />
          <IconButton onClick={() => {}}>
            <KeyboardDoubleArrowUpIcon />
          </IconButton>
        </Paper>
      </Grid>
    </Grid>
  );
}

/*
      setStatePci((prev) => {
        return {
          ...prev,
        };
      }));
  /*const [statePci, setStatePci] = useState<picMonitorType>({
    registers: [],
    commFault: false,
  });
  const [Snap, setSnap] = useState(0);*/

/*
  useEffect(() => {
    //console.log(containerRef.current);
    if (containerRef.current != null) {
      sectionsRef.current.forEach((el, index) => {
        if (!el) return;

        const rect = el.getBoundingClientRect();
        console.log({
          index,
          tag: el.tagName,
          id: el.id || null,
          classList: [...el.classList],
          x: rect.x,
          y: rect.y,
          width: rect.width,
          height: rect.height,
        });
      });
    }
  }, []);
          <IconButton onClick={() => scrollToSection()}>
            <KeyboardDoubleArrowUpIcon />
          </IconButton>

                    <Section color="#ff6b6b" />
          <Section color="#4ecdc4" />
          <Section color="#1a535c" />
          <Section color="blue" />
          <Section color="#ffe66d" />
        */
type sec = {
  color: string;
};

import { forwardRef } from "react";
import { Key } from "@mui/icons-material";

type SectionProps = {
  color: string;
};

/*

*/
