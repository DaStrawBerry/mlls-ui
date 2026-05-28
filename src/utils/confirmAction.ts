import { Alert, Platform } from "react-native";

type ConfirmActionOptions = {
  title: string;
  message?: string;
  confirmText?: string;
  cancelText?: string;
  destructive?: boolean;
  onConfirm: () => void;
};

export function confirmAction({
  title,
  message,
  confirmText = "OK",
  cancelText = "Cancel",
  destructive = false,
  onConfirm,
}: ConfirmActionOptions) {
  if (Platform.OS === "web" && typeof window !== "undefined") {
    const confirmed = window.confirm(message ? `${title}\n\n${message}` : title);

    if (confirmed) {
      onConfirm();
    }

    return;
  }

  Alert.alert(title, message, [
    { text: cancelText, style: "cancel" },
    {
      text: confirmText,
      style: destructive ? "destructive" : "default",
      onPress: onConfirm,
    },
  ]);
}
