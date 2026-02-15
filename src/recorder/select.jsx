import * as React from "react";
import { useTheme } from "@mui/material/styles";
import OutlinedInput from "@mui/material/OutlinedInput";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";

const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
  PaperProps: {
    style: {
      maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
    },
  },
};

const names = [
  "VeryGood",
  "+4",
  "+3",
  "+2",
  "+1",
  "0",
  "-1",
  "-2",
  "-3",
  "-4",
  "Hell",
];

const week = ["toDay", "-1", "-2", "-3", "-4", "-5", "-6"];

export default function RecordInputs({ handlePostRecord }) {
  const theme = useTheme();

  const [formData, setFromData] = React.useState({
    value: names[0],
    text: "-",
    week: week[0],
  });

  const handleChangeInput = (event) => {
    const {
      target: { value },
    } = event;
    setFromData((prev) => ({
      ...prev,
      text: value,
    }));
  };

  const handleChange = (event) => {
    const {
      target: { value },
    } = event;
    setFromData((prev) => ({
      ...prev,
      value: value,
    }));
  };

  const handleChangeDate = (event) => {
    const {
      target: { value },
    } = event;
    setFromData((prev) => ({
      ...prev,
      week: value,
    }));
  };

  const FindArrindex = (arr, value) => arr.findIndex((v) => v == value);

  const handleButtonClick = () => {
    let dateNow = new Date();

    let weekValue = FindArrindex(week, formData.week);
    let DateSave = dateNow.getTime() - weekValue * 24 * 60 * 60 * 1000;

    console.log(`wee; ${weekValue}`);
    let postData = {
      value: -FindArrindex(names, formData.value) + 5,
      Date: DateSave,
    };

    handlePostRecord(postData);
  };

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        gap: 2,
        alignItems: "center",
        p: 2,
        backgroundColor: "#f5f5f5",
        borderRadius: 2,
      }}
    >
      <FormControl sx={{ minWidth: 100 }}>
        <InputLabel id="DateSelect-lable">Date</InputLabel>
        <Select
          labelId="DateSelect-lable"
          value={formData.week}
          onChange={handleChangeDate}
          input={<OutlinedInput label="Date" />}
          MenuProps={MenuProps}
        >
          {week.map((name) => (
            <MenuItem key={name} value={name}>
              {name}
            </MenuItem>
          ))}
        </Select>
      </FormControl>

      <TextField
        label="Type something"
        variant="outlined"
        value={formData.text}
        onChange={handleChangeInput}
        sx={{ flex: 1 }}
      />

      <FormControl sx={{ minWidth: 100 }}>
        <InputLabel id="demo-multiple-name-label">Select Value</InputLabel>
        <Select
          labelId="demo-multiple-name-label"
          value={formData.value}
          onChange={handleChange}
          input={<OutlinedInput label="Select Names" />}
          MenuProps={MenuProps}
        >
          {names.map((name) => (
            <MenuItem key={name} value={name}>
              {name}
            </MenuItem>
          ))}
        </Select>
      </FormControl>

      <Button variant="contained" color="primary" onClick={handleButtonClick}>
        Submit
      </Button>
    </Box>
  );
}
