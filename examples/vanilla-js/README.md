# Accend Link Vanilla JS Integration Example

A vanilla JavaScript implementation demonstrating how to integrate the Accend Link SDK without any frameworks.

## Overview

This example shows how to integrate the Accend Link SDK into a web application using only vanilla JavaScript. It demonstrates dynamic SDK loading, initialization, and event handling without requiring any build tools or frameworks.

## Prerequisites

- Modern web browser with ES6 module support
- Local web server (for development)
- A valid customer access token from your Accend Link backend integration

## Running This Example

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

### 4. Open in Browser

Navigate to the served URL and click "Initialize AccendLink" to test the integration.

## Implementation

### Basic Integration

```javascript
// Define SDK URLs
const LINK_SDK_URL = "https://static.withaccend.com/sdk/v1/link.min.js";
const LINK_SDK_STAGING_URL =
  "https://static.withaccend.com/sdk/staging/link.min.js";

// Get container element
const container = document.getElementById("accend-link-container");

// Load and initialize SDK
const module = await import(LINK_SDK_STAGING_URL);
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
```

### SDK Instance Control

```javascript
// Open the AccendLink interface
instance.open();

// Close the AccendLink interface
instance.close();

// Update configuration (requires re-initialization)
instance.update(newProps);

// Clean up when done
instance.unmount();
```

### Error Handling

```javascript
try {
  const module = await import(LINK_SDK_STAGING_URL);

  if (!module.AccendLink) {
    throw new Error("AccendLink class not found in SDK module");
  }

  const instance = new module.AccendLink({
    target: container,
    props: config,
  });
} catch (error) {
  console.error("Failed to load AccendLink SDK:", error);
}
```

## SDK Environment Configuration

### Available Environments

```javascript
// Production SDK
const LINK_SDK_URL = "https://static.withaccend.com/sdk/v1/link.min.js";

// Staging SDK (for development/testing)
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

## Configuration Reference

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
- Consider implementing loading states for better UX

## File Structure

```
examples/vanilla-js/
├── index.html          # Main demo page with implementation
├── package.json        # Dev server configuration
└── README.md           # This documentation
```

## Dependencies

```json
{
  "devDependencies": {
    "http-server": "^14.1.1"
  }
}
```

## Next Steps

1. Replace the demo customer access token with your actual token
2. Implement server-side token generation endpoint
3. Configure environment-specific SDK URLs
4. Add proper error handling and user feedback
5. Style the container to match your application design
