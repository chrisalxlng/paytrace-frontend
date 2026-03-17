import type { PropsWithChildren } from "react";
import { ResponsiveContainer } from "recharts";
import { Card } from "../Card";
import { Text } from "../Text";

type StatCardProps = PropsWithChildren & {
  title: string;
  timespan: string;
  value: string;
};

export const StatCard = ({
  title,
  timespan,
  value,
  children,
}: StatCardProps) => (
  <Card className="flex flex-col gap-4">
    <div className="flex justify-between items-center">
      <Text>{title}</Text>
      <Text color="subtle">{timespan}</Text>
    </div>
    <Text variant="display">{value}</Text>
    <div className="h-50 w-full">
      <ResponsiveContainer width="100%" height="100%">
        {children}
      </ResponsiveContainer>
    </div>
  </Card>
);
