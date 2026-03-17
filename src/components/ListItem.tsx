import { RiArrowRightSLine } from "@remixicon/react";
import classNames from "classnames";
import type { DetailedHTMLProps, LiHTMLAttributes, ReactElement } from "react";

type ListItemProps = DetailedHTMLProps<
  LiHTMLAttributes<HTMLLIElement>,
  HTMLLIElement
> & {
  titleSlot: ReactElement;
  supportingSlot?: ReactElement;
  interactive?: boolean;
};

export const ListItem = ({
  titleSlot,
  supportingSlot,
  interactive,
  className,
  ...props
}: ListItemProps) => (
  <li
    className={classNames(
      "flex justify-between items-center pl-4 pr-3 py-3",
      {
        "cursor-pointer hover:bg-surface-darker active:bg-surface-darkest":
          interactive,
      },
      className,
    )}
    {...props}
  >
    {titleSlot}
    <div className="flex gap-4 items-center">
      {supportingSlot}
      {interactive && <RiArrowRightSLine className="text-subtle size-4" />}
    </div>
  </li>
);
