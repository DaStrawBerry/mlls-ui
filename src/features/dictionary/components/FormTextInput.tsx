import { useEffect, useRef, useState } from "react";
import {
  Platform,
  Text,
  TextInput,
  type TextInputProps,
  View,
} from "react-native";

type FormTextInputProps = {
  label: string;
  value: string;
  onChangeText: (value: string) => void;
  placeholder?: string;
  multiline?: boolean;
  keyboardType?: "default" | "numeric";
};

type WebCompositionEvent = {
  currentTarget?: {
    value?: string;
  };
  target?: {
    value?: string;
  };
};

function getWebCompositionValue(event: WebCompositionEvent) {
  return event.currentTarget?.value ?? event.target?.value;
}

export function FormTextInput({
  label,
  value,
  onChangeText,
  placeholder,
  multiline,
  keyboardType = "default",
}: FormTextInputProps) {
  const [inputValue, setInputValue] = useState(value ?? "");
  const inputValueRef = useRef(inputValue);
  const composingRef = useRef(false);

  useEffect(() => {
    if (composingRef.current) return;

    const nextValue = value ?? "";
    inputValueRef.current = nextValue;
    setInputValue(nextValue);
  }, [value]);

  function handleChangeText(nextValue: string) {
    inputValueRef.current = nextValue;
    setInputValue(nextValue);

    if (composingRef.current) return;

    onChangeText(nextValue);
  }

  function commitCurrentValue(nextValue = inputValueRef.current) {
    inputValueRef.current = nextValue;
    setInputValue(nextValue);
    onChangeText(nextValue);
  }

  const webCompositionProps =
    Platform.OS === "web"
      ? ({
          onCompositionStart: () => {
            composingRef.current = true;
          },
          onCompositionEnd: (event: WebCompositionEvent) => {
            composingRef.current = false;
            commitCurrentValue(
              getWebCompositionValue(event) ?? inputValueRef.current,
            );
          },
        } as unknown as Partial<TextInputProps>)
      : undefined;

  return (
    <View className="mb-4">
      <Text className="mb-2 font-semibold text-gray-800">{label}</Text>
      <TextInput
        value={inputValue}
        onChangeText={handleChangeText}
        onBlur={() => commitCurrentValue()}
        placeholder={placeholder}
        multiline={multiline}
        keyboardType={keyboardType}
        textAlignVertical={multiline ? "top" : "center"}
        className={[
          "rounded-xl border border-gray-200 bg-white px-4 py-3 text-base text-gray-900",
          multiline ? "min-h-24" : "",
        ].join(" ")}
        {...webCompositionProps}
      />
    </View>
  );
}
