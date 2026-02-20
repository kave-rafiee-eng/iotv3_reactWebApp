import { BrowserRouter, Routes, Route } from "react-router-dom";
import IotHome from "./iotHome";

import IotNavBar from "./iotNavBar";
import NumberInput from "./menuComponent/menuOneParameter";

import { useSocketStore } from "./socketStore";
import { useEffect } from "react";
import BasicModal from "./component/modal";
import { useState } from "react";

import { Button, TextField, Stack, Drawer } from "@mui/material";
import Snackbar from "@mui/material/Snackbar";
import Alert from "@mui/material/Alert";

import CircularProgress from "@mui/material/CircularProgress";
import Box from "@mui/material/Box";
import LinearProgress from "@mui/material/LinearProgress";
import MiniDrawer from "./miniDrawer";
import MyAppBar from "./component/AppBar";
import Typography from "@mui/material/Typography";

import { useTranslation } from "react-i18next";
import FullPageScroll from "./monitoring/monitoringHome";

function AppIot() {
  const { t } = useTranslation();

  const connect = useSocketStore((s) => s.connect);
  const connected = useSocketStore((s) => s.connected);
  const SetCommModalState = useSocketStore((s) => s.SetCommModalState);

  const [commModal, setCommModal] = useState({
    open: false,
    severity: "warning",
    title: "",
  });

  SetCommModalState(setCommModal);

  useEffect(() => {
    connect();
    //PciSend();
  });

  const [drawerOpen, setDrawerOpen] = useState(false);

  return (
    <>
      <Box
        sx={{
          position: "relative",
          width: "100%",
          m: 0,
          p: 0,
          t: 0,
        }}
      >
        <Box
          sx={{
            width: "100%",
            display: "flex",
            background: "green",
            m: 0,
            p: 0,
            t: 0,
          }}
        >
          <MyAppBar
            handleDrawerOpen={() => setDrawerOpen(true)}
            open={drawerOpen}
          />
          <MiniDrawer setOpen={setDrawerOpen} open={drawerOpen} />
        </Box>

        <Box
          sx={{
            width: "100%",
            position: "absolute",
            p: 0,
            t: 0,
            m: 0,
            display: "flex",
          }}
        >
          <Box
            sx={{
              width: "85vw",
              p: 0,
              t: 0,
              m: 0,
              ml: "15vw",
              mt: "10vh",
            }}
          >
            <Routes>
              <Route path="/" element={<IotHome />} />
              <Route path="/setting" element={<IotHome />} />
              <Route path="/monitornig" element={<FullPageScroll />} />
            </Routes>
          </Box>
        </Box>
      </Box>
    </>
  );
}

export default AppIot;

/*
        <Typography sx={{ marginBottom: 2 }}>
          {t("welcomeMess", { user: "kave" })}
        </Typography>
*/
/*
      <Snackbar
        open={commModal.open}
        autoHideDuration={6000}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
        onClose={() => {}}
      >
        <Alert
          onClose={() => {}}
          severity={commModal.severity}
          variant="filled"
          sx={{ width: "100%" }}
        >
          {commModal.title}
          {commModal.severity === "warning" && <LinearProgress />}
        </Alert>
      </Snackbar>

      <BasicModal
        open={false}
        handleCloseBtn={() => {}}
        title={"Delvice..."}
        body={"please Wait"}
      />

      <BasicModal
        open={!connected}
        handleCloseBtn={() => {}}
        title={"Cooecting to Ws..."}
        body={"please Wait"}
      />
      */
/*
      {<IotNavBar />}
      <Routes>
        <Route path="/" element={<IotHome />} />
        <Route path="/test" element={<MiniDrawer />} />
      </Routes>*/
