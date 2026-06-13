import React from "react";
import { ScrollView, StyleSheet, Text, View } from "react-native";

import { useTheme } from "@/src/theme/ThemeProvider";

import { Pressable } from "react-native";

interface ChipItem {
  id: string;
  label: string;
  icon?: React.ReactNode;
}

interface Props {
  items: ChipItem[];
  selected: string;
  onSelect: (id: string) => void;
  testID?: string;
}

export const ChipRow: React.FC<Props> = ({ items, selected, onSelect, testID }) => {
  const { palette, radii } = useTheme();
  return (
    <View testID={testID} style={{ height: 56, justifyContent: "center" }}>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{ paddingHorizontal: 20, gap: 8, alignItems: "center" }}
      >
        {items.map((item) => {
          const active = item.id === selected;
          return (
            <Pressable
              key={item.id}
              testID={`chip-${item.id}`}
              onPress={() => onSelect(item.id)}
              style={({ pressed }) => ({
                opacity: pressed ? 0.85 : 1,
                flexShrink: 0,
                height: 36,
                paddingHorizontal: 14,
                borderRadius: radii.pill,
                borderWidth: 1,
                borderColor: active ? palette.primary : palette.border,
                backgroundColor: active ? palette.primary : palette.surface,
                alignItems: "center",
                justifyContent: "center",
                flexDirection: "row",
              })}
            >
              {item.icon ? <View style={{ marginRight: 6 }}>{item.icon}</View> : null}
              <Text
                style={{
                  color: active ? "#FFFFFF" : palette.textPrimary,
                  fontSize: 13,
                  fontWeight: "600",
                }}
              >
                {item.label}
              </Text>
            </Pressable>
          );
        })}
      </ScrollView>
    </View>
  );
};

const _styles = StyleSheet.create({});
