import { Ionicons } from "@expo/vector-icons";
import { Pressable, Text, View } from "react-native";

export type SearchActionButtonVariant =
  | "add"
  | "sync"
  | "move"
  | "remove"
  | "review"
  | "select"
  | "cancel";

const ACTION_ICON: Record<
  SearchActionButtonVariant,
  keyof typeof Ionicons.glyphMap
> = {
  add: "add",
  sync: "sync",
  move: "arrow-forward",
  remove: "trash-outline",
  review: "school-outline",
  select: "checkbox-outline",
  cancel: "close",
};

const ACTION_CLASS: Record<SearchActionButtonVariant, string> = {
  add: "bg-gray-900 active:bg-gray-700",
  sync: "bg-blue-600 active:bg-blue-500",
  move: "bg-indigo-600 active:bg-indigo-500",
  remove: "bg-red-600 active:bg-red-500",
  review: "bg-emerald-600 active:bg-emerald-500",
  select: "bg-gray-900 active:bg-gray-700",
  cancel: "bg-gray-500 active:bg-gray-400",
};

type SearchActionButtonProps = {
  action: SearchActionButtonVariant;
  onPress: () => void;
  disabled?: boolean;
  dropdownDisabled?: boolean;
  count?: number;
  showDropdownTrigger?: boolean;
  onDropdownPress?: () => void;
};

export function SearchActionButton({
  action,
  onPress,
  disabled,
  dropdownDisabled,
  count,
  showDropdownTrigger = false,
  onDropdownPress,
}: SearchActionButtonProps) {
  return (
    <View className="flex-row overflow-hidden rounded-xl">
      {showDropdownTrigger ? (
        <Pressable
          onPress={onDropdownPress}
          disabled={dropdownDisabled}
          className={[
            "h-10 w-9 items-center justify-center border-r border-white/20",
            ACTION_CLASS[action],
            dropdownDisabled ? "opacity-50" : "",
          ].join(" ")}
        >
          <Ionicons name="chevron-down" size={18} color="white" />
        </Pressable>
      ) : null}

      <Pressable
        onPress={onPress}
        disabled={disabled}
        className={[
          "h-10 min-w-12 flex-row items-center justify-center gap-1 px-3",
          ACTION_CLASS[action],
          disabled ? "opacity-50" : "",
        ].join(" ")}
      >
        <Ionicons name={ACTION_ICON[action]} size={20} color="white" />

        {typeof count === "number" && count > 0 ? (
          <Text className="text-xs font-bold text-white">{count}</Text>
        ) : null}
      </Pressable>
    </View>
  );
}


