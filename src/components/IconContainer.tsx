import classNames from "classnames";
import type { PropsWithChildren } from "react";
import type { Color } from "../shared/types/ui";
import { getColorClasses, getDarkerColorClasses } from "../shared/utils/ui";

type IconContainerProps = PropsWithChildren & {
  color?: Color;
  className?: string;
};

export const IconContainer = ({
  children,
  color,
  className,
}: IconContainerProps) => {
  const colorClasses = getColorClasses(color);
  const darkerColorClasses = getDarkerColorClasses(color);

  return (
    <div
      className={classNames(
        "p-1 rounded-full",
        colorClasses,
        darkerColorClasses,
        className,
      )}
    >
      {children}
    </div>
  );
};
