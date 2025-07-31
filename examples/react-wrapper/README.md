# Accend Link React Integration Example

A React implementation demonstrating how to create a wrapper component for the Accend Link SDK.

## Overview

This example shows how to integrate the Accend Link SDK into a React application using a custom wrapper component. The wrapper handles SDK initialization, lifecycle management, and provides a clean React API for configuration and event handling.

This README will include instructions on how to run the example, as well as context for how this SDK works.

## Prerequisites

- Node.js 16+ installed
- React 18+ application
- A valid customer access token from your Accend Link backend integration (and a way to ensure that you have a latest refreshed token)

## Running the Example

You can run the example to see what it can do, but this repo is intended to serve as an example for how you might integrate it into your own app.

### 1. Install Dependencies

```bash
npm install
```

### 2. Update Configuration

Replace the test token in `src/App.tsx` with your actual customer access token:

```tsx
const accendConfig: AccendConfig = {
  data: {
    customerAccessToken: "your-actual-customer-access-token",
  },
};
```

### 3. Start Development Server

```bash
npm start
```

The application will be available at `http://localhost:1234`.

## Integration

Below you can find information on how to integrate this into your own stack, and more context on how this works.

### The `@accend/link-types` library

At its center, the `@accend/link-types` library is the core of this implementation. This package provides the `initializeAccendLink` function that handles the integration with the Accend Link SDK, along with comprehensive TypeScript support for configuration objects and callback functions.

Behind the scenes, `@accend/link-types` dynamically loads the front-end Accend Link JavaScript SDK, ensuring your application only downloads the SDK when it's actually needed. This approach keeps your initial bundle size small while providing seamless integration.

The library supports both production and staging environments, allowing you to easily switch between environments for development and testing purposes.

To integrate this into your React application, you'll need to create a wrapper component (like the `AccendLink` component in this example) within your own React app. This wrapper ensures the SDK is properly initialized within React's component lifecycle and provides a clean, React-friendly API for configuration and event handling.

### AccendLink Component

The `AccendLink` component is a React wrapper that handles the initialization and lifecycle of the Accend Link SDK. Here's how it works:

**Key Features:**

- Automatically initializes the SDK when the component mounts
- Handles proper cleanup and lifecycle management
- Provides a clean React API for configuration and callbacks
- Uses refs to ensure the SDK targets the correct DOM element to load content into

**Implementation Example:**

```tsx
// src/AccendLink.tsx
import React, { useEffect, useState } from "react";
import { AccendLinkProps, initializeAccendLink } from "@accend/link-types";

const AccendLink: React.FC<AccendLinkProps> = (props) => {
  const [componentMount, setComponentMount] = useState<HTMLDivElement | null>(
    null
  );

  useEffect(() => {
    const target = componentMount;
    if (target && target.children.length === 0) {
      initializeAccendLink(
        {
          target,
          props,
        },
        {
          // Specify using the staging environment for testing
          env: "staging",
        }
      );
    }
    // AccendLink does not support changing props after initialisation.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [componentMount]);

  return (
    <div
      style={
        {
          // as an example, you can style this however you see fit.
        }
      }
      ref={setComponentMount}
    />
  );
};

export default AccendLink;
```

## SDK Environment Configuration

The `@accend/link-types` library supports both production and staging environments through the `sdkConfig` parameter. This allows you to easily switch between environments for development, testing, and production deployment.

### Environment Options

| Environment    | Description                                      | Use Case                              |
| -------------- | ------------------------------------------------ | ------------------------------------- |
| `"production"` | Stable, production-ready SDK (default)           | Live applications serving real users  |
| `"staging"`    | Development/testing version with latest features | Development, testing, and integration |

### Configuring the Environment

You can specify the environment when initializing AccendLink by passing a second parameter to `initializeAccendLink`:

```tsx
// Using staging environment (for development/testing)
initializeAccendLink(
  {
    target,
    props,
  },
  {
    env: "staging",
  }
);

// Using production environment (default - can be omitted)
initializeAccendLink(
  {
    target,
    props,
  },
  {
    env: "production",
  }
);

// Default behavior (production environment)
initializeAccendLink({
  target,
  props,
});
```

### Dynamic Environment Selection

You can also make the environment configurable based on your application's deployment:

```tsx
const sdkConfig = {
  env: process.env.NODE_ENV === "production" ? "production" : "staging",
};

initializeAccendLink(
  {
    target,
    props,
  },
  sdkConfig
);
```

### Example: Using the Component

Once you have the AccendLink component, you can use it in your React application.

As an example, you could load it and display it on a page, just like this:

```tsx
import AccendLink from "./AccendLink";
import { AccendConfig } from "@accend/link-types";

const config: AccendConfig = {
  data: {
    customerAccessToken: "your-customer-access-token",
  },
  component: {
    theme: {
      primary: "#123413",
    },
  },
};

const handleSuccess = () => {
  console.log("Document upload successful");
};

const handleError = (error?: Error) => {
  console.error("Upload failed:", error?.message);
};

<AccendLink config={config} onSuccess={handleSuccess} onFail={handleError} />;
```

### Example: Modal Integration

You can also use it as a modal, for example, with the MUI modal as featured in this example app.

```tsx
const [modalOpen, setModalOpen] = useState(false);

return (
  <Dialog open={modalOpen}>
    {modalOpen && (
      <AccendLink
        config={config}
        onSuccess={() => {
          handleSuccess();
          setModalOpen(false);
        }}
        onFail={handleError}
      />
    )}
  </Dialog>
);
```

## Authentication

Authentication is managed through customer access tokens that are generated server-side using your Accend Link backend integration. These tokens provide secure access to the Accend Link SDK and must be obtained through your backend API.

Customer Access tokens will generally have an expiration date, and should be refreshed via the Accend API. You can find the [staging API here](https://api.staging.withaccend.com/redoc)

**Important Security Note:** Customer access tokens should never be hardcoded in client-side code. Always fetch them dynamically from your secure backend API.

### Customer Access Tokens

Customer access tokens must be generated server-side using your Accend Link backend integration.

### Example: Token Generation Steps

1. Set up server-side token generation using your backend integration
2. Create an API endpoint to generate tokens for authenticated users
3. Fetch tokens in your React application as needed
4. Pass tokens to the AccendLink component via the config prop

## Configuration Reference

The AccendConfig object allows you to customize various aspects of the Accend Link SDK. While currently focused on authentication, future versions will include theming options and additional customization features.

### Basic Configuration

### AccendConfig Interface

| Property                   | Type   | Required | Description                                   |
| -------------------------- | ------ | -------- | --------------------------------------------- |
| `data.customerAccessToken` | string | ✓        | Authentication token for the customer session |

### AccendLink Component Props

| Property    | Type         | Required | Description                      |
| ----------- | ------------ | -------- | -------------------------------- |
| `config`    | AccendConfig | ✓        | Configuration object for the SDK |
| `onSuccess` | function     | ✗        | Callback when upload succeeds    |
| `onFail`    | function     | ✗        | Callback when an error occurs    |

### SDK Configuration (initializeAccendLink)

The `initializeAccendLink` function accepts two parameters:

#### First Parameter: Initialization Options

| Property | Type            | Required | Description                                    |
| -------- | --------------- | -------- | ---------------------------------------------- |
| `target` | HTMLElement     | ✓        | DOM element where SDK will be rendered         |
| `props`  | AccendLinkProps | ✓        | Component props including config and callbacks |

#### Second Parameter: SDK Configuration

| Property | Type                          | Required | Default        | Description            |
| -------- | ----------------------------- | -------- | -------------- | ---------------------- |
| `env`    | `"production"` \| `"staging"` | ✗        | `"production"` | SDK environment to use |

## TypeScript Support

### Installing Types

```bash
npm install @accend/link-types
```

### Importing Types

```tsx
import {
  AccendConfig,
  AccendLinkProps,
  initializeAccendLink,
} from "@accend/link-types";
```

### Type Definitions

The package provides complete TypeScript definitions for all configuration options and callback functions.

## File Structure

```
src/
├── AccendLink.tsx           # React wrapper component
├── App.tsx                  # Demo application
└── index.tsx                # Application entry point
```

## Questions

Please contact the Accend team through Slack with any questions!
