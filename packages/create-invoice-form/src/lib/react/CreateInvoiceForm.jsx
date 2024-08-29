// @ts-nocheck
import React, { useLayoutEffect, useRef } from "react";
import("../web-component");

export const CreateInvoiceForm = (props) => {
  const widgetRef = useRef(null);

  useLayoutEffect(() => {
    if (widgetRef.current) {
      Object.entries(props).forEach(([key, value]) => {
        widgetRef.current[key] = value;
      });
    }
  }, [props, widgetRef?.current]);

  return React.createElement("create-invoice-form", { ref: widgetRef });
};

export default CreateInvoiceForm;
