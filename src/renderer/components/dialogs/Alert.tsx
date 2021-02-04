import React from "react";
import { Alert, IconName, Intent } from "@blueprintjs/core";

type Props = {
  icon?: IconName;
  intent?: Intent;
  info: string;
  confirmButtonText?: string;
  cancelButtonText?: string;
  onConfirm: () => any;
  onCancel?: () => any;
  onClose?: () => any;
}

export function GenericAlert(props: Props) {
  return (
    <Alert
      isOpen={true}
      {...props}
    >
      {props.info}
    </Alert>
  )
}