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
      "Document upload fail handler called:",
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
      customerAccessToken: "cust_token_34ec7549-e874-4a57-9661-e444c2db453f",
    },
    component: {
      theme: {
        primary: "#123413",
      },
    },
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-12 max-w-4xl">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Accend Link Next.js Example
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            This example demonstrates using the Accend Link SDK with Next.js.
            The key difference from other React implementations is the use of
            the{" "}
            <code className="bg-gray-100 px-2 py-1 rounded text-sm font-mono">
              webpackIgnore
            </code>{" "}
            magic comment to prevent webpack from parsing the dynamic import.
          </p>
        </div>

        {/* Main Content */}
        <div className="bg-white rounded-lg shadow-md p-8 mb-8">
          <div className="text-center">
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">
              Document Upload Demo
            </h2>
            <p className="text-gray-600 mb-6">
              Click the button below to open the Accend Link modal for document
              upload.
            </p>
            <button
              onClick={handleClickOpen}
              className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-6 rounded-lg transition-colors duration-200 flex items-center gap-2 mx-auto"
            >
              <svg
                className="w-5 h-5"
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
              Upload Documents
            </button>
          </div>
        </div>

        {/* Key Differences Section */}
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-yellow-800 mb-3">
            🔧 Next.js Implementation Notes
          </h3>
          <div className="text-yellow-700 space-y-2">
            <p>
              <strong>Webpack Magic Comment:</strong> The{" "}
              <code className="bg-yellow-100 px-2 py-1 rounded text-sm font-mono">
                {`/* webpackIgnore: true */`}
              </code>{" "}
              comment is critical for Next.js builds to prevent webpack from
              trying to parse the external SDK.
            </p>
            <p>
              <strong>Client Component:</strong> The page uses{" "}
              <code className="bg-yellow-100 px-2 py-1 rounded text-sm font-mono">
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
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-hidden">
            {/* Modal Header */}
            <div className="bg-gray-50 px-6 py-4 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-gray-900">
                  Upload Documents
                </h3>
                <button
                  onClick={handleClose}
                  className="text-gray-400 hover:text-gray-600 transition-colors"
                >
                  <svg
                    className="w-6 h-6"
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
            </div>

            {/* Modal Content */}
            <div className="p-0 min-h-[620px] flex items-center justify-center">
              <AccendLink
                config={accendConfig}
                onSuccess={handleSuccess}
                onFail={handleFail}
              />
            </div>

            {/* Modal Footer */}
            <div className="bg-gray-50 px-6 py-4 border-t border-gray-200">
              <button
                onClick={handleClose}
                className="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Alert Notification */}
      {alertOpen && (
        <div className="fixed bottom-4 right-4 z-50">
          <div
            className={`${
              alertType === "success"
                ? "bg-green-500 text-white"
                : "bg-red-500 text-white"
            } px-6 py-4 rounded-lg shadow-lg flex items-center gap-3 max-w-md`}
          >
            <div className="flex-1">{alertMessage}</div>
            <button
              onClick={handleAlertClose}
              className="text-white hover:text-gray-200 transition-colors"
            >
              <svg
                className="w-5 h-5"
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
        </div>
      )}
    </div>
  );
}
