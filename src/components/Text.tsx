import classNames from "classnames";
import type { ComponentPropsWithoutRef, ElementType } from "react";
import type { Color } from "../shared/types/ui";
import { getColorClasses } from "../shared/utils/ui";

type TextProps<T extends ElementType> = {
  element?: T;
  variant?: "title" | "heading" | "label" | "display" | "caption";
  color?: Color;
  underlined?: boolean;
} & ComponentPropsWithoutRef<T>;

export const getTextClasses = ({
  variant,
  color,
  underlined,
}: Pick<TextProps<"span">, "color" | "variant" | "underlined">) => {
  const variantClasses = classNames({
    "font-semibold text-lg": variant === "title",
    "font-medium text-md": variant === "heading",
    "font-regular text-sm/6": variant === "label",
    "font-semibold text-5xl tracking-wider": variant === "display",
    "font-medium text-xs": variant === "caption",
  });

  const colorClasses = getColorClasses(color);

  const decorationClasses = classNames({
    underline: underlined,
  });

  return classNames(
    "font-base",
    variantClasses,
    colorClasses,
    decorationClasses,
  );
};

export const Text = <T extends ElementType = "span">({
  children,
  element,
  variant = "label",
  color = "attention",
  underlined,
  className,
  ...props
}: TextProps<T>) => {
  const Component = element ?? "span";

  return (
    <Component
      className={classNames(
        getTextClasses({ variant, color, underlined }),
        className,
      )}
      {...props}
    >
      {children}
    </Component>
  );
};
