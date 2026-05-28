import { InfiniteDisplayer } from "@/components/ui/InfiniteDisplayer";
import { Link } from "expo-router";
import { Pressable, Text, View } from "react-native";

import { useLibraryBoxCells } from "../../hooks/useLibraryBox";
import type { BoxResponse } from "../../types/box";
import type { LibGroupMode } from "../../types/memory";
import { CellCard } from "../cards/CellCard";

type BoxDetailProps = {
  type: LibGroupMode;
  box: BoxResponse;
};

function getTypeLabel(type: LibGroupMode) {
  if (type === "SHELF") return "Shelf";
  return "Study Set";
}

export function BoxDetail({ type, box }: BoxDetailProps) {
  const query = useLibraryBoxCells(type, box.id, 20);

  return (
    <View className="flex-1 bg-gray-50">
      <View className="bg-gray-50 px-4">
        <View className="py-4">
          <View className="rounded-2xl bg-white p-6">
            {box.slug ? (
              <Text className="text-center text-sm font-semibold text-gray-400">
                {getTypeLabel(type)}
                {"::"}
                {box.slug}
              </Text>
            ) : null}
            <Text className="mt-2 text-center text-3xl font-bold text-gray-900">
              {box.name}
            </Text>

            {box.desc ? (
              <Text className="mt-4 text-center text-base text-gray-700">
                {box.desc}
              </Text>
            ) : null}
          </View>

          <Text className="m-3 text-lg font-bold text-gray-900">Cells</Text>
        </View>
      </View>

      <View className="flex-1 px-4">
        <InfiniteDisplayer
          query={query}
          keyExtractor={(item) => item.id}
          loadingText="Loading cells..."
          emptyText="No cells in this group yet."
          errorTitle="Failed to load cells."
          errorMessage="Check API URL, backend server, and phone Wi-Fi connection."
          renderItem={(item) => (
            <Link
              href={{
                pathname: "/library/[type]/[id]",
                params: {
                  type: "CELLS",
                  id: item.id,
                },
              }}
              asChild
            >
              <Pressable>
                <CellCard cell={item} />
              </Pressable>
            </Link>
          )}
        />
      </View>
    </View>
  );
}
