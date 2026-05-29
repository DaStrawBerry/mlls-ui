import { Ionicons } from "@expo/vector-icons";
import { useEffect, useState } from "react";
import { Modal, Pressable, Text, TextInput, View } from "react-native";

import type { ReviewStartTarget } from "../types/review";

type ReviewStartModalProps = {
  visible: boolean;
  target: ReviewStartTarget | null;
  defaultSize?: number;
  onClose: () => void;
  onConfirm: (size: number, target: ReviewStartTarget) => void;
};

function getTargetLabel(target: ReviewStartTarget | null) {
  if (!target) return "review";
  if (target.source === "cells") return `${target.ids?.length ?? 0} selected cells`;
  if (target.source === "shelf") return "shelf";
  return "study set";
}

export function ReviewStartModal({
  visible,
  target,
  defaultSize = 20,
  onClose,
  onConfirm,
}: ReviewStartModalProps) {
  const [sizeText, setSizeText] = useState(String(defaultSize));

  useEffect(() => {
    if (!visible) return;
    setSizeText(String(defaultSize));
  }, [defaultSize, visible]);

  const parsedSize = Number(sizeText);
  const validSize = Number.isInteger(parsedSize) && parsedSize > 0;

  function handleConfirm() {
    if (!target || !validSize) return;
    onConfirm(parsedSize, target);
  }

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      statusBarTranslucent
      onRequestClose={onClose}
    >
      <View className="flex-1 items-center justify-center bg-black/40 px-5">
        <View className="w-full max-w-md rounded-3xl bg-white p-5 shadow-lg">
          <View className="mb-4 flex-row items-start justify-between gap-3">
            <View className="min-w-0 flex-1">
              <Text className="text-xl font-bold text-gray-950">
                Start review
              </Text>
              <Text className="mt-2 text-sm text-gray-500">
                Target: {target?.title || getTargetLabel(target)}
              </Text>
            </View>

            <Pressable
              onPress={onClose}
              className="h-10 w-10 items-center justify-center rounded-full bg-gray-100 active:bg-gray-200"
            >
              <Ionicons name="close" size={20} color="#111827" />
            </Pressable>
          </View>

          <Text className="mb-2 font-semibold text-gray-800">Review size</Text>
          <TextInput
            value={sizeText}
            onChangeText={setSizeText}
            keyboardType="numeric"
            placeholder="Example: 20"
            placeholderTextColor="#D1D5DB"
            className="rounded-xl border border-gray-200 bg-white px-4 py-3 text-base text-gray-900"
          />

          {!validSize ? (
            <Text className="mt-2 text-sm font-semibold text-red-500">
              Size must be a positive integer.
            </Text>
          ) : null}

          <View className="mt-5 flex-row justify-end gap-2">
            <Pressable
              onPress={onClose}
              className="rounded-xl bg-gray-100 px-4 py-3 active:bg-gray-200"
            >
              <Text className="font-semibold text-gray-700">Cancel</Text>
            </Pressable>

            <Pressable
              onPress={handleConfirm}
              disabled={!target || !validSize}
              className="rounded-xl bg-blue-600 px-4 py-3 active:bg-blue-500 disabled:opacity-50"
            >
              <Text className="font-bold text-white">Start</Text>
            </Pressable>
          </View>
        </View>
      </View>
    </Modal>
  );
}
