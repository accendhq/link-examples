import { LINK_SDK_STAGING_URL, LINK_SDK_URL } from "@/utils/constants";
import { logError, LogType } from "@/utils/logger";
import React, { useEffect, useState, useRef } from "react";
// import type { AccendLinkProps } from "@accend/link-types";

/**
 * AccendLink React component for Next.js
 * This component wraps the Accend Link SDK and provides a React interface
 *
 * IMPORTANT: Next.js builds things differently, so we use the webpackIgnore
 * magic comment to prevent webpack from parsing the dynamic import.
 */

const connectionError = `Unable to load the account connection portal. 
            Please check your internet connection and try again, or contact support if the problem persists.`;

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
  const instanceRef = useRef<{
    open: () => void;
    close: () => void;
    update: (props: AccendLinkProps) => void;
    unmount: () => void;
  } | null>(null);

  useEffect(() => {
    const target = componentMount;
    if (target && target.children.length === 0) {
      // You can change the baseUrl to the production URL if you want to use the production SDK
      const baseUrl = LINK_SDK_STAGING_URL;

      // webpackIgnore is a magic comment that prevents webpack from
      //   parsing this dynamic import. The build will fail otherwise.
      // See https://webpack.js.org/api/module-methods/#magic-comments
      // This is CRITICAL for Next.js builds!
      import(/* webpackIgnore: true */ baseUrl)
        .then((module) => {
          // Check if AccendLink class exists in the imported module
          if (module.AccendLink) {
            try {
              // Instantiate the AccendLink class with the provided options
              const instance = new module.AccendLink({
                target,
                props,
              });

              instanceRef.current = {
                open: instance.open,
                close: instance.close,
                update: instance.update,
                unmount: instance.unmount,
              };

              // Clear any previous errors if successful
              setError(null);
            } catch (error: unknown) {
              console.error("Accend Link: Error initializing", error);
              setError(connectionError);
              throw error;
            }
          } else {
            setError(connectionError);
            logError(
              LogType.ACCEND_LINK,
              new Error(
                "Accend Link: Module does not contain AccendLink class"
              ),
              {
                context: { message: connectionError },
              }
            );
          }
        })
        .catch((error: unknown) => {
          console.error(`Accend Link: Failed to load from ${baseUrl}`, error);
          setError(connectionError);
          logError(
            LogType.ACCEND_LINK,
            new Error(
              `Failed to load AccendLink SDK from ${baseUrl}: ${
                error instanceof Error ? error.message : String(error)
              }`
            ),
            { context: { baseUrl } }
          );
        });
    }

    return () => {
      if (instanceRef.current) {
        instanceRef.current.unmount();
        instanceRef.current = null;
      }
    };
  }, [componentMount]);

  useEffect(() => {
    if (instanceRef.current) {
      instanceRef.current.update(props);
    }
  }, [props]);

  if (error) {
    return (
      <div
        className="accend-link-error"
        style={{
          color: "red",
          padding: "1rem",
          border: "1px solid red",
          borderRadius: "4px",
        }}
      >
        {error}
      </div>
    );
  }

  return <div ref={setComponentMount} />;
};

export default AccendLink;
