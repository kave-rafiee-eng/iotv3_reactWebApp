import * as React from "react";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";
import { alpha } from "@mui/material/styles";
import Icon from "@mui/material/Icon";

import LanguageIcon from "@mui/icons-material/Language";
import { Stack } from "@mui/material";

import i18n from "./../utils/i18next";

export default function LanguageSelector() {
  const [language, setLanguage] = React.useState("en");

  React.useEffect(() => {
    i18n.changeLanguage(language);
  });

  return (
    <Stack
      direction="row"
      alignItems="center"
      spacing={1.5}
      sx={{
        bgcolor: "background.paper",
        borderRadius: 3,
        px: 0,
        py: 0,
      }}
    >
      <LanguageIcon sx={{ color: "text.secondary", fontSize: 20 }} />

      <FormControl variant="standard" sx={{ minWidth: 30 }}>
        <Select
          onChange={(e) => {
            setLanguage(e.target.value);
            //i18n.changeLanguage(e.target.value);
          }}
          value={language}
          disableUnderline
          sx={{
            fontSize: "0.95rem",
            fontWeight: 500,
            color: "text.primary",
            "& .MuiSelect-select": {
              pr: 1,
              py: 0.6,
            },
            "& .MuiSelect-icon": {
              right: 0,
              color: "text.secondary",
            },
            maxWidth: 50,
          }}
          MenuProps={{
            PaperProps: {
              sx: {
                borderRadius: 2,
                mt: 0.5,
                boxShadow: 4,
                minWidth: 100,
              },
            },
          }}
        >
          <MenuItem value="" disabled sx={{ fontStyle: "italic" }}>
            Language
          </MenuItem>
          <MenuItem value="en">🇬🇧 English</MenuItem>
          <MenuItem value="fa">🇮🇷 فارسی</MenuItem>
        </Select>
      </FormControl>
    </Stack>
  );
}
