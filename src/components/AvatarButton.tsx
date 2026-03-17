import { Avatar } from "@base-ui/react/avatar";
import { Button, type ButtonProps } from "@base-ui/react/button";
import classNames from "classnames";
import { Text } from "./Text";

type AvatarButtonProps = ButtonProps & {
  firstName: string;
  lastName: string;
};

export const AvatarButton = ({
  firstName,
  lastName,
  className,
  ...props
}: AvatarButtonProps) => {
  const initials = [firstName, lastName]
    .map((value) => value.slice(0, 1))
    .join("");

  return (
    <Button
      className={classNames(
        "bg-primary hover:bg-primary-darker active:bg-primary-darkest",
        "cursor-pointer size-9 rounded-full shrink-0",
        className,
      )}
      {...props}
    >
      <Avatar.Root>
        <Text>{initials}</Text>
      </Avatar.Root>
    </Button>
  );
};
