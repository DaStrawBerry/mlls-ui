import { Pressable, Text, View } from "react-native";
import { useRef } from "react";

type CycleOption<T extends string> = {
  label: string;
  value: T;
};

type CycleSelectorProps<T extends string> = {
  label: string;
  value: T;
  options: CycleOption<T>[];
  onChange: (value: T) => void;
  width?: number;
};

export function CycleSelector<T extends string>({
  label,
  value,
  options,
  onChange,
  width = 120,
}: CycleSelectorProps<T>) {
  const startY = useRef(0);

  const currentIndex = options.findIndex((option) => option.value === value);
  const safeIndex = currentIndex >= 0 ? currentIndex : 0;
  const currentOption = options[safeIndex];

  function goNext() {
    const nextIndex = (safeIndex + 1) % options.length;
    onChange(options[nextIndex].value);
  }

  function goPrevious() {
    const previousIndex = (safeIndex - 1 + options.length) % options.length;
    onChange(options[previousIndex].value);
  }

  function handleSwipeEnd(endY: number) {
    const diffY = endY - startY.current;

    if (Math.abs(diffY) < 20) {
      goNext();
      return;
    }

    if (diffY < 0) {
      goNext();
      return;
    }

    goPrevious();
  }

  return (
    <Pressable
      onPress={goNext}
      onTouchStart={(event) => {
        startY.current = event.nativeEvent.pageY;
      }}
      onTouchEnd={(event) => {
        handleSwipeEnd(event.nativeEvent.pageY);
      }}
      className="rounded-xl bg-gray-100 px-3 py-2"
      style={{ width }}
    >
      <View className="flex-row items-center gap-1">
        <Text
          selectable={false}
          className="text-xs font-medium text-gray-400"
        >
          {label}
        </Text>

        <Text
          selectable={false}
          numberOfLines={1}
          className="text-sm font-semibold text-gray-900"
        >
          {currentOption.label}
        </Text>
      </View>
    </Pressable>
  );
}