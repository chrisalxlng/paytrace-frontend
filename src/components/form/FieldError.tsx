import {
  type FieldErrorProps as BaseFieldErrorProps,
  Field,
} from "@base-ui/react";
import { RiErrorWarningLine } from "@remixicon/react";
import classNames from "classnames";
import { IconContainer } from "../IconContainer";

type FieldErrorProps = BaseFieldErrorProps;

export const FieldError = ({ className, ...props }: FieldErrorProps) => (
  <Field.Error
    {...props}
    className={classNames("text-sm text-red", className)}
    render={(props, state) =>
      state.valid ? (
        <div />
      ) : (
        <div className="flex items-center">
          <IconContainer color="red">
            <RiErrorWarningLine className="size-4" />
          </IconContainer>
          <span {...props} />
        </div>
      )
    }
  />
);
