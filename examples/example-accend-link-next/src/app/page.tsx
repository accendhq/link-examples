"use client";

import { useState } from "react";
import AccendLink from "@/components/AccendLink";

export default function Home() {
  const [open, setOpen] = useState(false);
  const [alertOpen, setAlertOpen] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");
  const [alertType, setAlertType] = useState<"success" | "error">("success");

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
    setAlertMessage("Documents uploaded successfully!");
    setAlertType("success");
    setAlertOpen(true);
    setOpen(false);
  };

  const handleFail = (error?: Error) => {
    console.log(
      "Connect accounts fail handler called:",
      error?.message || "Unknown error"
    );
    setAlertMessage("Error: " + (error?.message || "Unknown error"));
    setAlertType("error");
    setAlertOpen(true);
  };

  const handleAlertClose = () => {
    setAlertOpen(false);
  };

  // Define the config for AccendLink
  const accendConfig = {
    data: {
      // This customer access token should be replaced with the actual customer access token
      // you get from the Accend Link SDK API (likely through your own backend calls.)
      // This is a test token, and will not work in production.
      customerAccessToken: "cust_token_34ec7549-e874-4a57-9661-e444c2db453a",
    },
    component: {
      theme: {
        primary: "#2196f3",
      },
    },
  };

  const styles = {
    body: {
      fontFamily:
        '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Oxygen, Ubuntu, Cantarell, "Open Sans", "Helvetica Neue", sans-serif',
      margin: 0,
      padding: "20px",
      backgroundColor: "#f5f5f5",
      color: "#333",
      minHeight: "100vh",
    },
    container: {
      maxWidth: "960px",
      margin: "0 auto",
    },
    title: {
      color: "#2196f3",
      marginBottom: "1rem",
      fontSize: "2.5rem",
      fontWeight: "bold",
    },
    description: {
      marginBottom: "2rem",
      lineHeight: 1.5,
      fontSize: "16px",
    },
    demoSection: {
      background: "white",
      borderRadius: "8px",
      padding: "24px",
      marginBottom: "24px",
      boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
    },
    sectionTitle: {
      color: "#333",
      marginTop: "2rem",
      marginBottom: "1rem",
      fontSize: "1.5rem",
      fontWeight: "600",
    },
    infoBox: {
      backgroundColor: "#fff3cd",
      color: "#856404",
      border: "1px solid #ffeaa7",
      borderRadius: "4px",
      padding: "16px",
      margin: "16px 0",
    },
    button: {
      padding: "12px 24px",
      backgroundColor: "#2196f3",
      color: "white",
      border: "none",
      borderRadius: "4px",
      cursor: "pointer",
      fontSize: "16px",
      transition: "background-color 0.2s",
      display: "flex",
      alignItems: "center",
      gap: "8px",
      margin: "0 auto",
    },
    modalOverlay: {
      position: "fixed" as const,
      inset: 0,
      backgroundColor: "rgba(0, 0, 0, 0.5)",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      padding: "16px",
      zIndex: 50,
    },
    modal: {
      background: "white",
      borderRadius: "8px",
      maxWidth: "4xl",
      width: "100%",
      maxHeight: "90vh",
      overflow: "hidden",
      boxShadow: "0 10px 25px rgba(0, 0, 0, 0.2)",
    },
    modalHeader: {
      backgroundColor: "#f8f9fa",
      padding: "16px 24px",
      borderBottom: "1px solid #e9ecef",
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
    },
    modalTitle: {
      fontSize: "1.125rem",
      fontWeight: "600",
      color: "#333",
    },
    closeButton: {
      background: "none",
      border: "none",
      color: "#666",
      cursor: "pointer",
      padding: "4px",
      borderRadius: "4px",
      transition: "color 0.2s",
    },
    modalContent: {
      padding: 0,
      minHeight: "620px",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
    },
    modalFooter: {
      backgroundColor: "#f8f9fa",
      padding: "16px 24px",
      borderTop: "1px solid #e9ecef",
    },
    cancelButton: {
      padding: "8px 16px",
      color: "#666",
      background: "none",
      border: "none",
      cursor: "pointer",
      borderRadius: "4px",
      transition: "color 0.2s",
    },
    alert: {
      position: "fixed" as const,
      bottom: "16px",
      right: "16px",
      zIndex: 50,
      padding: "16px 24px",
      borderRadius: "8px",
      boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
      display: "flex",
      alignItems: "center",
      gap: "12px",
      maxWidth: "400px",
    },
    alertSuccess: {
      backgroundColor: "#e8f5e9",
      color: "#2e7d32",
      border: "1px solid #4caf50",
    },
    alertError: {
      backgroundColor: "#ffebee",
      color: "#c62828",
      border: "1px solid #f44336",
    },
  };

  return (
    <div style={styles.body}>
      <div style={styles.container}>
        <h1 style={styles.title}>Accend Link Next.js Demo</h1>

        <div style={styles.description}>
          <p>
            This example demonstrates how to integrate the Accend Link SDK with
            Next.js. The key difference from other React implementations is the
            use of the{" "}
            <code
              style={{
                backgroundColor: "#f1f1f1",
                padding: "2px 6px",
                borderRadius: "3px",
                fontSize: "14px",
                fontFamily: "monospace",
              }}
            >
              webpackIgnore
            </code>{" "}
            magic comment to prevent webpack from parsing the dynamic import.
          </p>
        </div>

        <div style={styles.infoBox}>
          <strong>Note:</strong> This demo uses a test customer access token.
          Replace with your actual token in a production environment.
        </div>

        <div style={styles.demoSection}>
          <h2 style={styles.sectionTitle}>Interactive Demo</h2>
          <div style={{ textAlign: "center" }}>
            <p style={{ color: "#666", marginBottom: "24px" }}>
              Click the button below to open the Accend Link modal for document
              upload.
            </p>
            <button
              onClick={handleClickOpen}
              style={styles.button}
              onMouseOver={(e) =>
                (e.currentTarget.style.backgroundColor = "#1976d2")
              }
              onMouseOut={(e) =>
                (e.currentTarget.style.backgroundColor = "#2196f3")
              }
            >
              <svg
                width="20"
                height="20"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                />
              </svg>
              Connect Accounts
            </button>
          </div>
        </div>

        <div style={styles.demoSection}>
          <h2 style={styles.sectionTitle}>Next.js Implementation Notes</h2>
          <div style={{ color: "#666", lineHeight: 1.6 }}>
            <p>
              <strong>Webpack Magic Comment:</strong> The{" "}
              <code
                style={{
                  backgroundColor: "#f1f1f1",
                  padding: "2px 6px",
                  borderRadius: "3px",
                  fontSize: "14px",
                  fontFamily: "monospace",
                }}
              >
                {`/* webpackIgnore: true */`}
              </code>{" "}
              comment is critical for Next.js builds to prevent webpack from
              trying to parse the external SDK.
            </p>
            <p>
              <strong>Client Component:</strong> The page uses{" "}
              <code
                style={{
                  backgroundColor: "#f1f1f1",
                  padding: "2px 6px",
                  borderRadius: "3px",
                  fontSize: "14px",
                  fontFamily: "monospace",
                }}
              >
                &quot;use client&quot;
              </code>{" "}
              directive since the AccendLink component uses React hooks and DOM
              interactions.
            </p>
            <p>
              <strong>Dynamic Import:</strong> The SDK is loaded at runtime
              using dynamic imports, which is essential for the external script
              integration.
            </p>
          </div>
        </div>
      </div>

      {/* Modal Overlay */}
      {open && (
        <div style={styles.modalOverlay}>
          <div style={styles.modal}>
            {/* Modal Header */}
            <div style={styles.modalHeader}>
              <h3 style={styles.modalTitle}>Upload Documents</h3>
              <button
                onClick={handleClose}
                style={styles.closeButton}
                onMouseOver={(e) => (e.currentTarget.style.color = "#333")}
                onMouseOut={(e) => (e.currentTarget.style.color = "#666")}
              >
                <svg
                  width="24"
                  height="24"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>

            {/* Modal Content */}
            <div style={styles.modalContent}>
              <AccendLink
                config={accendConfig}
                onSuccess={handleSuccess}
                onFail={handleFail}
              />
            </div>

            {/* Modal Footer */}
            <div style={styles.modalFooter}>
              <button
                onClick={handleClose}
                style={styles.cancelButton}
                onMouseOver={(e) => (e.currentTarget.style.color = "#333")}
                onMouseOut={(e) => (e.currentTarget.style.color = "#666")}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Alert Notification */}
      {alertOpen && (
        <div
          style={{
            ...styles.alert,
            ...(alertType === "success"
              ? styles.alertSuccess
              : styles.alertError),
          }}
        >
          <div style={{ flex: 1 }}>{alertMessage}</div>
          <button
            onClick={handleAlertClose}
            style={{
              background: "none",
              border: "none",
              cursor: "pointer",
              padding: "4px",
            }}
          >
            <svg
              width="20"
              height="20"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>
      )}
    </div>
  );
}
