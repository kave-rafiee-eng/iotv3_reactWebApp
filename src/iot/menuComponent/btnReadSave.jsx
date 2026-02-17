import { Button, TextField, Stack } from "@mui/material";
export default function BtnReadSave({
  disabledRead,
  disabledSave,
  handleRead,
  handleSave,
}) {
  return (
    <Stack
      direction="row"
      spacing={1}
      alignItems="center"
      justifyContent="center"
    >
      <Button variant="contained" disabled={disabledRead} onClick={handleRead}>
        Read
      </Button>
      <Button variant="contained" disabled={disabledSave} onClick={handleSave}>
        Write
      </Button>
    </Stack>
  );
}
