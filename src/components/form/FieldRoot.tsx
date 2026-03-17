import {
  type FieldRootProps as BaseFieldRootProps,
  Field,
} from "@base-ui/react";
import classNames from "classnames";

type FieldProps = BaseFieldRootProps;

export const FieldRoot = ({ className, ...props }: FieldProps) => (
  <Field.Root
    {...props}
    className={classNames("flex flex-col items-start gap-1", className)}
  />
);
