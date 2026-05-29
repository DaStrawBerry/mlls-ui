import type { ReactNode } from "react";
import { StyleSheet, View } from "react-native";

import { FloatingPortal } from "./FloatingPortal";

type FloatingModalPlacement = "center" | "bottom";

type FloatingModalProps = {
  visible: boolean;
  children: ReactNode;
  priority?: number;
  placement?: FloatingModalPlacement;
  contentClassName?: string;
  backdropClassName?: string;
};

function getPlacementClassName(placement: FloatingModalPlacement) {
  if (placement === "center") {
    return "items-center justify-center px-5";
  }

  return "justify-end";
}

export function FloatingModal({
  visible,
  children,
  priority = 100,
  placement = "bottom",
  contentClassName = "max-h-[86%] rounded-t-3xl bg-white px-4 pb-6 pt-4",
  backdropClassName = "bg-black/40",
}: FloatingModalProps) {
  if (!visible) return null;

  return (
    <FloatingPortal priority={priority}>
      <View
        pointerEvents="auto"
        style={StyleSheet.absoluteFill}
        className={[backdropClassName, getPlacementClassName(placement)].join(
          " ",
        )}
      >
        <View className={contentClassName}>{children}</View>
      </View>
    </FloatingPortal>
  );
}
