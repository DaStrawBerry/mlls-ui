import { View } from "react-native";

import { Pill } from "../../../../components/ui/Pill";

type TagListProps = {
  tags: string[];
};

export function TagList({ tags }: TagListProps) {
  return (
    <View className="flex-row flex-wrap gap-2">
      {tags.map((tag) => (
        <Pill key={tag} text={tag} />
      ))}
    </View>
  );
}
