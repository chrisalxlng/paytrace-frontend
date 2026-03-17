import { Link } from "@tanstack/react-router";
import classNames from "classnames";
import { useState } from "react";
import { m } from "../paraglide/messages";
import { useAuthStore } from "../stores/AuthStore";
import { AvatarButton } from "./AvatarButton";
import { BottomDrawer } from "./BottomDrawer";
import { List } from "./List";
import { ListItem } from "./ListItem";
import { Text } from "./Text";

type HeaderProps = {
  title: string;
  className?: string;
};

export const Header = ({ title, className }: HeaderProps) => {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const { logout, userInfo } = useAuthStore();
  const { firstName, lastName, emailAddress } = userInfo ?? {};

  const name = `${firstName} ${lastName}`;

  const handleLogout = () => {
    logout();
    setDrawerOpen(false);
  };

  return (
    <header
      className={classNames(
        "w-full fixed top-0 right-0 z-99 bg-background/80 backdrop-blur-3xl",
        "flex justify-between items-center px-4 border-b-overlay border-b-2",
        className,
      )}
    >
      <div className="flex gap-4 items-center">
        <Link to="/dashboard" className="shrink-0">
          <img
            src="/logo.svg"
            alt={m.paytrace_logo()}
            className="cursor-pointer w-8.75 h-8.75"
          />
        </Link>
        <Text element="h1" variant="title">
          {title}
        </Text>
      </div>
      <BottomDrawer
        triggerSlot={
          <AvatarButton firstName={firstName ?? ""} lastName={lastName ?? ""} />
        }
        open={drawerOpen}
        onOpenChange={setDrawerOpen}
        titleSlot={
          <Text variant="title" className="truncate">
            {name}
          </Text>
        }
        descriptionSlot={
          <Text variant="caption" color="subtle" className="truncate">
            {emailAddress}
          </Text>
        }
      >
        <List>
          <Link to="/payrolls">
            <ListItem
              onClick={() => setDrawerOpen(false)}
              titleSlot={<Text>{m.my_payrolls()}</Text>}
              interactive
            />
          </Link>
          <ListItem
            onClick={handleLogout}
            titleSlot={<Text color="red">{m.sign_out()}</Text>}
            interactive
          />
        </List>
      </BottomDrawer>
    </header>
  );
};
