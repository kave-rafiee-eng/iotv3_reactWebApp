import Toolbar from "@mui/material/Toolbar";
import CssBaseline from "@mui/material/CssBaseline";
import IconButton from "@mui/material/IconButton";
import MenuIcon from "@mui/icons-material/Menu";
import MuiAppBar from "@mui/material/AppBar";
import { Icon, Stack } from "@mui/material";
import LanguageSelector from "./languageSelect";

import { styled, useTheme } from "@mui/material/styles";

const drawerWidth = "100%";

const AppBar = styled(MuiAppBar, {
  shouldForwardProp: (prop) => prop !== "open",
})(({ theme }) => ({
  zIndex: theme.zIndex.drawer + 1,
  transition: theme.transitions.create(["width", "margin"], {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  variants: [
    {
      props: ({ open }) => open,
      style: {
        marginLeft: drawerWidth,
        width: `calc(100% - ${drawerWidth})`,
        transition: theme.transitions.create(["width", "margin"], {
          easing: theme.transitions.easing.sharp,
          duration: theme.transitions.duration.enteringScreen,
        }),
      },
    },
  ],
}));

export default function MyAppBar({ open, handleDrawerOpen }) {
  return (
    <>
      <CssBaseline />

      <AppBar
        position="fixed"
        open={open}
        sx={{
          height: "10vh",
          m: 0,
          justifyItems: "center",
        }}
      >
        <Toolbar
          sx={{
            width: "100%",
            height: "100%",
          }}
        >
          <Stack
            direction={"row"}
            justifyContent={"center"}
            alignItems={"center"}
            sx={{
              marginBottom: 1,
            }}
          >
            <IconButton
              color="inherit"
              aria-label="open drawer"
              onClick={handleDrawerOpen}
              edge="start"
              sx={[
                {
                  marginRight: 3,
                },
                open && { display: "none" },
              ]}
            >
              <MenuIcon />
            </IconButton>
            <LanguageSelector />
          </Stack>
        </Toolbar>
      </AppBar>
    </>
  );
}
