import { Text, TextInput, View } from "react-native";

type FormTextInputProps = {
  label: string;
  value: string;
  onChangeText: (value: string) => void;
  placeholder?: string;
  multiline?: boolean;
  keyboardType?: "default" | "numeric";
};

export function FormTextInput({
  label,
  value,
  onChangeText,
  placeholder,
  multiline,
  keyboardType = "default",
}: FormTextInputProps) {
  return (
    <View className="mb-4">
      <Text className="mb-2 font-semibold text-gray-800">{label}</Text>
      <TextInput
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        multiline={multiline}
        keyboardType={keyboardType}
        textAlignVertical={multiline ? "top" : "center"}
        className={[
          "rounded-xl border border-gray-200 bg-white px-4 py-3 text-base text-gray-900",
          multiline ? "min-h-24" : "",
        ].join(" ")}
      />
    </View>
  );
}
