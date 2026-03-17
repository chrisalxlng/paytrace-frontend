import classNames from "classnames";
import type { SVGTextElementAttributes } from "react";
import { percentageFormatter } from "../shared/utils/formatters";
import { getTextClasses } from "./Text";

type SvgPercentIndicatorProps = SVGTextElementAttributes<SVGTextElement> & {
  value: number;
};

export const SvgPercentIndicator = ({
  value,
  ...props
}: SvgPercentIndicatorProps) => {
  const getIcon = () => {
    if (value > 0) return "\u23F6";
    if (value < 0) return "\u23F7";
    return "\u25C2\u25B8";
  };

  return (
    <text
      className={classNames(getTextClasses({ variant: "caption" }), {
        "fill-green": value > 0,
        "fill-red": value < 0,
        "fill-subtle": value === 0,
      })}
      {...props}
    >
      {getIcon()} {percentageFormatter.formatWithoutSign(value)}
    </text>
  );
};
