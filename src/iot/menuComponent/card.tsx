import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import CardContent from "@mui/material/CardContent";
import CardActions from "@mui/material/CardActions";
import Card from "@mui/material/Card";
import React from "react";

type CardSettingProps = {
  title: string;
  children: React.ReactNode;
};

export default function CardSetting({ title, children }: CardSettingProps) {
  return (
    <Card
      sx={{
        display: "flex",
        flexDirection: "column",
        m: 1,
      }}
    >
      <CardContent>
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            background: "#e6e3e3",
            alignItems: "center",
            alignContent: "center",
          }}
        >
          <Typography variant="h6">{title}</Typography>
        </Box>
      </CardContent>

      <CardActions>
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            gap: 1,
            justifyContent: "center",
            width: "100%",
            //background: "#b1b1b1",
            m: 1,
            py: 2,
            alignItems: "center",
          }}
        >
          {children}
        </Box>
      </CardActions>
    </Card>
  );
}
