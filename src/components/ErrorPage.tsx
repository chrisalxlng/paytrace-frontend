import { RiErrorWarningLine } from "@remixicon/react";
import type { ErrorComponentProps } from "@tanstack/react-router";
import { Link } from "@tanstack/react-router";
import { m } from "../paraglide/messages";
import { Button } from "./Button";
import { IconContainer } from "./IconContainer";
import { Text } from "./Text";

export const ErrorPage = ({ error, reset }: ErrorComponentProps) => {
  const { name, stack } = error;

  return (
    <div className="flex h-dvh flex-col items-center justify-center p-4 overflow-x-hidden">
      <div className="w-full max-w-md flex flex-col gap-6">
        <div className="flex flex-col items-center text-center gap-2">
          <IconContainer color="red">
            <RiErrorWarningLine size={56} />
          </IconContainer>

          <Text variant="title">Etwas ist schiefgelaufen</Text>
          <Text color="subtle">
            Die angeforderte Aktion konnte nicht ordnungsgemäß durchgeführt
            werden.
          </Text>
        </div>
        <div className="flex flex-col gap-2 border border-subtle rounded-lg p-6 wrap-break-word overflow-hidden">
          <Text className="break-all font-semibold">{name}</Text>
          <div className="whitespace-pre-wrap break-all max-h-60 overflow-y-auto text-left">
            <Text color="subtle" variant="caption">
              {stack}
            </Text>
          </div>
        </div>
        <div className="flex flex-col gap-3 w-full sm:flex-row sm:justify-center">
          <Link to="/" className="w-full sm:w-auto">
            <Button className="w-full hover:bg-subtle-darker active:bg-subtle-darkest">
              <Text color="subtle">{m.navigate_to_home()}</Text>
            </Button>
          </Link>
          <Button
            onClick={() => reset()}
            className="w-full sm:w-auto bg-primary hover:bg-primary-darker active:bg-primary-darkest"
          >
            <Text>{m.retry()}</Text>
          </Button>
        </div>
      </div>
    </div>
  );
};
