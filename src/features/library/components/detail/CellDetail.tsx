import { CenteredMessage } from "@/components/ui/CenteredMessage";
import { useCellDetail } from "@/features/library/hooks/useCell";
import { ScrollView, Text, View } from "react-native";

type CellDetailProps = {
  id: string;
};

export function CellDetail({ id }: CellDetailProps) {
  const query = useCellDetail(id);

  if (query.isLoading) {
    return <CenteredMessage text="Loading cell..." />;
  }

  if (query.isError) {
    return <CenteredMessage text="Failed to load cell." />;
  }

  if (!query.data) {
    return <CenteredMessage text="Cell not found." />;
  }

  const cell = query.data;

  return (
    <ScrollView className="flex-1 bg-gray-50 px-4">
      <View className="py-4">
        <View className="rounded-2xl bg-white p-6">
          <Text className="text-center text-sm font-semibold text-gray-400">
            Memory Cell
          </Text>

          <Text className="mt-3 text-center text-3xl font-bold text-gray-900">
            {cell.front}
          </Text>
        </View>

        <View className="mt-4 rounded-2xl bg-white p-4">
          <Text className="mb-3 text-lg font-bold text-gray-900">Back</Text>
          <Text className="text-base text-gray-700">{cell.back}</Text>
        </View>
      </View>
    </ScrollView>
  );
}
