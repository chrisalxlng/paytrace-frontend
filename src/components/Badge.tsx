import { Text } from "./Text";

type BadgeProps = {
  label: string;
};

export const Badge = ({ label }: BadgeProps) => (
  <div className="inline-flex items-center px-2.5 py-0.5 rounded-full bg-primary-darkest border border-primary/20">
    <Text variant="caption">{label}</Text>
  </div>
);
