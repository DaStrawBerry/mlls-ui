import { SearchActionButton } from "@/components/ui/SearchActionButton";
import { useRouter } from "expo-router";
import type { LibMode } from "../types/memory";

type LibraryActionButtonsProps = {
  mode: LibMode;
};

export function LibraryActionButtons({ mode }: LibraryActionButtonsProps) {
  const router = useRouter();

  if (mode === "CELLS") {
    return (
      <SearchActionButton
        action="select"
        onPress={() => {
          // bước sau: bật select mode cho cell
        }}
      />
    );
  }

  return (
    <SearchActionButton
      action="add"
      onPress={() =>
        router.push({
          pathname: "/library/[type]/add",
          params: {
            type: mode,
          },
        })
      }
    />
  );
}
