# Accend Link React Integration Example

A React implementation demonstrating how to create a wrapper component for the Accend Link SDK.

## Overview

This example shows how to integrate the Accend Link SDK into a React application using a custom wrapper component. The wrapper handles SDK initialization, lifecycle management, and provides a clean React API for configuration and event handling.

## Prerequisites

- Node.js 16+ installed
- React 18+ application
- A valid customer access token from your Accend Link backend integration

## Running This Example

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

### 4. Alternative Quick Start

Use the provided script:

```bash
./run-demo.sh
```

## Implementation

### AccendLink Component

The core wrapper component that integrates the SDK with React:

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
      initializeAccendLink({
        target,
        props,
      });
    }
    // AccendLink does not support changing props after initialisation.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [componentMount]);

  return (
    <div
      style={{
        width: "100%",
        maxHeight: "95%",
      }}
      ref={setComponentMount}
    />
  );
};

export default AccendLink;
```

### Using the Component

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

### Modal Integration

For modal implementations, use conditional rendering to ensure fresh component mounting:

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

### Customer Access Tokens

Customer access tokens must be generated server-side using your Accend Link backend integration.

**Important:** Never generate customer access tokens on the client side, as this would expose your API credentials.

### Token Generation Steps

1. Set up server-side token generation using your backend integration
2. Create an API endpoint to generate tokens for authenticated users
3. Fetch tokens in your React application as needed
4. Pass tokens to the AccendLink component via the config prop

## Configuration Reference

### AccendConfig Interface

| Property                   | Type   | Required | Description                                   |
| -------------------------- | ------ | -------- | --------------------------------------------- |
| `data.customerAccessToken` | string | ✓        | Authentication token for the customer session |
| `component.theme.primary`  | string | ✗        | Primary color theme                           |

### AccendLink Component Props

| Property    | Type         | Required | Description                      |
| ----------- | ------------ | -------- | -------------------------------- |
| `config`    | AccendConfig | ✓        | Configuration object for the SDK |
| `onSuccess` | function     | ✗        | Callback when upload succeeds    |
| `onFail`    | function     | ✗        | Callback when an error occurs    |

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

## Implementation Notes

### Component Lifecycle

- The AccendLink component initializes the SDK only once when first mounted
- Props cannot be changed after initialization - unmount and remount for new configurations
- The component automatically handles cleanup when unmounted
- For modal scenarios, use conditional rendering to ensure fresh mounting

### Best Practices

1. **Token Security**: Always generate tokens server-side
2. **Error Handling**: Implement both `onSuccess` and `onFail` callbacks
3. **Modal Integration**: Use conditional rendering for modal implementations
4. **Component Sizing**: Set appropriate container dimensions for your layout

## Integration Examples

### Basic Integration

```tsx
function MyComponent() {
  return (
    <div style={{ width: "600px", height: "400px" }}>
      <AccendLink config={config} />
    </div>
  );
}
```

### With State Management

```tsx
function DocumentUpload() {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  return (
    <AccendLink
      config={config}
      onSuccess={() => {
        setUploading(false);
        setError(null);
      }}
      onFail={(error) => {
        setUploading(false);
        setError(error?.message || "Upload failed");
      }}
    />
  );
}
```

## File Structure

```
src/
├── AccendLink.tsx           # React wrapper component
├── App.tsx                  # Demo application
└── index.tsx                # Application entry point
```

## Dependencies

```json
{
  "@accend/link-types": "latest",
  "react": "^18.x.x",
  "react-dom": "^18.x.x"
}
```

## Next Steps

1. Replace the demo customer access token with your actual token
2. Implement server-side token generation
3. Integrate the component into your application's modal or page layout
4. Add appropriate error handling and user feedback
5. Style the container to match your application design
