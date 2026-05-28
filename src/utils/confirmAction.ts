export type ConfirmActionOptions = {
  title: string;
  message?: string;
  confirmText?: string;
  cancelText?: string;
  destructive?: boolean;
  onConfirm: () => void;
};

type ConfirmActionHandler = (options: ConfirmActionOptions) => void;

let confirmActionHandler: ConfirmActionHandler | null = null;

export function setConfirmActionHandler(handler: ConfirmActionHandler | null) {
  confirmActionHandler = handler;
}

export function confirmAction(options: ConfirmActionOptions) {
  if (!confirmActionHandler) {
    console.warn(
      "confirmAction was called before ConfirmProvider was mounted.",
    );
    return;
  }

  confirmActionHandler(options);
}
