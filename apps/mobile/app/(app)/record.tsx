import { useRouter } from "expo-router";
import { useRef, useState } from "react";
import { Button, SafeAreaView, Text, View } from "react-native";
import { CameraView, useCameraPermissions } from "expo-camera";
import { VideoView, useVideoPlayer } from "expo-video";

import { patientFlow } from "../../src/runtime/client";

export default function RecordScreen() {
  const router = useRouter();
  const cameraRef = useRef<CameraView | null>(null);
  const [permission, requestPermission] = useCameraPermissions();
  const [recording, setRecording] = useState(false);
  const [durationSeconds, setDurationSeconds] = useState(0);
  const [videoUri, setVideoUri] = useState<string | null>(null);
  const [status, setStatus] = useState<string | null>(null);

  const player = useVideoPlayer(videoUri ? { uri: videoUri } : null, (instance) => {
    instance.loop = true;
  });

  async function startRecording() {
    if (!cameraRef.current) return;
    setStatus(null);
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

  async function uploadVideo() {
    if (!videoUri) return;

    try {
      const response = await fetch(videoUri);
      const blob = await response.blob();
      const { videoId } = await patientFlow.uploadRecordedVideo({
        video: blob,
        fileName: "movement.mp4",
        mimeType: "video/mp4",
        durationSeconds
      });
      router.push({ pathname: "/(app)/results", params: { videoId: String(videoId) } });
    } catch (error) {
      setStatus(error instanceof Error ? error.message : "Upload failed");
    }
  }

  if (!permission) {
    return <SafeAreaView style={{ flex: 1 }} />;
  }

  if (!permission.granted) {
    return (
      <SafeAreaView style={{ flex: 1, alignItems: "center", justifyContent: "center", gap: 12 }}>
        <Text>Camera permission is required to record movement videos.</Text>
        <Button title="Grant Permission" onPress={requestPermission} />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={{ flex: 1, padding: 12, gap: 12 }}>
      <View style={{ height: 280, borderRadius: 12, overflow: "hidden" }}>
        <CameraView ref={cameraRef} style={{ flex: 1 }} mode="video" facing="back" />
      </View>

      <View style={{ flexDirection: "row", gap: 10 }}>
        <Button
          title={recording ? "Recording..." : "Start Recording"}
          onPress={startRecording}
          disabled={recording}
        />
        <Button title="Stop" onPress={stopRecording} disabled={!recording} />
      </View>

      {videoUri ? (
        <View style={{ gap: 8 }}>
          <Text>Preview ({durationSeconds}s)</Text>
          <View style={{ height: 220, borderRadius: 12, overflow: "hidden" }}>
            <VideoView
              player={player}
              style={{ flex: 1 }}
              allowsFullscreen
              allowsPictureInPicture={false}
            />
          </View>
          <Button title="Upload for Analysis" onPress={uploadVideo} />
        </View>
      ) : null}

      {status ? <Text style={{ color: "#b00020" }}>{status}</Text> : null}
    </SafeAreaView>
  );
}
