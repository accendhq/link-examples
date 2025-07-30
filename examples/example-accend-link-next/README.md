# Accend Link Next.js Integration Example

A Next.js implementation of the Accend Link SDK demonstrating the critical webpack configuration required for Next.js applications.

## Overview

This example shows how to integrate the Accend Link SDK into a Next.js application. The key difference from standard React implementations is the requirement for webpack magic comments to handle external script loading.

**⚠️ Critical Requirement:** Next.js requires the `/* webpackIgnore: true */` magic comment to prevent webpack from parsing the external SDK during build.

## Prerequisites

- Node.js 18+ installed
- Next.js 13+ with App Router
- A valid customer access token from your Accend Link backend integration

## Running This Example

### 1. Install Dependencies

```bash
npm install
```

### 2. Update Configuration

Replace the test token in `src/app/page.tsx` with your actual customer access token:

```tsx
const config = {
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

## Implementation

### AccendLink Component

The core component that wraps the Accend Link SDK for Next.js:

```tsx
// src/components/AccendLink.tsx
import { LINK_SDK_STAGING_URL } from "@/utils/constants";
import React, { useEffect, useState, useRef } from "react";

interface AccendConfig {
  data: {
    customerAccessToken: string;
  };
  component?: {
    theme?: {
      primary?: string;
    };
  };
}

interface AccendLinkProps {
  config: AccendConfig;
  onSuccess?: () => void;
  onFail?: (error?: Error) => void;
}

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

### Using the Component

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

  return (
    <AccendLink
      config={config}
      onSuccess={handleSuccess}
      onFail={handleError}
    />
  );
}
```

## SDK Environment Configuration

### Available Environments

```tsx
// src/utils/constants.ts
export const LINK_SDK_URL = "https://static.withaccend.com/sdk/v1/link.min.js";
export const LINK_SDK_STAGING_URL =
  "https://static.withaccend.com/sdk/staging/link.min.js";
```

### Environment Selection

```tsx
// Development/testing (default in this example)
const baseUrl = LINK_SDK_STAGING_URL;

// Production
const baseUrl = LINK_SDK_URL;

// Environment-based switching
const baseUrl =
  process.env.NODE_ENV === "production" ? LINK_SDK_URL : LINK_SDK_STAGING_URL;
```

### Using Environment Variables

Create a `.env.local` file:

```bash
NEXT_PUBLIC_ACCEND_SDK_URL=https://static.withaccend.com/sdk/staging/link.min.js
```

Then in your component:

```tsx
const baseUrl = process.env.NEXT_PUBLIC_ACCEND_SDK_URL || LINK_SDK_STAGING_URL;
```

## Authentication

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

### Fetching Tokens in Components

```tsx
const [token, setToken] = useState<string>("");

useEffect(() => {
  fetch("/api/accend-token", { method: "POST" })
    .then((res) => res.json())
    .then((data) => setToken(data.customerAccessToken));
}, []);
```

## Configuration Reference

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

All pages/components using AccendLink must include the `"use client"` directive:

```tsx
"use client";

import AccendLink from "@/components/AccendLink";
```

### 2. Webpack Magic Comment

The dynamic import must include `/* webpackIgnore: true */`:

```tsx
import(/* webpackIgnore: true */ baseUrl);
```

This prevents webpack from attempting to bundle the external SDK at build time.

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

## Dependencies

```json
{
  "next": "15.4.5",
  "react": "19.1.0",
  "react-dom": "19.1.0",
  "typescript": "^5"
}
```

## Next Steps

1. Replace the demo customer access token with your actual token
2. Implement server-side token generation
3. Configure environment-specific SDK URLs
4. Add error handling and logging as needed
5. Style the component to match your application design
