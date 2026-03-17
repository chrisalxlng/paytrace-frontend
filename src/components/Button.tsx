import {
  Button as BaseButton,
  type ButtonProps as BaseButtonProps,
} from "@base-ui/react";
import classNames from "classnames";

type ButtonProps = BaseButtonProps;

export const Button = ({ children, className, ...props }: ButtonProps) => (
  <BaseButton
    className={classNames("cursor-pointer rounded-md px-4 h-10", className)}
    {...props}
  >
    {children}
  </BaseButton>
);
