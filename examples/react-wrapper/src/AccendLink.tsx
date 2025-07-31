import React, { useEffect, useState } from "react";
import { AccendLinkProps, initializeAccendLink } from "@accend/link-types";

/**
 * AccendLink React component
 * This component wraps the Accend Link SDK and provides a React interface
 */
const AccendLink: React.FC<AccendLinkProps> = (props) => {
  const [componentMount, setComponentMount] = useState<HTMLDivElement | null>(
    null
  );

  useEffect(() => {
    const target = componentMount;
    if (target && target.children.length === 0) {
      // Initialize AccendLink with the proper options
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
      style={{
        width: "100%",
        maxHeight: "95%",
      }}
      ref={setComponentMount}
    />
  );
};

export default AccendLink;
