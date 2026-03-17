import {
  type FieldControlProps as BaseFieldControlProps,
  Field,
} from "@base-ui/react";
import classNames from "classnames";

type FieldControlProps = BaseFieldControlProps;

export const FieldControl = ({ className, ...props }: FieldControlProps) => (
  <Field.Control
    className={classNames(
      "bg-surface px-4 py-2 rounded-md text-attention outline-none",
      "border-2 data-invalid:border-red border-surface focus:border-primary",
      "read-only:bg-transparent read-only:border-transparent",
      className,
    )}
    {...props}
  />
);
