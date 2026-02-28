import { createBrowserRouter } from "react-router";
import { Splash } from "./screens/Splash";
import { Welcome } from "./screens/Welcome";
import { SignUp } from "./screens/SignUp";
import { Login } from "./screens/Login";
import { ForgotPassword } from "./screens/ForgotPassword";
import { Home } from "./screens/Home";
import { AssessmentSetup } from "./screens/AssessmentSetup";
import { CameraRecord } from "./screens/CameraRecord";
import { VideoPreview } from "./screens/VideoPreview";
import { UploadProgress } from "./screens/UploadProgress";
import { Results } from "./screens/Results";
import { History } from "./screens/History";
import { HistoryDetail } from "./screens/HistoryDetail";
import { Profile } from "./screens/Profile";
import { EditProfile } from "./screens/EditProfile";
import { Settings } from "./screens/Settings";
import { Offline } from "./screens/Offline";
import { PermissionDenied } from "./screens/PermissionDenied";
import { DesignSystem } from "./screens/DesignSystem";

export const router = createBrowserRouter([
  {
    path: "/",
    Component: Splash,
  },
  {
    path: "/welcome",
    Component: Welcome,
  },
  {
    path: "/signup",
    Component: SignUp,
  },
  {
    path: "/login",
    Component: Login,
  },
  {
    path: "/forgot-password",
    Component: ForgotPassword,
  },
  {
    path: "/home",
    Component: Home,
  },
  {
    path: "/assessment",
    Component: AssessmentSetup,
  },
  {
    path: "/camera",
    Component: CameraRecord,
  },
  {
    path: "/preview",
    Component: VideoPreview,
  },
  {
    path: "/upload",
    Component: UploadProgress,
  },
  {
    path: "/results/:id",
    Component: Results,
  },
  {
    path: "/history",
    Component: History,
  },
  {
    path: "/history/:id",
    Component: HistoryDetail,
  },
  {
    path: "/profile",
    Component: Profile,
  },
  {
    path: "/edit-profile",
    Component: EditProfile,
  },
  {
    path: "/settings",
    Component: Settings,
  },
  {
    path: "/offline",
    Component: Offline,
  },
  {
    path: "/permission-denied",
    Component: PermissionDenied,
  },
  {
    path: "/design-system",
    Component: DesignSystem,
  },
]);