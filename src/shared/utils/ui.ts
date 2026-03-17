import classNames from "classnames";
import type { Color } from "../types/ui";

export const getColorClasses = (color?: Color) =>
  classNames({
    "text-attention": color === "attention",
    "text-subtle": color === "subtle",
    "text-primary": color === "primary",
    "text-blue": color === "blue",
    "text-green": color === "green",
    "text-yellow": color === "yellow",
    "text-red": color === "red",
    "text-on-primary": color === "onPrimary",
  });

export const getDarkerColorClasses = (color?: Color) =>
  classNames({
    "bg-yellow-dark": color === "yellow",
    "bg-blue-dark": color === "blue",
  });
