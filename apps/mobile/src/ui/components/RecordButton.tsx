import { Pressable, StyleSheet, View } from "react-native";

import { colors, moderateScale, radius } from "../theme";

interface RecordButtonProps {
  isRecording: boolean;
  onPress: () => void;
}

export function RecordButton({ isRecording, onPress }: RecordButtonProps) {
  return (
    <Pressable onPress={onPress} style={styles.hitbox}>
      <View style={[styles.outerRing, isRecording && styles.outerRingRecording]}>
        <View style={[styles.inner, isRecording && styles.innerRecording]} />
      </View>
      {isRecording ? <View style={styles.pulseRing} /> : null}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  hitbox: {
    width: moderateScale(92),
    height: moderateScale(92),
    alignItems: "center",
    justifyContent: "center"
  },
  outerRing: {
    width: moderateScale(80),
    height: moderateScale(80),
    borderRadius: radius.pill,
    borderWidth: moderateScale(4),
    borderColor: colors.white,
    alignItems: "center",
    justifyContent: "center"
  },
  outerRingRecording: {
    borderColor: colors.danger
  },
  inner: {
    width: moderateScale(62),
    height: moderateScale(62),
    borderRadius: radius.pill,
    backgroundColor: colors.white
  },
  innerRecording: {
    width: moderateScale(30),
    height: moderateScale(30),
    borderRadius: radius.sm,
    backgroundColor: colors.danger
  },
  pulseRing: {
    position: "absolute",
    width: moderateScale(86),
    height: moderateScale(86),
    borderRadius: radius.pill,
    borderWidth: moderateScale(3),
    borderColor: colors.danger,
    opacity: 0.4
  }
});
