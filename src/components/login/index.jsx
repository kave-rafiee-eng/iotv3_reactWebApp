import {
  Avatar,
  Container,
  Paper,
  Typography,
  Box,
  TextField,
  FormControlLabel,
  Checkbox,
  Button,
  Grid,
  Link,
} from "@mui/material";
import LockPersonIcon from "@mui/icons-material/LockPerson";
import UseLocalStorage from "./useLocalStorage";

const LoginPage = () => {
  const [user, setUser] = UseLocalStorage("user", "");

  function handleSubmit() {}
  return (
    <Container maxWidth="xs">
      <Paper elevation={1} sx={{ marginTop: 8, padding: 2 }}>
        <Avatar
          sx={{
            mx: "auto",
            bgcolor: "secondary.main",
            textAlign: "center",
          }}
        >
          <LockPersonIcon />
        </Avatar>

        <Typography component="h1" variant="h5" sx={{ textAlign: "center" }}>
          Sign In
        </Typography>

        <Box
          component="form"
          onSubmit={handleSubmit}
          noValidation
          sx={{ mt: 1 }}
        >
          <TextField
            placeholder="Enter username"
            fullWidth
            required
            autoFocus
            sx={{ mb: 2 }}
            value={user}
            onChange={(e) => setUser(e.target.value)}
          ></TextField>

          <TextField
            placeholder="Enter password"
            fullWidth
            required
            type="password"
            sx={{ mb: 2 }}
          ></TextField>

          <FormControlLabel
            control={<Checkbox value="remember" color="primary" />}
            label="remember me"
          />

          <Button type="submit" variant="contained" fullWidth sx={{ mt: 1 }}>
            Sign In
          </Button>
        </Box>

        <Grid container justifyContent="space-between" sx={{ mt: 1 }}>
          <Link>Forgot password?</Link>
        </Grid>
      </Paper>
    </Container>
  );
};

export default LoginPage;
