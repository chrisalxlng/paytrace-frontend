import { m } from "../paraglide/messages";
import { Button } from "./Button";
import { ConfirmDialog } from "./ConfirmDialog";
import { Text } from "./Text";

type ConsistencyConfirmDialogProps = {
  open: boolean;
  confirmLabel: string;
  handleConfirm: () => void;
  handleCancel: () => void;
};

export const ConsistencyConfirmDialog = ({
  open,
  confirmLabel,
  handleConfirm,
  handleCancel,
}: ConsistencyConfirmDialogProps) => (
  <ConfirmDialog
    open={open}
    titleSlot={<Text variant="title">{m.inconsistent_information()}</Text>}
    descriptionSlot={
      <Text color="subtle">{m.inconsistent_information_message()}</Text>
    }
    confirmSlot={
      <Button
        className="bg-primary hover:bg-primary-darker active:bg-primary-darkest"
        onClick={handleConfirm}
      >
        <Text>{confirmLabel}</Text>
      </Button>
    }
    cancelSlot={
      <Button
        className="hover:bg-subtle-darker active:bg-subtle-darkest"
        onClick={handleCancel}
      >
        <Text color="subtle">{m.check_inputs()}</Text>
      </Button>
    }
  />
);
