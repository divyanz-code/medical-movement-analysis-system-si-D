import { StyleSheet, Text, View } from "react-native";

import { colors, moderateScale, radius, responsiveFont } from "../theme";

type ChipStatus = "aligned" | "compensatory" | "warning" | "success" | "processing";

const statusConfig: Record<
  ChipStatus,
  {
    label: string;
    backgroundColor: string;
    borderColor: string;
    textColor: string;
  }
> = {
  aligned: {
    label: "Aligned",
    backgroundColor: colors.successSoft,
    borderColor: colors.border,
    textColor: colors.success
  },
  compensatory: {
    label: "Compensatory",
    backgroundColor: colors.warningSoft,
    borderColor: colors.border,
    textColor: colors.warning
  },
  warning: {
    label: "Warning",
    backgroundColor: colors.dangerSoft,
    borderColor: colors.border,
    textColor: colors.danger
  },
  success: {
    label: "Complete",
    backgroundColor: colors.successSoft,
    borderColor: colors.border,
    textColor: colors.success
  },
  processing: {
    label: "Processing",
    backgroundColor: colors.accentSoft,
    borderColor: colors.border,
    textColor: colors.accent
  }
};

interface StatusChipProps {
  status: ChipStatus;
  label?: string;
}

export function StatusChip({ status, label }: StatusChipProps) {
  const config = statusConfig[status];
  return (
    <View
      style={[
        styles.chip,
        {
          backgroundColor: config.backgroundColor,
          borderColor: config.borderColor
        }
      ]}
    >
      <Text style={[styles.text, { color: config.textColor }]}>{label ?? config.label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  chip: {
    borderWidth: 1,
    borderRadius: radius.pill,
    paddingHorizontal: moderateScale(10),
    paddingVertical: moderateScale(4)
  },
  text: {
    fontSize: responsiveFont(11),
    fontWeight: "700"
  }
});
