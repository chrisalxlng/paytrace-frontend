import {
  RiArrowRightSLine,
  RiErrorWarningLine,
  RiInformationLine,
} from "@remixicon/react";
import classNames from "classnames";
import type { ReactElement, ReactNode } from "react";
import type { Color } from "../shared/types/ui";
import { IconContainer } from "./IconContainer";
import { Text } from "./Text";

type Variant = "warning" | "info";

type MessageProps = {
  variant: Variant;
  message: string;
  icon?: ReactElement;
  interactive?: boolean;
};

const VARIANT_CONFIG: Record<
  Variant,
  {
    icon: ReactNode;
    color: Color;
    bg: string;
    bgHover: string;
    bgActive: string;
  }
> = {
  warning: {
    icon: <RiErrorWarningLine className="size-4" />,
    color: "yellow",
    bg: "bg-yellow-dark",
    bgHover: "group-hover:bg-yellow-darker",
    bgActive: "group-active:bg-yellow-darkest",
  },
  info: {
    icon: <RiInformationLine className="size-4" />,
    color: "blue",
    bg: "bg-blue-dark",
    bgHover: "group-hover:bg-blue-darker",
    bgActive: "group-active:bg-blue-darkest",
  },
};

export const Message = ({
  message,
  interactive,
  variant,
  icon,
}: MessageProps) => {
  const config = VARIANT_CONFIG[variant];

  return (
    <div className="group">
      <div
        className={classNames(
          "flex gap-4 justify-between rounded-lg p-3",
          config.bg,
          {
            "cursor-pointer": interactive,
            [config.bgHover]: interactive,
            [config.bgActive]: interactive,
          },
        )}
      >
        <div className="flex gap-4">
          <IconContainer
            color={config.color}
            className={classNames({
              [config.bgHover]: interactive,
              [config.bgActive]: interactive,
            })}
          >
            {config.icon}
          </IconContainer>
          <Text>{message}</Text>
        </div>
        {interactive && (
          <IconContainer
            color={config.color}
            className={classNames({
              [config.bgHover]: interactive,
              [config.bgActive]: interactive,
            })}
          >
            {icon ?? <RiArrowRightSLine className="size-4" />}
          </IconContainer>
        )}
      </div>
    </div>
  );
};
