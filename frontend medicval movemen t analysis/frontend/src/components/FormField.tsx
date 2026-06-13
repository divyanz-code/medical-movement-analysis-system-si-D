import { Ionicons } from "@expo/vector-icons";
import React from "react";
import {
  KeyboardTypeOptions,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";

import { useTheme } from "@/src/theme/ThemeProvider";

interface Props {
  label?: string;
  placeholder?: string;
  value: string;
  onChangeText: (v: string) => void;
  icon?: keyof typeof Ionicons.glyphMap;
  secure?: boolean;
  keyboardType?: KeyboardTypeOptions;
  autoCapitalize?: "none" | "sentences" | "words" | "characters";
  testID?: string;
}

export const FormField: React.FC<Props> = ({
  label,
  placeholder,
  value,
  onChangeText,
  icon,
  secure,
  keyboardType,
  autoCapitalize = "none",
  testID,
}) => {
  const { palette, radii } = useTheme();
  const [hidden, setHidden] = React.useState(!!secure);

  return (
    <View style={{ marginBottom: 14 }}>
      {label ? (
        <Text
          style={{
            color: palette.textSecondary,
            fontSize: 11,
            fontWeight: "700",
            letterSpacing: 1.2,
            textTransform: "uppercase",
            marginBottom: 6,
          }}
        >
          {label}
        </Text>
      ) : null}
      <View
        style={[
          styles.box,
          {
            backgroundColor: palette.surface,
            borderColor: palette.border,
            borderRadius: radii.md,
          },
        ]}
      >
        {icon ? (
          <Ionicons
            name={icon}
            size={18}
            color={palette.textSecondary}
            style={{ marginRight: 8 }}
          />
        ) : null}
        <TextInput
          testID={testID}
          value={value}
          onChangeText={onChangeText}
          placeholder={placeholder}
          placeholderTextColor={palette.textSecondary}
          secureTextEntry={hidden}
          keyboardType={keyboardType}
          autoCapitalize={autoCapitalize}
          style={{
            flex: 1,
            color: palette.textPrimary,
            fontSize: 15,
            paddingVertical: 0,
          }}
        />
        {secure ? (
          <Pressable onPress={() => setHidden((h) => !h)} hitSlop={10}>
            <Ionicons
              name={hidden ? "eye-outline" : "eye-off-outline"}
              size={18}
              color={palette.textSecondary}
            />
          </Pressable>
        ) : null}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  box: {
    height: 50,
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 14,
    borderWidth: StyleSheet.hairlineWidth,
  },
});
