import {
  type FieldLabelProps as BaseFieldLabelProps,
  Field,
} from "@base-ui/react";
import classNames from "classnames";
import { getTextClasses } from "../Text";

type FieldLabelProps = BaseFieldLabelProps;

export const FieldLabel = ({ className, ...props }: FieldLabelProps) => (
  <Field.Label
    className={classNames(
      getTextClasses({ variant: "label", color: "subtle" }),
      className,
    )}
    {...props}
  />
);
