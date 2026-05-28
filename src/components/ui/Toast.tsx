import { Ionicons } from "@expo/vector-icons";
import type { ReactNode } from "react";
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { Text, View } from "react-native";

export type ToastType = "success" | "error" | "warning" | "info";

type ToastPayload = {
  type?: ToastType;
  title: string;
  message?: string;
  duration?: number;
};

type ToastState = Required<Pick<ToastPayload, "type" | "title">> & {
  message?: string;
  duration: number;
};

type ToastContextValue = {
  showToast: (toast: ToastPayload) => void;
  showSuccess: (title: string, message?: string) => void;
  showError: (title: string, message?: string) => void;
  showWarning: (title: string, message?: string) => void;
  showInfo: (title: string, message?: string) => void;
};

const ToastContext = createContext<ToastContextValue | null>(null);

const TOAST_CLASS: Record<ToastType, string> = {
  success: "border-emerald-200 bg-emerald-50",
  error: "border-red-200 bg-red-50",
  warning: "border-amber-200 bg-amber-50",
  info: "border-blue-200 bg-blue-50",
};

const TEXT_CLASS: Record<ToastType, string> = {
  success: "text-emerald-900",
  error: "text-red-900",
  warning: "text-amber-900",
  info: "text-blue-900",
};

const SUBTEXT_CLASS: Record<ToastType, string> = {
  success: "text-emerald-700",
  error: "text-red-700",
  warning: "text-amber-700",
  info: "text-blue-700",
};

const ICON: Record<ToastType, keyof typeof Ionicons.glyphMap> = {
  success: "checkmark-circle",
  error: "close-circle",
  warning: "warning",
  info: "information-circle",
};

const ICON_COLOR: Record<ToastType, string> = {
  success: "#047857",
  error: "#DC2626",
  warning: "#D97706",
  info: "#2563EB",
};

export function getErrorMessage(error: unknown, fallback = "Unknown error") {
  if (error instanceof Error && error.message) return error.message;
  if (typeof error === "string" && error) return error;
  return fallback;
}

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toast, setToast] = useState<ToastState | null>(null);

  const showToast = useCallback((nextToast: ToastPayload) => {
    setToast({
      type: nextToast.type ?? "info",
      title: nextToast.title,
      message: nextToast.message,
      duration: nextToast.duration ?? 2600,
    });
  }, []);

  useEffect(() => {
    if (!toast) return;

    const timeout = setTimeout(() => {
      setToast(null);
    }, toast.duration);

    return () => clearTimeout(timeout);
  }, [toast]);

  const value = useMemo<ToastContextValue>(
    () => ({
      showToast,
      showSuccess: (title, message) =>
        showToast({ type: "success", title, message }),
      showError: (title, message) =>
        showToast({ type: "error", title, message }),
      showWarning: (title, message) =>
        showToast({ type: "warning", title, message }),
      showInfo: (title, message) => showToast({ type: "info", title, message }),
    }),
    [showToast],
  );

  return (
    <ToastContext.Provider value={value}>
      <View className="flex-1">
        {children}

        {toast ? (
          <View
            pointerEvents="none"
            className="absolute left-4 right-4 top-12 z-50"
          >
            <View
              className={[
                "flex-row items-start gap-3 rounded-2xl border px-4 py-3 shadow-sm",
                TOAST_CLASS[toast.type],
              ].join(" ")}
            >
              <Ionicons
                name={ICON[toast.type]}
                size={22}
                color={ICON_COLOR[toast.type]}
              />

              <View className="min-w-0 flex-1">
                <Text
                  className={["font-bold", TEXT_CLASS[toast.type]].join(" ")}
                >
                  {toast.title}
                </Text>

                {toast.message ? (
                  <Text
                    className={["mt-1 text-sm", SUBTEXT_CLASS[toast.type]].join(
                      " ",
                    )}
                  >
                    {toast.message}
                  </Text>
                ) : null}
              </View>
            </View>
          </View>
        ) : null}
      </View>
    </ToastContext.Provider>
  );
}

export function useToast() {
  const context = useContext(ToastContext);

  if (!context) {
    throw new Error("useToast must be used inside ToastProvider");
  }

  return context;
}
