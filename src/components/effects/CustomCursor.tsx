import React, { useEffect, useState } from "react";

export function CustomCursor() {
  const [isHidden, setIsHidden] = useState(true);

  useEffect(() => {
    // Immediately hide the custom cursor so the native cursor shows
    setIsHidden(true);

    return () => {};
  }, []);

  if (isHidden) return null;

  return null;
}