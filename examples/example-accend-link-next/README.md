# Accend Link Next.js Integration Example

A Next.js implementation demonstrating how to integrate the Accend Link SDK with the critical webpack configuration required for Next.js applications.

## Overview

This example shows how to integrate the Accend Link SDK into a Next.js application. The key difference from standard React implementations is the requirement for webpack magic comments to handle external script loading. This example provides a production-ready implementation that showcases the unique considerations required for Next.js applications.

This README will include instructions on how to run the example, as well as context for how this SDK works specifically within Next.js environments.

## Prerequisites

- Node.js 18+ installed
- Next.js 13+ with App Router
- A valid customer access token from your Accend Link backend integration (and a way to ensure that you have a latest refreshed token)

## Running the Example

You can run the example to see what it can do, but this repo is intended to serve as an example for how you might integrate it into your own Next.js app.

### 1. Install Dependencies

```bash
npm install
```

### 2. Update Configuration

Replace the test token in `src/app/page.tsx` with your actual customer access token:

```tsx
const accendConfig = {
  data: {
    customerAccessToken: "your-actual-customer-access-token",
  },
};
```

### 3. Start Development Server

```bash
npm run dev
```

The application will be available at `http://localhost:3000`.

### 4. Build for Production

```bash
npm run build
npm start
```

## Integration

Below you can find information on how to integrate this into your own Next.js stack, and more context on how this works.

### Critical Next.js Requirement

**⚠️ The `/* webpackIgnore: true */` magic comment is absolutely critical for Next.js applications.** Unlike other React implementations, Next.js requires this comment to prevent webpack from attempting to parse the external Accend Link SDK during build time.

Without this magic comment, your Next.js build will fail because webpack will try to bundle the external SDK, which is designed to be loaded at runtime.

### AccendLink Component for Next.js

The `AccendLink` component for Next.js is specifically designed to handle the unique requirements of Next.js applications. Here's how it works:

**Key Features:**

- Uses the critical webpack magic comment for build compatibility
- Handles dynamic SDK loading at runtime
- Manages error states and loading feedback
- Integrates with Next.js client component architecture
- Provides comprehensive error handling for network issues

**Implementation Example:**

```tsx
// src/components/AccendLink.tsx
import { LINK_SDK_STAGING_URL } from "@/utils/constants";
import { logError, LogType } from "@/utils/logger";
import React, { useEffect, useState, useRef } from "react";

const AccendLink: React.FC<AccendLinkProps> = (props) => {
  const [componentMount, setComponentMount] = useState<HTMLDivElement | null>(
    null
  );
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const target = componentMount;
    if (target && target.children.length === 0) {
      const baseUrl = LINK_SDK_STAGING_URL;

      // CRITICAL: webpackIgnore prevents Next.js build failures
      import(/* webpackIgnore: true */ baseUrl)
        .then((module) => {
          if (module.AccendLink) {
            new module.AccendLink({ target, props });
          }
        })
        .catch(() => setError("Failed to load SDK"));
    }
  }, [componentMount]);

  if (error) return <div>Error: {error}</div>;
  return <div ref={setComponentMount} />;
};

export default AccendLink;
```

### Example: Using the Component

Once you have the AccendLink component, you can use it in your Next.js application. Remember that any page or component using AccendLink must be a client component.

As an example, you could load it and display it in a modal, just like this:

```tsx
// src/app/page.tsx
"use client";

import AccendLink from "@/components/AccendLink";

export default function Home() {
  const config = {
    data: {
      customerAccessToken: "your-customer-access-token",
    },
    component: {
      theme: {
        primary: "#2196f3",
      },
    },
  };

  const handleSuccess = () => {
    console.log("Document upload successful");
  };

  const handleError = (error?: Error) => {
    console.error("Upload failed:", error?.message);
  };

  return (
    <AccendLink
      config={config}
      onSuccess={handleSuccess}
      onFail={handleError}
    />
  );
}
```

### Example: Modal Integration

You can also use it as a modal within your Next.js application. The example shows how to implement a custom modal with proper state management:

```tsx
const [open, setOpen] = useState(false);

return (
  <>
    <button onClick={() => setOpen(true)}>Connect Accounts</button>

    {open && (
      <div className="modal-overlay">
        <div className="modal">
          <AccendLink
            config={config}
            onSuccess={() => {
              handleSuccess();
              setOpen(false);
            }}
            onFail={handleError}
          />
        </div>
      </div>
    )}
  </>
);
```

## SDK Environment Configuration

### Available Environments

The Accend Link SDK is available in two environments that you can choose from based on your development needs:

```tsx
// Production SDK - for live applications
const LINK_SDK_URL = "https://static.withaccend.com/sdk/v1/link.min.js";

// Staging SDK - for development and testing
const LINK_SDK_STAGING_URL =
  "https://static.withaccend.com/sdk/staging/link.min.js";
```

### Environment Selection

```tsx
// Use staging for development (default in this example)
const baseUrl = LINK_SDK_STAGING_URL;

// Use production for live applications
const baseUrl = LINK_SDK_URL;

// Environment-based switching
const baseUrl =
  process.env.NODE_ENV === "production" ? LINK_SDK_URL : LINK_SDK_STAGING_URL;
```

## Authentication

Authentication is managed through customer access tokens that are generated server-side using your Accend Link backend integration. These tokens provide secure access to the Accend Link SDK and must be obtained through your backend API.

Customer Access tokens will generally have an expiration date, and should be refreshed via the Accend API. You can find the [staging API here](https://api.staging.withaccend.com/redoc)

**Important Security Note:** Customer access tokens should never be hardcoded in client-side code. Always fetch them dynamically from your secure backend API.

### Customer Access Tokens

Customer access tokens must be generated server-side. Example Next.js API route:

```tsx
// app/api/accend-token/route.ts
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  // Implement your token generation logic here
  const customerAccessToken = await generateAccendToken(/* your logic */);

  return NextResponse.json({ customerAccessToken });
}
```

### Example: Token Generation Steps

1. Set up server-side token generation using your backend integration
2. Create a Next.js API route to generate tokens for authenticated users
3. Fetch tokens in your React components as needed
4. Pass tokens to the AccendLink component via the config prop

## Configuration Reference

The AccendConfig object allows you to customize various aspects of the Accend Link SDK. While currently focused on authentication, future versions will include theming options and additional customization features.

### Basic Configuration

### AccendConfig Interface

| Property                   | Type   | Required | Description          |
| -------------------------- | ------ | -------- | -------------------- |
| `data.customerAccessToken` | string | ✓        | Authentication token |
| `component.theme.primary`  | string | ✗        | Primary color theme  |

### AccendLink Props

| Property    | Type         | Required | Description       |
| ----------- | ------------ | -------- | ----------------- |
| `config`    | AccendConfig | ✓        | SDK configuration |
| `onSuccess` | function     | ✗        | Success callback  |
| `onFail`    | function     | ✗        | Error callback    |

## Next.js Specific Requirements

### 1. Client Component Directive

All pages/components using AccendLink must include the `"use client"` directive because the AccendLink component uses React hooks and DOM interactions:

```tsx
"use client";

import AccendLink from "@/components/AccendLink";
```

### 2. Webpack Magic Comment

The dynamic import must include `/* webpackIgnore: true */` to prevent webpack from attempting to bundle the external SDK at build time:

```tsx
import(/* webpackIgnore: true */ baseUrl);
```

### 3. Runtime Script Loading

The SDK is loaded at runtime, not during the build process, which is essential for external script integration in Next.js.

## Common Issues & Solutions

| Issue              | Cause                               | Solution                            |
| ------------------ | ----------------------------------- | ----------------------------------- |
| Build failures     | Missing `/* webpackIgnore: true */` | Add magic comment to dynamic import |
| Hydration errors   | Missing `"use client"` directive    | Add directive to component file     |
| SDK loading errors | Network or URL issues               | Check connectivity and SDK URL      |
| TypeScript errors  | Missing type definitions            | Ensure proper interface definitions |

## File Structure

```
src/
├── app/
│   └── page.tsx              # Demo page with "use client"
├── components/
│   └── AccendLink.tsx        # Next.js AccendLink wrapper
└── utils/
    ├── constants.ts          # SDK URL configuration
    └── logger.ts             # Error logging utilities
```

## Questions

Please contact the Accend team through Slack with any questions!
