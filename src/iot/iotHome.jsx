import menuDataJson from "./MenuDataJson.json";
import { menuTypes } from "./defMenuType";

import Grid from "@mui/material/Grid";
import Paper from "@mui/material/Paper";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import CardContent from "@mui/material/CardContent";
import CardActions from "@mui/material/CardActions";
import Button from "@mui/material/Button";
import Card from "@mui/material/Card";

import RestorePageIcon from "@mui/icons-material/RestorePage";
import SettingsIcon from "@mui/icons-material/Settings";

import { createTheme, ThemeProvider, styled } from "@mui/material/styles";

import SubMenuGraphic from "./menuComponent/subMenuGraphc";

import MenuOneParameter from "./menuComponent/menuOneParameter";

import MenuOneSelect from "./menuComponent/menuOneSelect";

import MenuNavBar from "./menuComponent/menuNavBar";
import { useState } from "react";
import MenuMultySelect from "./menuComponent/menuMultySelect";
import MenuMultyGroup from "./menuComponent/menuMultiGroup";
function Icon(label) {
  switch (label) {
    case "History":
      return <RestorePageIcon />;
    case "Full Set":
      return <SettingsIcon />;
    default:
      return null;
  }
}
export default function IotHome() {
  const [menuStack, setMenuStack] = useState(["mainMenu"]);
  //const [menuStack, setMenuStack] = useState(["MenuId_0x803467c"]);
  //console.log(menuStack);

  let currentMenu = menuDataJson[menuStack[menuStack.length - 1]];

  //menuDataJson["mainMenu"]
  const handleSubMenuClick = (submenu) => {
    console.log(submenu);
    if (menuDataJson[submenu]) {
      setMenuStack((prev) => {
        let newMenuStack = [...prev];
        newMenuStack.push(submenu);
        return newMenuStack;
      });
    }
  };

  const handleNewStack = (newStack) => {
    setMenuStack((prev) => {
      return newStack;
    });
  };

  return (
    <>
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
          sx={{ justifyContent: "center" }}
        >
          {
            <MenuNavBar
              allMenus={menuDataJson}
              menuStackArr={menuStack}
              handleMenuChenge={handleNewStack}
            />
          }
          {(currentMenu.type === menuTypes.MENU_TYPE_SUBMENU_GRAPHC ||
            currentMenu.type === menuTypes.MENU_TYPE_SUBMENU) && (
            <SubMenuGraphic
              allMenus={menuDataJson}
              currentMenu={currentMenu}
              handleSubMenuClick={handleSubMenuClick}
            />
          )}
          {currentMenu.type === menuTypes.MENU_TYPE_SETTING_ON_PARAMETER && (
            <MenuOneParameter currentMenu={currentMenu} />
          )}
          {currentMenu.type === menuTypes.MENU_TYPE_SETTING_ON_SELECT && (
            <MenuOneSelect currentMenu={currentMenu} allMenu={menuDataJson} />
          )}
          {currentMenu.type ===
            menuTypes.MENU_TYPE_SETTING_MULTY_SELECT_ONE_STAGE && (
            <MenuMultySelect currentMenu={currentMenu} allMenu={menuDataJson} />
          )}
          {currentMenu.type === menuTypes.MENU_TYPE_SETTING_MULTY_GROUP && (
            <MenuMultyGroup currentMenu={currentMenu} allMenu={menuDataJson} />
          )}
        </Grid>
      </Grid>
    </>
  );
}

/*
            <Paper sx={{ borderRadius: "25px" }} elevation={5}>
              <Box p={1}>
                <Typography variant="h6">{mainMenu.title}</Typography>
                <Typography variant="body2">
                  num Of Items = {mainMenu.items.length}
                </Typography>
              </Box>

              <Button size="small" color="primary">
                Primary
              </Button>
            </Paper>

            */
