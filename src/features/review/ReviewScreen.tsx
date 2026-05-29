import { CenteredMessage } from "@/components/ui/CenteredMessage";
import { getErrorMessage, useToast } from "@/components/ui/Toast";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useMemo, useState } from "react";
import { Pressable, ScrollView, Text, View } from "react-native";

import { useReviewCells, useSubmitReview } from "./hooks/useReview";
import type { ReviewRating, ReviewSource } from "./types/review";

const DEFAULT_ANSWERS: ReviewRating[] = ["AGAIN", "HARD", "GOOD", "EASY"];

function firstParam(value?: string | string[]) {
  if (Array.isArray(value)) return value[0];
  return value;
}

function isReviewSource(value?: string): value is ReviewSource {
  return value === "cells" || value === "shelf" || value === "study-set";
}

function parseIds(value?: string) {
  return (value ?? "")
    .split(",")
    .map((item) => item.trim())
    .filter(Boolean);
}

function getRatingClass(rating: ReviewRating, selected: boolean) {
  if (selected) return "bg-blue-600 border-blue-600";

  switch (rating) {
    case "AGAIN":
      return "bg-red-50 border-red-100";
    case "HARD":
      return "bg-amber-50 border-amber-100";
    case "GOOD":
      return "bg-emerald-50 border-emerald-100";
    case "EASY":
      return "bg-indigo-50 border-indigo-100";
  }
}

function getRatingTextClass(selected: boolean) {
  return selected ? "text-white" : "text-gray-800";
}

export default function ReviewScreen() {
  const router = useRouter();
  const toast = useToast();
  const params = useLocalSearchParams<{
    source?: string;
    id?: string;
    ids?: string;
    size?: string;
    title?: string;
  }>();

  const source = firstParam(params.source);
  const id = firstParam(params.id);
  const title = firstParam(params.title);
  const size = Number(firstParam(params.size) ?? 20);
  const ids = useMemo(() => parseIds(firstParam(params.ids)), [params.ids]);

  const safeSource = isReviewSource(source) ? source : undefined;
  const reviewQuery = useReviewCells({
    source: safeSource,
    id,
    ids,
    size,
  });
  const submitMutation = useSubmitReview();

  const [currentIndex, setCurrentIndex] = useState(0);
  const [showBack, setShowBack] = useState(false);
  const [ratings, setRatings] = useState<Record<string, ReviewRating>>({});

  if (!safeSource) {
    return <CenteredMessage text="Missing review source." />;
  }

  if (reviewQuery.isLoading) {
    return <CenteredMessage text="Loading review session..." />;
  }

  if (reviewQuery.isError) {
    return <CenteredMessage text="Failed to load review cells." />;
  }

  const cells = reviewQuery.data ?? [];
  const total = cells.length;
  const currentCell = cells[currentIndex];
  const answeredCount = Object.keys(ratings).length;

  function goToIndex(nextIndex: number) {
    setCurrentIndex(Math.min(Math.max(nextIndex, 0), Math.max(total - 1, 0)));
    setShowBack(false);
  }

  function handleRate(rating: ReviewRating) {
    if (!currentCell) return;

    setRatings((current) => ({
      ...current,
      [currentCell.id]: rating,
    }));

    if (currentIndex < total - 1) {
      goToIndex(currentIndex + 1);
    }
  }

  function handleSubmit() {
    if (!answeredCount) {
      toast.showWarning("No ratings", "Rate at least one cell first.");
      return;
    }

    submitMutation.mutate(ratings, {
      onSuccess: () => {
        toast.showSuccess("Review submitted", `${answeredCount} result saved.`);
        router.back();
      },
      onError: (error) => {
        toast.showError("Submit failed", getErrorMessage(error));
      },
    });
  }

  if (!currentCell) {
    return (
      <View className="flex-1 bg-gray-50 px-4 py-4">
        <View className="rounded-2xl bg-white p-6">
          <Text className="text-center text-2xl font-bold text-gray-900">
            No reviewable cells
          </Text>
          <Text className="mt-2 text-center text-base text-gray-500">
            Try a different target or a bigger size.
          </Text>

          <Pressable
            onPress={() => router.back()}
            className="mt-5 rounded-xl bg-gray-900 px-4 py-3"
          >
            <Text className="text-center font-bold text-white">Go back</Text>
          </Pressable>
        </View>
      </View>
    );
  }

  const answers = currentCell.answers?.length
    ? currentCell.answers
    : DEFAULT_ANSWERS;
  const selectedRating = ratings[currentCell.id];

  return (
    <ScrollView className="flex-1 bg-gray-50 px-4">
      <View className="py-4">
        <View className="mb-4 rounded-2xl bg-white p-4">
          <Text className="text-sm font-semibold text-gray-400">
            Review session
          </Text>
          <Text className="mt-1 text-2xl font-bold text-gray-900">
            {title || "Memory review"}
          </Text>
          <Text className="mt-2 text-sm text-gray-500">
            {currentIndex + 1}/{total} cards · {answeredCount} answered · size {size}
          </Text>
        </View>

        <Pressable
          onPress={() => setShowBack((current) => !current)}
          className="min-h-72 justify-center rounded-3xl bg-white p-6 shadow-sm active:bg-gray-50"
        >
          <Text className="text-center text-xs font-bold uppercase text-gray-400">
            {showBack ? "Back" : "Front"}
          </Text>
          <Text className="mt-5 text-center text-3xl font-bold text-gray-950">
            {showBack ? currentCell.back : currentCell.front}
          </Text>
          <Text className="mt-5 text-center text-sm font-semibold text-blue-600">
            Tap card to {showBack ? "hide answer" : "show answer"}
          </Text>
        </Pressable>

        <View className="mt-4 flex-row flex-wrap justify-center gap-2">
          {answers.map((answer) => {
            const selected = selectedRating === answer;

            return (
              <Pressable
                key={answer}
                onPress={() => handleRate(answer)}
                className={[
                  "min-w-24 rounded-xl border px-4 py-3",
                  getRatingClass(answer, selected),
                ].join(" ")}
              >
                <Text
                  className={[
                    "text-center font-bold",
                    getRatingTextClass(selected),
                  ].join(" ")}
                >
                  {answer}
                </Text>
              </Pressable>
            );
          })}
        </View>

        <View className="mt-4 flex-row justify-between gap-2">
          <Pressable
            onPress={() => goToIndex(currentIndex - 1)}
            disabled={currentIndex === 0}
            className="flex-1 rounded-xl bg-gray-100 px-4 py-3 disabled:opacity-50"
          >
            <Text className="text-center font-semibold text-gray-700">Prev</Text>
          </Pressable>

          <Pressable
            onPress={() => goToIndex(currentIndex + 1)}
            disabled={currentIndex >= total - 1}
            className="flex-1 rounded-xl bg-gray-100 px-4 py-3 disabled:opacity-50"
          >
            <Text className="text-center font-semibold text-gray-700">Next</Text>
          </Pressable>
        </View>

        <Pressable
          onPress={handleSubmit}
          disabled={submitMutation.isPending || !answeredCount}
          className="mt-4 rounded-xl bg-gray-900 px-4 py-4 disabled:opacity-50"
        >
          <Text className="text-center font-bold text-white">
            {submitMutation.isPending ? "Submitting..." : "Submit review"}
          </Text>
        </Pressable>
      </View>
    </ScrollView>
  );
}
