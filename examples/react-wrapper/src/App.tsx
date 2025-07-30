import React, { useState } from "react";
import {
  Box,
  Button,
  Card,
  CardContent,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Grid,
  IconButton,
  Paper,
  Snackbar,
  Alert,
  Typography,
} from "@mui/material";
import AccendLink from "./AccendLink";
import { AccendConfig } from "@accend/link-types";

const App: React.FC = () => {
  const [open, setOpen] = useState(false);
  const [alertOpen, setAlertOpen] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");
  const [alertSeverity, setAlertSeverity] = useState<"success" | "error">(
    "success"
  );

  const handleClickOpen = () => {
    console.log("Opening customer account connection dialog");
    setOpen(true);
  };

  const handleClose = () => {
    console.log("Closing customer account connection dialog");
    setOpen(false);
  };

  const handleSuccess = () => {
    console.log("Customer account connection success handler called");
    // For demo purposes, simulating documents
    setAlertMessage("Documents uploaded successfully!");
    setAlertSeverity("success");
    setAlertOpen(true);
    setOpen(false);
  };

  const handleFail = (error?: Error) => {
    console.log(
      "Document upload fail handler called:",
      error?.message || "Unknown error"
    );
    setAlertMessage("Error: " + (error?.message || "Unknown error"));
    setAlertSeverity("error");
    setAlertOpen(true);
  };

  const handleAlertClose = () => {
    setAlertOpen(false);
  };

  // Define the config for AccendLink
  const accendConfig: AccendConfig = {
    data: {
      // This customer access token should be replaced with the actual customer access token
      // you get from the Accend Link SDK API (likely through your own backend calls.)
      customerAccessToken: "cust_token_34ec7549-e874-4a57-9661-e444c2db453f",
    },
    component: {
      theme: {
        primary: "#123413",
      },
    },
  };

  return (
    <Box sx={{ width: "100%", maxWidth: 800, margin: "0 auto", padding: 3 }}>
      <Typography variant="h4" component="h1" gutterBottom color="primary">
        Accend Link React Wrapper Demo
      </Typography>

      <Typography variant="body1" paragraph>
        This example demonstrates using the Accend Link SDK with a custom React
        wrapper. The wrapper is implemented in this application, not in the base
        library.
      </Typography>

      <Grid container spacing={3}>
        <Grid item xs={12}>
          <Paper
            sx={{
              p: 3,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
            }}
          >
            <Typography variant="h5" component="h2" gutterBottom>
              Document Upload Demo
            </Typography>
            <Typography variant="body1" paragraph>
              Click the button below to open the Accend Link modal for document
              upload.
            </Typography>
            <Button
              variant="contained"
              color="primary"
              onClick={handleClickOpen}
              startIcon={<span className="material-icons">upload_file</span>}
            >
              Upload Documents
            </Button>
          </Paper>
        </Grid>
      </Grid>

      {/* Modal Dialog */}
      <Dialog
        open={open}
        onClose={handleClose}
        maxWidth="md"
        TransitionProps={{
          timeout: { enter: 300, exit: 200 },
        }}
        PaperProps={{
          sx: {
            bgcolor: "background.paper",
            boxShadow: 24,
            borderRadius: 2,
            overflow: "hidden",
          },
        }}
      >
        <DialogTitle sx={{ bgcolor: "#f5f5f5" }}>
          <div style={{ fontWeight: 500, fontSize: "1.25rem" }}>
            Upload Documents
          </div>
          <IconButton
            aria-label="close"
            onClick={handleClose}
            sx={{
              position: "absolute",
              right: 8,
              top: 8,
              color: (theme) => theme.palette.grey[500],
            }}
          >
            <span className="material-icons">close</span>
          </IconButton>
        </DialogTitle>
        <DialogContent
          dividers
          sx={{
            p: 0,
            minWidth: "600px",
            minHeight: "620px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          {/* 
            For modal environments, a unique key ensures fresh mounting when dialog opens/reopens
          */}
          {open && (
            <AccendLink
              config={accendConfig}
              onSuccess={handleSuccess}
              onFail={handleFail}
            />
          )}
        </DialogContent>
        <DialogActions sx={{ bgcolor: "#f5f5f5" }}>
          <Button onClick={handleClose} color="primary">
            Cancel
          </Button>
        </DialogActions>
      </Dialog>

      {/* Alert Snackbar */}
      <Snackbar
        open={alertOpen}
        autoHideDuration={6000}
        onClose={handleAlertClose}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <Alert
          onClose={handleAlertClose}
          severity={alertSeverity}
          sx={{ width: "100%" }}
        >
          {alertMessage}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default App;
