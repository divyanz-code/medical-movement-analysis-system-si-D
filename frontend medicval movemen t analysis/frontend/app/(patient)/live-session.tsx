// MEDMOVE AI Live Analysis HUD.
// Real-time camera with MediaPipe-style skeleton overlay (body) or face mesh
// placement guide (face). True MediaPipe inference will be wired through a
// native AI service in a development build; this screen mocks the feedback
// pipeline so the UI behaves identically to production.

import { Ionicons } from "@expo/vector-icons";
import { CameraView, useCameraPermissions } from "expo-camera";
import * as Haptics from "expo-haptics";
import { useLocalSearchParams, useRouter } from "expo-router";
import React, { useEffect, useRef, useState } from "react";
import {
  Dimensions,
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";
import Animated, {
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withTiming,
} from "react-native-reanimated";
import { SafeAreaView } from "react-native-safe-area-context";
import Svg, { Circle, Defs, LinearGradient, Path, Stop } from "react-native-svg";

import { Button } from "@/src/components/Button";
import { FaceMeshOverlay } from "@/src/components/FaceMeshOverlay";
import { SkeletonOverlay } from "@/src/components/SkeletonOverlay";
import { findExercise } from "@/src/data/mock";
import { useTheme } from "@/src/theme/ThemeProvider";

const FEEDBACK_CYCLE = [
  { text: "Hold steady, finding pose", tone: "info" as const },
  { text: "Lift slightly higher", tone: "warn" as const },
  { text: "Excellent form!", tone: "success" as const },
  { text: "Slow down", tone: "warn" as const },
  { text: "Hold for 2s", tone: "info" as const },
  { text: "Rep counted ✓", tone: "success" as const },
];

export default function LiveSession() {
  const router = useRouter();
  const { palette } = useTheme();
  const { id } = useLocalSearchParams<{ id?: string }>();
  const exercise = findExercise(id || "ex-1");
  const isFacial = exercise.category === "facial";

  const [permission, requestPermission] = useCameraPermissions();
  const [facing, setFacing] = useState<"front" | "back">(isFacial ? "front" : "front");
  const [recording, setRecording] = useState(true);
  const [voice, setVoice] = useState(true);
  const [reps, setReps] = useState(0);
  const [feedbackIdx, setFeedbackIdx] = useState(0);
  const [angle, setAngle] = useState(38);
  const [score, setScore] = useState(81);
  const insets = SafeAreaView; // placeholder import safety
  const { width, height } = Dimensions.get("window");

  const pulse = useSharedValue(0);

  useEffect(() => {
    pulse.value = withRepeat(
      withTiming(1, { duration: 1200, easing: Easing.inOut(Easing.sin) }),
      -1,
      true,
    );
  }, [pulse]);

  // Drive mock feedback loop
  useEffect(() => {
    if (!recording) return;
    const t = setInterval(() => {
      setFeedbackIdx((i) => (i + 1) % FEEDBACK_CYCLE.length);
      setAngle((a) => {
        const next = a + (Math.random() * 14 - 4);
        return Math.max(8, Math.min(168, Math.round(next)));
      });
      setScore((s) => Math.min(99, s + (Math.random() > 0.4 ? 1 : 0)));
    }, 1400);
    const rep = setInterval(() => {
      if (recording) {
        setReps((r) => Math.min(exercise.reps, r + 1));
        Haptics.selectionAsync().catch(() => {});
      }
    }, 4500);
    return () => {
      clearInterval(t);
      clearInterval(rep);
    };
  }, [recording, exercise.reps]);

  const haloStyle = useAnimatedStyle(() => ({
    opacity: 0.5 + pulse.value * 0.5,
    transform: [{ scale: 1 + pulse.value * 0.08 }],
  }));

  const stageWidth = width;
  const stageHeight = height * 0.62;

  const feedback = FEEDBACK_CYCLE[feedbackIdx];
  const feedbackColor =
    feedback.tone === "success"
      ? palette.success
      : feedback.tone === "warn"
        ? palette.warning
        : palette.info;

  if (!permission) {
    return <View style={{ flex: 1, backgroundColor: "#000" }} />;
  }

  return (
    <View style={{ flex: 1, backgroundColor: "#000" }}>
      {/* Camera background */}
      {permission.granted ? (
        <CameraView style={StyleSheet.absoluteFill} facing={facing} />
      ) : (
        <View
          style={[
            StyleSheet.absoluteFill,
            { alignItems: "center", justifyContent: "center", padding: 32 },
          ]}
        >
          <Ionicons name="videocam-off" size={36} color="#fff" />
          <Text style={{ color: "#fff", fontSize: 18, fontWeight: "800", marginTop: 14, textAlign: "center" }}>
            Camera access required
          </Text>
          <Text style={{ color: "rgba(255,255,255,0.7)", fontSize: 13, marginTop: 8, textAlign: "center", lineHeight: 20 }}>
            We need your camera to run real-time MediaPipe pose and face mesh detection during this rehabilitation session.
          </Text>
          <Button label="Grant camera access" style={{ marginTop: 18 }} onPress={requestPermission} />
          <Button label="Exit" variant="ghost" style={{ marginTop: 10 }} onPress={() => router.back()} />
        </View>
      )}

      {/* Overlays */}
      {permission.granted ? (
        <View style={[StyleSheet.absoluteFill, { pointerEvents: "none" }]}>
          {isFacial ? (
            <FaceMeshOverlay width={stageWidth} height={stageHeight} color={palette.accent} />
          ) : (
            <SkeletonOverlay width={stageWidth} height={stageHeight} color={palette.accent} accent={palette.primary} />
          )}
          {/* Trajectory arc + start/end markers */}
          <Svg width={stageWidth} height={stageHeight} style={{ position: "absolute" }}>
            <Defs>
              <LinearGradient id="arcGrad" x1="0" y1="0" x2="1" y2="0">
                <Stop offset="0%" stopColor="#10B981" stopOpacity={0.9} />
                <Stop offset="100%" stopColor="#EF4444" stopOpacity={0.9} />
              </LinearGradient>
            </Defs>
            {!isFacial ? (
              <>
                <Path
                  d={`M ${stageWidth * 0.3} ${stageHeight * 0.55} Q ${stageWidth * 0.5} ${stageHeight * 0.25}, ${stageWidth * 0.7} ${stageHeight * 0.55}`}
                  stroke="url(#arcGrad)"
                  strokeWidth={3.5}
                  fill="none"
                  strokeDasharray="6,6"
                />
                <Circle cx={stageWidth * 0.3} cy={stageHeight * 0.55} r={10} fill="#10B981" stroke="#fff" strokeWidth={2} />
                <Circle cx={stageWidth * 0.7} cy={stageHeight * 0.55} r={10} fill="#EF4444" stroke="#fff" strokeWidth={2} />
              </>
            ) : null}
          </Svg>
        </View>
      ) : null}

      <SafeAreaView style={{ flex: 1 }} edges={["top", "bottom"]}>
        {/* Top HUD */}
        <View style={styles.topRow}>
          <Pressable
            testID="exit-live"
            onPress={() => router.back()}
            style={styles.iconBtnHud}
          >
            <Ionicons name="close" size={20} color="#fff" />
          </Pressable>

          <View style={styles.exerciseTag}>
            <View
              style={{
                width: 8,
                height: 8,
                borderRadius: 4,
                backgroundColor: palette.success,
                marginRight: 8,
              }}
            />
            <Text style={{ color: "#fff", fontSize: 13, fontWeight: "700" }}>
              {exercise.name}
            </Text>
          </View>

          <View style={{ flexDirection: "row", gap: 8 }}>
            <Pressable
              testID="toggle-voice"
              onPress={() => setVoice((v) => !v)}
              style={styles.iconBtnHud}
            >
              <Ionicons name={voice ? "volume-high" : "volume-mute"} size={18} color="#fff" />
            </Pressable>
            <Pressable
              testID="flip-camera"
              onPress={() => setFacing((f) => (f === "front" ? "back" : "front"))}
              style={styles.iconBtnHud}
            >
              <Ionicons name="camera-reverse" size={18} color="#fff" />
            </Pressable>
          </View>
        </View>

        {/* Joint angle pills */}
        <View style={styles.pillsRow}>
          <AnglePill label={isFacial ? "Symmetry" : exercise.joint} value={isFacial ? `${82}%` : `${angle}°`} />
          <AnglePill label="Score" value={String(score)} accent={palette.success} />
          <AnglePill label="FPS" value="29" accent={palette.info} />
        </View>

        <View style={{ flex: 1 }} />

        {/* Feedback bubble */}
        <View
          style={{
            alignSelf: "center",
            paddingHorizontal: 16,
            paddingVertical: 10,
            backgroundColor: "rgba(0,0,0,0.65)",
            borderRadius: 999,
            flexDirection: "row",
            alignItems: "center",
            marginBottom: 20,
            borderWidth: 1,
            borderColor: feedbackColor + "AA",
          }}
        >
          <Ionicons
            name={
              feedback.tone === "success" ? "checkmark-circle" : feedback.tone === "warn" ? "alert-circle" : "information-circle"
            }
            size={16}
            color={feedbackColor}
          />
          <Text style={{ color: "#fff", fontWeight: "700", fontSize: 13, marginLeft: 6 }}>
            {feedback.text}
          </Text>
        </View>

        {/* Bottom control bar */}
        <View style={[styles.bottomBar, { backgroundColor: "rgba(0,0,0,0.55)" }]}>
          <View style={{ flex: 1 }}>
            <Text style={{ color: "rgba(255,255,255,0.7)", fontSize: 11, fontWeight: "700", letterSpacing: 1.2 }}>
              REPS
            </Text>
            <Text style={{ color: "#fff", fontSize: 22, fontWeight: "800", marginTop: 2 }}>
              {reps}
              <Text style={{ color: "rgba(255,255,255,0.6)", fontSize: 14 }}> / {exercise.reps}</Text>
            </Text>
          </View>

          <Animated.View style={[styles.recHalo, haloStyle, { backgroundColor: recording ? palette.danger : palette.success }]} />
          <Pressable
            testID="toggle-record"
            onPress={() => {
              setRecording((r) => !r);
              Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success).catch(() => {});
            }}
            style={[
              styles.recBtn,
              { backgroundColor: recording ? palette.danger : palette.success },
            ]}
          >
            <Ionicons name={recording ? "pause" : "play"} size={26} color="#fff" />
          </Pressable>

          <View style={{ flex: 1, alignItems: "flex-end" }}>
            <Pressable
              testID="finish-session"
              onPress={() => router.replace("/(patient)/session-history")}
              style={{
                paddingHorizontal: 14,
                paddingVertical: 8,
                borderRadius: 999,
                backgroundColor: "rgba(255,255,255,0.18)",
                flexDirection: "row",
                alignItems: "center",
              }}
            >
              <Text style={{ color: "#fff", fontSize: 12, fontWeight: "700" }}>Finish</Text>
              <Ionicons name="arrow-forward" size={14} color="#fff" style={{ marginLeft: 4 }} />
            </Pressable>
          </View>
        </View>
      </SafeAreaView>
    </View>
  );
}

const AnglePill: React.FC<{ label: string; value: string; accent?: string }> = ({ label, value, accent }) => {
  return (
    <View
      style={{
        backgroundColor: "rgba(0,0,0,0.55)",
        paddingHorizontal: 12,
        paddingVertical: 8,
        borderRadius: 12,
        marginRight: 8,
        borderWidth: 1,
        borderColor: "rgba(255,255,255,0.15)",
        minWidth: 78,
      }}
    >
      <Text style={{ color: "rgba(255,255,255,0.7)", fontSize: 10, fontWeight: "700", letterSpacing: 1.1, textTransform: "uppercase" }}>
        {label}
      </Text>
      <Text style={{ color: accent ?? "#fff", fontSize: 16, fontWeight: "800", marginTop: 2 }}>
        {value}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  topRow: {
    paddingHorizontal: 16,
    paddingTop: 6,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  iconBtnHud: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: "rgba(0,0,0,0.5)",
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.15)",
  },
  exerciseTag: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 12,
    height: 38,
    borderRadius: 19,
    backgroundColor: "rgba(0,0,0,0.5)",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.15)",
  },
  pillsRow: {
    flexDirection: "row",
    marginTop: 12,
    paddingHorizontal: 16,
  },
  bottomBar: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 14,
    marginHorizontal: 12,
    marginBottom: 8,
    borderRadius: 24,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.12)",
  },
  recBtn: {
    width: 64,
    height: 64,
    borderRadius: 32,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 3,
    borderColor: "#fff",
  },
  recHalo: {
    position: "absolute",
    width: 80,
    height: 80,
    borderRadius: 40,
    left: "50%",
    marginLeft: -40,
    opacity: 0.3,
  },
});
