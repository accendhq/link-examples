# Accend Link Vanilla JS Integration Example

A vanilla JavaScript implementation demonstrating how to integrate the Accend Link SDK without any frameworks or build tools.

## Overview

This example shows how to integrate the Accend Link SDK into a web application using only vanilla JavaScript. It demonstrates dynamic SDK loading, initialization, and event handling without requiring any build tools or frameworks. This approach provides maximum flexibility and compatibility with any web project.

This README will include instructions on how to run the example, as well as context for how this SDK works in a framework-free environment.

## Prerequisites

- Modern web browser with ES6 module support
- Local web server (for development)
- A valid customer access token from your Accend Link backend integration (and a way to ensure that you have a latest refreshed token)

## Running the Example

You can run the example to see what it can do, but this repo is intended to serve as an example for how you might integrate it into your own vanilla JavaScript app.

### 1. Install Dependencies

```bash
npm install
```

### 2. Update Configuration

Replace the demo customer access token in `index.html` with your actual token:

```javascript
customerAccessToken: "your-actual-customer-access-token";
```

### 3. Start Development Server

```bash
npm start
```

The application will be available at `http://localhost:8080`.

### 4. Alternative Quick Start

Use the provided script:

```bash
./run-demo.sh
```

## Integration

Below you can find information on how to integrate this into your own vanilla JavaScript stack, and more context on how this works.

### Direct SDK Integration

Unlike React implementations that require wrapper components, vanilla JavaScript applications can directly instantiate the Accend Link SDK. This provides the most straightforward integration path and gives you complete control over the SDK lifecycle.

The vanilla JavaScript approach uses ES6 dynamic imports to load the SDK at runtime, ensuring your initial page load remains fast while providing seamless integration when needed.

### Basic Implementation

Here's how the core integration works:

**Key Features:**

- Dynamic ES6 module loading for optimal performance
- Direct SDK instantiation without framework overhead
- Simple DOM element targeting for SDK rendering
- Comprehensive error handling for network issues
- Auto-initialization on page load for seamless user experience

**Implementation Example:**

```javascript
// 1. Define SDK URLs
const LINK_SDK_URL = "https://static.withaccend.com/sdk/v1/link.min.js";
const LINK_SDK_STAGING_URL =
  "https://static.withaccend.com/sdk/staging/link.min.js";

// 2. Auto-initialize on page load
document.addEventListener("DOMContentLoaded", async () => {
  const container = document.getElementById("accend-link-container");

  try {
    // Load SDK
    const module = await import(LINK_SDK_STAGING_URL);

    // Initialize immediately
    const instance = new module.AccendLink({
      target: container,
      props: {
        config: {
          data: {
            customerAccessToken: "your-customer-access-token",
          },
          component: {
            theme: {
              primary: "#2196f3",
            },
          },
        },
        onSuccess: () => console.log("Success!"),
        onFail: (error) => console.error("Error:", error),
      },
    });
  } catch (error) {
    console.error("Failed to load AccendLink:", error);
  }
});
```

### Example: Manual Control

If you prefer to have manual control over when AccendLink initializes, you can implement it with user interaction:

```javascript
let accendLinkInstance = null;

async function initializeAccendLink() {
  const container = document.getElementById("accend-link-container");

  try {
    const module = await import(LINK_SDK_STAGING_URL);

    accendLinkInstance = new module.AccendLink({
      target: container,
      props: {
        config: {
          data: {
            customerAccessToken: "your-customer-access-token",
          },
        },
        onSuccess: () => {
          console.log("Document upload successful");
          showSuccessMessage();
        },
        onFail: (error) => {
          console.error("Upload failed:", error);
          showErrorMessage(error);
        },
      },
    });
  } catch (error) {
    console.error("Failed to initialize AccendLink:", error);
  }
}

// Call when user clicks a button
document
  .getElementById("init-button")
  .addEventListener("click", initializeAccendLink);
```

### Example: SDK Instance Control

Once you have an AccendLink instance, you can control it programmatically:

```javascript
// Open the AccendLink interface (if it supports modal mode)
if (accendLinkInstance && accendLinkInstance.open) {
  accendLinkInstance.open();
}

// Close the AccendLink interface
if (accendLinkInstance && accendLinkInstance.close) {
  accendLinkInstance.close();
}

// Clean up when done
if (accendLinkInstance && accendLinkInstance.unmount) {
  accendLinkInstance.unmount();
}
```

## SDK Environment Configuration

### Available Environments

The Accend Link SDK is available in two environments that you can choose from based on your development needs:

```javascript
// Production SDK - for live applications
const LINK_SDK_URL = "https://static.withaccend.com/sdk/v1/link.min.js";

// Staging SDK - for development and testing
const LINK_SDK_STAGING_URL =
  "https://static.withaccend.com/sdk/staging/link.min.js";
```

### Environment Selection

```javascript
// Use staging for development (default in this example)
const baseUrl = LINK_SDK_STAGING_URL;

// Use production for live applications
const baseUrl = LINK_SDK_URL;

// Environment-based selection
const baseUrl =
  window.location.hostname === "localhost"
    ? LINK_SDK_STAGING_URL
    : LINK_SDK_URL;
```

## Authentication

Authentication is managed through customer access tokens that are generated server-side using your Accend Link backend integration. These tokens provide secure access to the Accend Link SDK and must be obtained through your backend API.

Customer Access tokens will generally have an expiration date, and should be refreshed via the Accend API. You can find the [staging API here](https://api.staging.withaccend.com/redoc)

**Important Security Note:** Customer access tokens should never be hardcoded in client-side code. Always fetch them dynamically from your secure backend API.

### Customer Access Tokens

Customer access tokens must be generated server-side. Example fetch implementation:

```javascript
async function getCustomerToken() {
  const response = await fetch("/api/accend-token", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
  });

  const data = await response.json();
  return data.customerAccessToken;
}

// Use in configuration
const token = await getCustomerToken();
const config = {
  data: { customerAccessToken: token },
};
```

### Example: Token Generation Steps

1. Set up server-side token generation using your backend integration
2. Create an API endpoint to generate tokens for authenticated users
3. Fetch tokens in your JavaScript application as needed
4. Pass tokens to the AccendLink SDK via the config object

## Configuration Reference

The AccendConfig object allows you to customize various aspects of the Accend Link SDK. While currently focused on authentication, future versions will include theming options and additional customization features.

### Basic Configuration

### Configuration Structure

| Property                   | Type   | Required | Description          |
| -------------------------- | ------ | -------- | -------------------- |
| `data.customerAccessToken` | string | ✓        | Authentication token |
| `component.theme.primary`  | string | ✗        | Primary color theme  |

### Event Callbacks

| Callback    | Type     | Description                 |
| ----------- | -------- | --------------------------- |
| `onSuccess` | function | Called when upload succeeds |
| `onFail`    | function | Called when an error occurs |

### Instance Methods

| Method          | Description                    |
| --------------- | ------------------------------ |
| `open()`        | Open the AccendLink interface  |
| `close()`       | Close the AccendLink interface |
| `update(props)` | Update configuration           |
| `unmount()`     | Clean up and remove            |

## Browser Compatibility

- **Modern Browsers**: Chrome 61+, Firefox 60+, Safari 11+, Edge 16+
- **ES6 Modules**: Required for dynamic imports
- **No Polyfills Needed**: Uses native browser APIs

## Common Issues & Solutions

| Issue                      | Cause                    | Solution                           |
| -------------------------- | ------------------------ | ---------------------------------- |
| Module loading errors      | CORS or network issues   | Ensure proper server configuration |
| AccendLink class not found | Incorrect SDK URL        | Verify SDK URL and version         |
| Container not found        | DOM not ready            | Wait for DOMContentLoaded event    |
| Token errors               | Invalid or expired token | Generate new token server-side     |

## Implementation Notes

### Dynamic Loading

- The SDK is loaded at runtime using ES6 dynamic imports
- No build tools or bundlers required
- Works with any modern web server

### DOM Integration

- Requires a target DOM element for initialization
- The SDK takes full control of the target element
- Clean up properly when destroying instances

### Event Handling

- All events are handled through callback functions
- Success and error states should be managed in your application
- Consider implementing loading states for better user experience

## File Structure

```
examples/vanilla-js/
├── index.html          # Main demo page with implementation
├── package.json        # Dev server configuration
└── README.md           # This documentation
```

## Questions

Please contact the Accend team through Slack with any questions!
