import { menuTypes } from "../defMenuType";

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
import { Key } from "@mui/icons-material";

export default function MenuNavBar({
  allMenus,
  menuStackArr,
  handleMenuChenge,
}) {
  const CalculateNewStack = (menuId) => {
    let index = menuStackArr.findIndex((value) => value === menuId);
    let copyStack = menuStackArr.slice(0, index + 1);
    console.log(copyStack);
    handleMenuChenge(copyStack);
  };
  return (
    <Card
      sx={{
        display: "flex",
        flexWrap: "wrap",
        gap: 0,
        justifyContent: "flex-start",
        m: 1,
        p: 0,
      }}
    >
      <CardActions>
        <Box
          sx={{
            display: "flex",
            flexWrap: "wrap",
            gap: 1,
            justifyContent: "flex-start",
            width: "100%",
            m: 0,
          }}
        >
          {menuStackArr.map((menu, index) => {
            return (
              <Typography
                color="primary"
                key={`index ${index}`}
                onClick={() => CalculateNewStack(menu)}
                sx={{ cursor: "pointer", textDecoration: "underline" }}
              >
                {allMenus[menu].title}/
              </Typography>
            );
          })}
        </Box>
      </CardActions>
    </Card>
  );
}

/*
      <CardContent>
        <Typography variant="h20">
          CurrentMenu = {allMenus[menuStackArr[menuStackArr.length - 1]].title}
        </Typography>
      </CardContent>
      */
