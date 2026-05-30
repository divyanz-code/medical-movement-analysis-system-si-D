import { StatusBar } from "expo-status-bar";
import { useRouter } from "expo-router";
import { useEffect, useRef, useState } from "react";
import { ActivityIndicator, Pressable, SafeAreaView, ScrollView, StyleSheet, Text, View, useWindowDimensions } from "react-native";
import { Feather } from "@expo/vector-icons";
import { CameraView, useCameraPermissions, useMicrophonePermissions } from "expo-camera";
import { VideoView, useVideoPlayer } from "expo-video";

import { patientFlow } from "../../src/runtime/client";
import { AppButton } from "../../src/ui/components/AppButton";
import { AppCard } from "../../src/ui/components/AppCard";
import { RecordButton } from "../../src/ui/components/RecordButton";
import { StatusChip } from "../../src/ui/components/StatusChip";
import { colors, moderateScale, radius, responsiveFont, spacing } from "../../src/ui/theme";

export default function RecordScreen() {
  const router = useRouter();
  const { height: screenHeight } = useWindowDimensions();
  const cameraRef = useRef<CameraView | null>(null);
  const [permission, requestPermission] = useCameraPermissions();
  const [micPermission, requestMicPermission] = useMicrophonePermissions();
  const [recording, setRecording] = useState(false);
  const [elapsedSeconds, setElapsedSeconds] = useState(0);
  const [durationSeconds, setDurationSeconds] = useState(0);
  const [videoUri, setVideoUri] = useState<string | null>(null);
  const [status, setStatus] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const [cameraFacing, setCameraFacing] = useState<"back" | "front">("back");
  const [torchEnabled, setTorchEnabled] = useState(false);
  const cameraHeight = Math.min(Math.max(screenHeight * 0.42, 260), 380);
  const previewHeight = Math.min(Math.max(screenHeight * 0.26, 180), 260);

  const player = useVideoPlayer(videoUri ? { uri: videoUri } : null, (instance) => {
    instance.loop = true;
  });

  useEffect(() => {
    if (!recording) return;
    const interval = setInterval(() => {
      setElapsedSeconds((current) => Math.min(15, current + 1));
    }, 1000);
    return () => clearInterval(interval);
  }, [recording]);

  useEffect(() => {
    if (cameraFacing === "front" && torchEnabled) {
      setTorchEnabled(false);
    }
  }, [cameraFacing, torchEnabled]);

  async function startRecording() {
    if (!cameraRef.current) return;
    setStatus(null);
    setElapsedSeconds(0);
    setRecording(true);
    const startedAt = Date.now();
    try {
      const video = await cameraRef.current.recordAsync({ maxDuration: 15 });
      if (video?.uri) {
        setVideoUri(video.uri);
        const duration = Math.max(1, Math.round((Date.now() - startedAt) / 1000));
        setDurationSeconds(duration);
      }
    } catch (error) {
      setStatus(error instanceof Error ? error.message : "Recording failed");
    } finally {
      setRecording(false);
    }
  }

  function stopRecording() {
    cameraRef.current?.stopRecording();
  }

  function toggleCameraFacing() {
    setCameraFacing((current) => (current === "back" ? "front" : "back"));
  }

  function toggleTorch() {
    setTorchEnabled((current) => !current);
  }

  async function uploadVideo() {
    if (!videoUri) return;
    setUploading(true);
    setStatus(null);

    try {
      // Use direct file descriptor for React Native FormData instead of fetching blob
      const videoFile = {
        uri: videoUri,
        type: "video/mp4",
        name: "movement.mp4"
      } as any as Blob;

      const { videoId } = await patientFlow.uploadRecordedVideo({
        video: videoFile,
        fileName: "movement.mp4",
        mimeType: "video/mp4",
        durationSeconds
      });
      router.push({ pathname: "/(app)/results", params: { videoId: String(videoId) } });
    } catch (error) {
      setStatus(error instanceof Error ? error.message : "Upload failed");
    } finally {
      setUploading(false);
    }
  }

  if (!permission || !micPermission) {
    return (
      <SafeAreaView style={styles.centeredRoot}>
        <ActivityIndicator color={colors.accent} />
      </SafeAreaView>
    );
  }

  if (!permission.granted || !micPermission.granted) {
    const handleRequestPermissions = async () => {
      const cameraResult = await requestPermission();
      if (cameraResult.granted) {
        await requestMicPermission();
      }
    };

    return (
      <SafeAreaView style={styles.permissionRoot}>
        <StatusBar style="dark" backgroundColor={colors.surface} />
        <View style={styles.permissionHeader}>
          <Pressable style={styles.backButton} onPress={() => router.back()}>
            <Feather name="arrow-left" size={18} color={colors.text} />
          </Pressable>
        </View>
        <View style={styles.permissionCard}>
          <AppCard>
            <Text style={styles.permissionText}>
              Grant camera and microphone permissions to capture assessment videos.
            </Text>
            <View style={styles.permissionAction}>
              <AppButton label="Grant Permissions" onPress={handleRequestPermissions} />
            </View>
          </AppCard>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.root}>
      <StatusBar style="light" backgroundColor={colors.darkSurface} />
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={[styles.cameraFrame, { height: cameraHeight }]}>
          <CameraView
            ref={cameraRef}
            style={styles.camera}
            mode="video"
            facing={cameraFacing}
            enableTorch={cameraFacing === "back" && torchEnabled}
          />
          <View style={styles.overlayBack}>
            <Pressable style={styles.overlayBackButton} onPress={() => router.back()}>
              <Feather name="arrow-left" size={18} color={colors.white} />
            </Pressable>
          </View>
          {recording ? (
            <View style={styles.timerOverlay}>
              <View style={styles.timerDot} />
              <Text style={styles.timerText}>{elapsedSeconds}s / 15s</Text>
            </View>
          ) : null}
          {!recording ? (
            <View style={styles.overlayStatus}>
              <StatusChip status="aligned" label="Ready" />
            </View>
          ) : null}
        </View>

        <View style={styles.controlsSection}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Record Assessment</Text>
            <Text style={styles.sectionHint}>Record 5 to 15 seconds</Text>
          </View>

          <View style={styles.controlsRow}>
            <Pressable
              style={[styles.sideControlButton, cameraFacing !== "back" && styles.sideControlButtonDisabled]}
              onPress={toggleTorch}
              disabled={recording || cameraFacing !== "back"}
            >
              <Feather name={torchEnabled ? "zap" : "zap-off"} size={18} color={colors.white} />
            </Pressable>
            <RecordButton isRecording={recording} onPress={recording ? stopRecording : startRecording} />
            <Pressable style={styles.sideControlButton} onPress={toggleCameraFacing} disabled={recording}>
              <Feather name="refresh-cw" size={18} color={colors.white} />
            </Pressable>
          </View>

          {videoUri ? (
            <AppCard>
              <Text style={styles.previewTitle}>Preview ({durationSeconds}s)</Text>
              <View style={[styles.previewFrame, { height: previewHeight }]}>
                <VideoView
                  player={player}
                  style={styles.video}
                  allowsFullscreen
                  allowsPictureInPicture={false}
                />
              </View>
              <View style={styles.uploadButtonWrap}>
                <AppButton label="Upload for Analysis" onPress={uploadVideo} loading={uploading} />
              </View>
            </AppCard>
          ) : (
            <AppCard>
              <View style={styles.emptyPreviewWrap}>
                <View style={styles.emptyPreviewIcon}>
                  <Feather name="video" size={18} color={colors.accent} />
                </View>
                <Text style={styles.emptyPreviewTitle}>No video yet</Text>
                <Text style={styles.emptyPreviewText}>Tap record to capture your assessment.</Text>
              </View>
            </AppCard>
          )}

          {status ? <Text style={styles.errorText}>{status}</Text> : null}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: colors.darkSurface
  },
  scrollContent: {
    paddingBottom: spacing.xl
  },
  centeredRoot: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: colors.surface
  },
  permissionRoot: {
    flex: 1,
    backgroundColor: colors.surface
  },
  permissionHeader: {
    paddingHorizontal: spacing.xl,
    paddingTop: spacing.lg
  },
  backButton: {
    width: moderateScale(36),
    height: moderateScale(36),
    borderRadius: radius.pill,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.card,
    alignItems: "center",
    justifyContent: "center"
  },
  permissionCard: {
    paddingHorizontal: spacing.xl,
    paddingTop: spacing.lg
  },
  permissionText: {
    color: colors.text,
    lineHeight: moderateScale(21)
  },
  permissionAction: {
    marginTop: spacing.md
  },
  cameraFrame: {
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: colors.whiteTint,
    overflow: "hidden",
    marginHorizontal: spacing.md,
    marginTop: spacing.sm
  },
  camera: {
    flex: 1
  },
  overlayBack: {
    position: "absolute",
    top: spacing.sm,
    left: spacing.sm
  },
  overlayBackButton: {
    width: moderateScale(34),
    height: moderateScale(34),
    borderRadius: radius.pill,
    backgroundColor: colors.darkOverlay,
    alignItems: "center",
    justifyContent: "center"
  },
  timerOverlay: {
    position: "absolute",
    top: spacing.sm,
    alignSelf: "center",
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.xs,
    backgroundColor: colors.darkOverlay,
    borderRadius: radius.pill,
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs
  },
  timerDot: {
    width: moderateScale(7),
    height: moderateScale(7),
    borderRadius: radius.pill,
    backgroundColor: colors.danger
  },
  timerText: {
    color: colors.white,
    fontWeight: "700",
    fontSize: responsiveFont(12)
  },
  overlayStatus: {
    position: "absolute",
    right: spacing.sm,
    bottom: spacing.sm
  },
  controlsSection: {
    paddingHorizontal: spacing.xl,
    paddingTop: spacing.md,
    gap: spacing.md
  },
  sectionHeader: {
    alignItems: "center",
    gap: spacing.xs
  },
  sectionTitle: {
    color: colors.white,
    fontSize: responsiveFont(18),
    fontWeight: "700"
  },
  sectionHint: {
    color: colors.whiteMuted,
    fontSize: responsiveFont(12)
  },
  controlsRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: spacing.lg
  },
  sideControlButton: {
    width: moderateScale(46),
    height: moderateScale(46),
    borderRadius: radius.pill,
    borderWidth: 1,
    borderColor: colors.whiteTint,
    backgroundColor: colors.darkOverlay,
    alignItems: "center",
    justifyContent: "center"
  },
  sideControlButtonDisabled: {
    opacity: 0.45
  },
  previewTitle: {
    color: colors.text,
    fontWeight: "700",
    fontSize: responsiveFont(14)
  },
  previewFrame: {
    marginTop: spacing.sm,
    borderRadius: radius.md,
    overflow: "hidden"
  },
  video: {
    flex: 1
  },
  uploadButtonWrap: {
    marginTop: spacing.md
  },
  emptyPreviewWrap: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: spacing.lg,
    gap: spacing.xs
  },
  emptyPreviewIcon: {
    width: moderateScale(40),
    height: moderateScale(40),
    borderRadius: radius.pill,
    backgroundColor: colors.accentSoft,
    alignItems: "center",
    justifyContent: "center"
  },
  emptyPreviewTitle: {
    color: colors.text,
    fontWeight: "700",
    fontSize: responsiveFont(14)
  },
  emptyPreviewText: {
    color: colors.textMuted,
    fontSize: responsiveFont(12)
  },
  errorText: {
    color: colors.dangerSoft,
    textAlign: "center"
  }
});
