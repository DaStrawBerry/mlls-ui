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
import { Pressable, Text, View } from "react-native";

import { FloatingModal } from "./FloatingModal";
import {
  type ConfirmActionOptions,
  setConfirmActionHandler,
} from "@/utils/confirmAction";

type ConfirmContextValue = {
  confirm: (options: ConfirmActionOptions) => void;
};

const ConfirmContext = createContext<ConfirmContextValue | null>(null);

export function ConfirmProvider({ children }: { children: ReactNode }) {
  const [confirmState, setConfirmState] = useState<ConfirmActionOptions | null>(
    null,
  );

  const confirm = useCallback((options: ConfirmActionOptions) => {
    setConfirmState(options);
  }, []);

  useEffect(() => {
    setConfirmActionHandler(confirm);

    return () => {
      setConfirmActionHandler(null);
    };
  }, [confirm]);

  const value = useMemo<ConfirmContextValue>(() => ({ confirm }), [confirm]);

  function handleCancel() {
    setConfirmState(null);
  }

  function handleConfirm() {
    const nextAction = confirmState?.onConfirm;
    setConfirmState(null);
    nextAction?.();
  }

  const confirmText = confirmState?.confirmText ?? "OK";
  const cancelText = confirmState?.cancelText ?? "Cancel";
  const destructive = confirmState?.destructive ?? false;

  return (
    <ConfirmContext.Provider value={value}>
      {children}

      <FloatingModal
        visible={!!confirmState}
        priority={1000}
        placement="center"
        contentClassName="w-full max-w-md rounded-3xl bg-white p-5 shadow-lg"
      >
        <View className="mb-4 flex-row items-start gap-3">
          <View
            className={[
              "h-11 w-11 items-center justify-center rounded-full",
              destructive ? "bg-red-50" : "bg-blue-50",
            ].join(" ")}
          >
            <Ionicons
              name={destructive ? "warning" : "help-circle"}
              size={24}
              color={destructive ? "#DC2626" : "#2563EB"}
            />
          </View>

          <View className="min-w-0 flex-1">
            <Text className="text-xl font-bold text-gray-950">
              {confirmState?.title}
            </Text>

            {confirmState?.message ? (
              <Text className="mt-2 text-base leading-6 text-gray-600">
                {confirmState.message}
              </Text>
            ) : null}
          </View>
        </View>

        <View className="flex-row justify-end gap-2">
          <Pressable
            onPress={handleCancel}
            className="rounded-xl bg-gray-100 px-4 py-3 active:bg-gray-200"
          >
            <Text className="font-semibold text-gray-700">{cancelText}</Text>
          </Pressable>

          <Pressable
            onPress={handleConfirm}
            className={[
              "rounded-xl px-4 py-3 active:opacity-80",
              destructive ? "bg-red-600" : "bg-blue-600",
            ].join(" ")}
          >
            <Text className="font-bold text-white">{confirmText}</Text>
          </Pressable>
        </View>
      </FloatingModal>
    </ConfirmContext.Provider>
  );
}

export function useConfirm() {
  const context = useContext(ConfirmContext);

  if (!context) {
    throw new Error("useConfirm must be used inside ConfirmProvider");
  }

  return context;
}
