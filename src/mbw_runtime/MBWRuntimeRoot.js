import React from "react";
import OriginalApp from "../../app.json";
import MBWRuntimeOS from "./MBWRuntimeOS";
import MBWVisualBoundary from "./MBWVisualBoundary";

export default function MBWRuntimeRoot() {
  return (
    <MBWRuntimeOS>
      <MBWVisualBoundary>
        <OriginalApp />
      </MBWVisualBoundary>
    </MBWRuntimeOS>
  );
}
