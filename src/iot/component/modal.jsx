import * as React from "react";
import Button from "@mui/joy/Button";
import Modal from "@mui/joy/Modal";
import ModalClose from "@mui/joy/ModalClose";
import Typography from "@mui/joy/Typography";
import Sheet from "@mui/joy/Sheet";

import CircularProgress from "@mui/material/CircularProgress";
import Box from "@mui/material/Box";

export default function BasicModal({ open, handleCloseBtn, title, body }) {
  return (
    <React.Fragment>
      <Modal
        aria-labelledby="modal-title"
        aria-describedby="modal-desc"
        open={open}
        onClose={() => handleCloseBtn()}
        sx={{ display: "flex", justifyContent: "center", alignItems: "center" }}
      >
        <Sheet
          variant="outlined"
          sx={{ maxWidth: 500, borderRadius: "md", p: 4, boxShadow: "lg" }}
        >
          <ModalClose variant="plain" sx={{ m: 1 }} />
          <Typography
            component="h2"
            id="modal-title"
            level="h4"
            textColor="inherit"
            sx={{ fontWeight: "lg", mb: 1 }}
          >
            {title}
          </Typography>
          <Typography id="modal-desc" textColor="text.tertiary">
            {body}
          </Typography>

          <Box display="flex" justifyContent="center" alignItems="center">
            <CircularProgress />
          </Box>
        </Sheet>
      </Modal>
    </React.Fragment>
  );
}
