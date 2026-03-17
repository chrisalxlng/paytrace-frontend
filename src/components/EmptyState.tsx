import type { ReactElement } from "react";
import { Text } from "./Text";

type EmptyStateProps = {
  title: string;
  description: string;
  actionSlot?: ReactElement;
};

export const EmptyState = ({
  title,
  description,
  actionSlot,
}: EmptyStateProps) => (
  <div className="flex flex-col gap-8 items-center text-center max-w-md">
    <div className="flex flex-col gap-2 items-center text-center">
      <Text variant="heading">{title}</Text>
      <Text color="subtle">{description}</Text>
    </div>
    {actionSlot}
  </div>
);
