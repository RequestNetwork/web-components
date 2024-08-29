// @ts-nocheck
import React, { useLayoutEffect, useRef } from "react";
import("../web-component");

export const InvoiceDashboard = (props) => {
  const widgetRef = useRef(null);

  useLayoutEffect(() => {
    if (widgetRef.current) {
      Object.entries(props).forEach(([key, value]) => {
        widgetRef.current[key] = value;
      });
    }
  }, [props, widgetRef?.current]);

  return React.createElement("invoice-dashboard", { ref: widgetRef });
};

export default InvoiceDashboard;
