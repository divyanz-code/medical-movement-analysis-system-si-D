// Mock data for MEDMOVE AI - covers exercises, patients, doctors, sessions,
// notifications, reports, team members, baseline videos.

export interface ExerciseTemplate {
  id: string;
  name: string;
  category: "upper" | "lower" | "spine" | "facial";
  bodyPart: string;
  targetROM: string;
  duration: string;
  reps: number;
  difficulty: "Beginner" | "Intermediate" | "Advanced";
  description: string;
  instructions: string[];
  thumbnail: string;
  joint: string;
}

export const EXERCISES: ExerciseTemplate[] = [
  {
    id: "ex-1",
    name: "Shoulder Flexion",
    category: "upper",
    bodyPart: "Shoulder",
    targetROM: "0°–180°",
    duration: "5 min",
    reps: 10,
    difficulty: "Beginner",
    description:
      "Lift arm forward and upward to restore full shoulder mobility.",
    instructions: [
      "Stand facing the camera",
      "Keep elbow straight",
      "Lift arm forward to overhead",
      "Hold at top for 2 seconds",
      "Lower with control",
    ],
    thumbnail:
      "https://images.unsplash.com/photo-1562771379-eafdca7a02f8?auto=format&fit=crop&w=940&q=80",
    joint: "shoulder",
  },
  {
    id: "ex-2",
    name: "Shoulder Abduction",
    category: "upper",
    bodyPart: "Shoulder",
    targetROM: "0°–180°",
    duration: "4 min",
    reps: 12,
    difficulty: "Beginner",
    description: "Raise arm sideways to restore lateral shoulder range.",
    instructions: [
      "Stand tall, arms at sides",
      "Raise arm sideways",
      "Keep elbow straight",
      "Stop at shoulder height first week",
    ],
    thumbnail:
      "https://images.pexels.com/photos/4498151/pexels-photo-4498151.jpeg?auto=compress&cs=tinysrgb&w=940",
    joint: "shoulder",
  },
  {
    id: "ex-3",
    name: "Elbow Flexion",
    category: "upper",
    bodyPart: "Elbow",
    targetROM: "0°–150°",
    duration: "3 min",
    reps: 15,
    difficulty: "Beginner",
    description: "Bend and straighten elbow to recover full flexion.",
    instructions: [
      "Sit upright in view of camera",
      "Keep upper arm against your side",
      "Bend elbow to touch shoulder",
      "Extend slowly",
    ],
    thumbnail:
      "https://images.pexels.com/photos/4498283/pexels-photo-4498283.jpeg?auto=compress&cs=tinysrgb&w=940",
    joint: "elbow",
  },
  {
    id: "ex-4",
    name: "Knee Flexion",
    category: "lower",
    bodyPart: "Knee",
    targetROM: "0°–135°",
    duration: "6 min",
    reps: 12,
    difficulty: "Intermediate",
    description: "Bend knee to regain full flexion after surgery.",
    instructions: [
      "Lie on back or sit",
      "Slowly bend knee",
      "Aim to touch heel toward glute",
      "Hold 3 seconds at top",
    ],
    thumbnail:
      "https://images.pexels.com/photos/13538710/pexels-photo-13538710.jpeg?auto=compress&cs=tinysrgb&w=940",
    joint: "knee",
  },
  {
    id: "ex-5",
    name: "Knee Extension",
    category: "lower",
    bodyPart: "Knee",
    targetROM: "0°–10°",
    duration: "5 min",
    reps: 10,
    difficulty: "Intermediate",
    description: "Straighten knee to eliminate flexion contracture.",
    instructions: [
      "Sit with leg supported",
      "Slowly extend the knee",
      "Tighten quadriceps at top",
      "Hold 5 seconds",
    ],
    thumbnail:
      "https://images.pexels.com/photos/8657255/pexels-photo-8657255.jpeg?auto=compress&cs=tinysrgb&w=940",
    joint: "knee",
  },
  {
    id: "ex-6",
    name: "Hip Abduction",
    category: "lower",
    bodyPart: "Hip",
    targetROM: "0°–45°",
    duration: "4 min",
    reps: 12,
    difficulty: "Beginner",
    description: "Strengthen hip abductors for stable gait.",
    instructions: [
      "Stand sideways to camera",
      "Lift leg outward",
      "Keep torso upright",
      "Lower with control",
    ],
    thumbnail:
      "https://images.pexels.com/photos/5384538/pexels-photo-5384538.jpeg?auto=compress&cs=tinysrgb&w=940",
    joint: "hip",
  },
  {
    id: "ex-7",
    name: "Lumbar Mobility",
    category: "spine",
    bodyPart: "Lower Back",
    targetROM: "0°–60°",
    duration: "5 min",
    reps: 8,
    difficulty: "Beginner",
    description: "Improve flexion and extension of the lumbar spine.",
    instructions: [
      "Stand with feet shoulder-width",
      "Slowly bend forward",
      "Return to neutral",
      "Then extend gently backward",
    ],
    thumbnail:
      "https://images.unsplash.com/photo-1621691211095-fe4b38f21788?auto=format&fit=crop&w=940&q=80",
    joint: "spine",
  },
  {
    id: "ex-8",
    name: "Neck Rotation",
    category: "spine",
    bodyPart: "Neck",
    targetROM: "0°–80° each side",
    duration: "3 min",
    reps: 10,
    difficulty: "Beginner",
    description: "Restore cervical rotation range.",
    instructions: [
      "Sit tall",
      "Rotate head slowly left",
      "Hold 2 seconds",
      "Return and rotate right",
    ],
    thumbnail:
      "https://images.pexels.com/photos/3823039/pexels-photo-3823039.jpeg?auto=compress&cs=tinysrgb&w=940",
    joint: "neck",
  },
  {
    id: "ex-9",
    name: "Smile Symmetry",
    category: "facial",
    bodyPart: "Face",
    targetROM: "Symmetry > 85%",
    duration: "3 min",
    reps: 15,
    difficulty: "Beginner",
    description: "Train symmetric smile for facial nerve recovery.",
    instructions: [
      "Center your face in the oval",
      "Slowly form a wide smile",
      "Hold for 3 seconds",
      "Relax and repeat",
    ],
    thumbnail:
      "https://images.pexels.com/photos/3768131/pexels-photo-3768131.jpeg?auto=compress&cs=tinysrgb&w=940",
    joint: "face",
  },
  {
    id: "ex-10",
    name: "Eye Closure",
    category: "facial",
    bodyPart: "Eyes",
    targetROM: "Full closure",
    duration: "2 min",
    reps: 20,
    difficulty: "Beginner",
    description: "Improve eye closure strength and symmetry.",
    instructions: [
      "Place face in the oval guide",
      "Slowly close both eyes",
      "Hold 2 seconds",
      "Open and repeat",
    ],
    thumbnail:
      "https://images.pexels.com/photos/3771089/pexels-photo-3771089.jpeg?auto=compress&cs=tinysrgb&w=940",
    joint: "face",
  },
  {
    id: "ex-11",
    name: "Jaw Opening",
    category: "facial",
    bodyPart: "Jaw",
    targetROM: "0°–35°",
    duration: "3 min",
    reps: 12,
    difficulty: "Intermediate",
    description: "Restore jaw mobility for TMJ rehabilitation.",
    instructions: [
      "Align face in guide",
      "Slowly open mouth",
      "Hold 3 seconds",
      "Close with control",
    ],
    thumbnail:
      "https://images.pexels.com/photos/3760137/pexels-photo-3760137.jpeg?auto=compress&cs=tinysrgb&w=940",
    joint: "jaw",
  },
  {
    id: "ex-12",
    name: "Eyebrow Raise",
    category: "facial",
    bodyPart: "Forehead",
    targetROM: "Symmetric lift",
    duration: "2 min",
    reps: 15,
    difficulty: "Beginner",
    description: "Strengthen frontalis for symmetric brow lift.",
    instructions: [
      "Face the camera",
      "Lift both eyebrows together",
      "Hold 2 seconds",
      "Relax",
    ],
    thumbnail:
      "https://images.pexels.com/photos/3779662/pexels-photo-3779662.jpeg?auto=compress&cs=tinysrgb&w=940",
    joint: "face",
  },
];

export interface AssignedExercise {
  id: string;
  exerciseId: string;
  due: string; // ISO date
  status: "pending" | "completed" | "missed";
  scheduledAt: string;
}

export const TODAY_EXERCISES: AssignedExercise[] = [
  { id: "a1", exerciseId: "ex-1", due: "2026-02-12", status: "completed", scheduledAt: "08:30" },
  { id: "a2", exerciseId: "ex-4", due: "2026-02-12", status: "pending", scheduledAt: "11:00" },
  { id: "a3", exerciseId: "ex-9", due: "2026-02-12", status: "pending", scheduledAt: "15:00" },
  { id: "a4", exerciseId: "ex-7", due: "2026-02-12", status: "pending", scheduledAt: "18:00" },
];

export interface SessionRecord {
  id: string;
  exerciseId: string;
  date: string;
  romMin: number;
  romMax: number;
  accuracy: number;
  score: number;
  duration: string;
  symmetry?: number;
}

export const SESSIONS: SessionRecord[] = [
  { id: "s1", exerciseId: "ex-1", date: "2026-02-11", romMin: 5, romMax: 162, accuracy: 92, score: 88, duration: "5:12" },
  { id: "s2", exerciseId: "ex-4", date: "2026-02-10", romMin: 3, romMax: 118, accuracy: 84, score: 80, duration: "6:01" },
  { id: "s3", exerciseId: "ex-9", date: "2026-02-10", romMin: 0, romMax: 0, accuracy: 79, score: 76, duration: "3:08", symmetry: 82 },
  { id: "s4", exerciseId: "ex-7", date: "2026-02-09", romMin: 2, romMax: 54, accuracy: 88, score: 84, duration: "5:00" },
  { id: "s5", exerciseId: "ex-1", date: "2026-02-08", romMin: 8, romMax: 150, accuracy: 86, score: 82, duration: "5:25" },
  { id: "s6", exerciseId: "ex-10", date: "2026-02-07", romMin: 0, romMax: 0, accuracy: 81, score: 78, duration: "2:45", symmetry: 78 },
];

export const PROGRESS_WEEKLY = [
  { label: "W1", rom: 62, accuracy: 70, compliance: 60 },
  { label: "W2", rom: 70, accuracy: 75, compliance: 72 },
  { label: "W3", rom: 78, accuracy: 80, compliance: 80 },
  { label: "W4", rom: 85, accuracy: 84, compliance: 88 },
  { label: "W5", rom: 89, accuracy: 88, compliance: 92 },
  { label: "W6", rom: 92, accuracy: 91, compliance: 94 },
];

export interface NotificationItem {
  id: string;
  title: string;
  message: string;
  time: string;
  type: "reminder" | "report" | "doctor" | "system";
  unread: boolean;
}

export const NOTIFICATIONS: NotificationItem[] = [
  { id: "n1", title: "Time for your exercise", message: "Knee Flexion is scheduled for 11:00 AM", time: "10m ago", type: "reminder", unread: true },
  { id: "n2", title: "Dr. Mehta reviewed your session", message: "Great progress! Keep your pace steady.", time: "2h ago", type: "doctor", unread: true },
  { id: "n3", title: "Weekly report ready", message: "Your Week 6 PDF report is available.", time: "1d ago", type: "report", unread: false },
  { id: "n4", title: "New exercise assigned", message: "Lumbar Mobility added to your routine.", time: "2d ago", type: "doctor", unread: false },
];

export interface PatientRecord {
  id: string;
  name: string;
  age: number;
  gender: "Male" | "Female";
  condition: string;
  bodyPart: string;
  compliance: number;
  recovery: number;
  risk: "low" | "medium" | "high";
  avatar: string;
  lastSession: string;
}

export const PATIENTS: PatientRecord[] = [
  { id: "p1", name: "Aarav Sharma", age: 34, gender: "Male", condition: "ACL Reconstruction", bodyPart: "Knee", compliance: 92, recovery: 78, risk: "low", avatar: "https://images.pexels.com/photos/32160037/pexels-photo-32160037.jpeg?auto=compress&cs=tinysrgb&w=300", lastSession: "Today" },
  { id: "p2", name: "Sara Iyer", age: 52, gender: "Female", condition: "Bell's Palsy", bodyPart: "Face", compliance: 65, recovery: 54, risk: "medium", avatar: "https://images.pexels.com/photos/3768131/pexels-photo-3768131.jpeg?auto=compress&cs=tinysrgb&w=300", lastSession: "Yesterday" },
  { id: "p3", name: "Rohit Bansal", age: 41, gender: "Male", condition: "Rotator Cuff Tear", bodyPart: "Shoulder", compliance: 88, recovery: 82, risk: "low", avatar: "https://images.pexels.com/photos/6129500/pexels-photo-6129500.jpeg?auto=compress&cs=tinysrgb&w=300", lastSession: "2 days ago" },
  { id: "p4", name: "Meera Pillai", age: 67, gender: "Female", condition: "Post-Stroke", bodyPart: "Upper Limb", compliance: 48, recovery: 38, risk: "high", avatar: "https://images.pexels.com/photos/3823039/pexels-photo-3823039.jpeg?auto=compress&cs=tinysrgb&w=300", lastSession: "3 days ago" },
  { id: "p5", name: "Karthik Nair", age: 29, gender: "Male", condition: "Lumbar Strain", bodyPart: "Spine", compliance: 76, recovery: 70, risk: "medium", avatar: "https://images.pexels.com/photos/4498151/pexels-photo-4498151.jpeg?auto=compress&cs=tinysrgb&w=300", lastSession: "Today" },
];

export interface ReportItem {
  id: string;
  patientId?: string;
  title: string;
  date: string;
  size: string;
  exercises: number;
  score: number;
}

export const REPORTS: ReportItem[] = [
  { id: "r1", title: "Week 6 Progress Report", date: "Feb 11, 2026", size: "412 KB", exercises: 24, score: 88 },
  { id: "r2", title: "Week 5 Progress Report", date: "Feb 04, 2026", size: "398 KB", exercises: 22, score: 84 },
  { id: "r3", title: "Initial Assessment", date: "Jan 02, 2026", size: "521 KB", exercises: 6, score: 62 },
];

export interface TeamMember {
  id: string;
  name: string;
  role: string;
  bio: string;
  avatar: string;
}

export const TEAM: TeamMember[] = [
  { id: "t1", name: "Rajendra Pandey", role: "Lead Engineer", bio: "Built the AI movement analysis engine.", avatar: "https://images.pexels.com/photos/32160037/pexels-photo-32160037.jpeg?auto=compress&cs=tinysrgb&w=300" },
  { id: "t2", name: "Dr. Neha Verma", role: "Clinical Advisor", bio: "Physiotherapist guiding rehab protocols.", avatar: "https://images.pexels.com/photos/3823039/pexels-photo-3823039.jpeg?auto=compress&cs=tinysrgb&w=300" },
  { id: "t3", name: "Ankit Singh", role: "Mobile Developer", bio: "Designed and built the Expo mobile app.", avatar: "https://images.pexels.com/photos/6129500/pexels-photo-6129500.jpeg?auto=compress&cs=tinysrgb&w=300" },
  { id: "t4", name: "Priya Joshi", role: "ML Engineer", bio: "Tuned MediaPipe pose models and trajectories.", avatar: "https://images.pexels.com/photos/3768131/pexels-photo-3768131.jpeg?auto=compress&cs=tinysrgb&w=300" },
];

export interface BaselineSession {
  id: string;
  title: string;
  duration: string;
}

export interface BaselineProgram {
  id: string;
  title: string;
  description: string;
  cover: string;
  sessions: BaselineSession[];
}

export const BASELINE_PROGRAMS: BaselineProgram[] = [
  {
    id: "bp1",
    title: "Knee Surgery Discharge",
    description: "Post-op recovery program from week 1 to week 6.",
    cover: "https://images.pexels.com/photos/13538710/pexels-photo-13538710.jpeg?auto=compress&cs=tinysrgb&w=940",
    sessions: [
      { id: "bp1-s1", title: "Week 1 · Gentle Mobilization", duration: "12 min" },
      { id: "bp1-s2", title: "Week 2 · Quad Activation", duration: "14 min" },
      { id: "bp1-s3", title: "Week 3 · Range Expansion", duration: "18 min" },
      { id: "bp1-s4", title: "Week 4 · Strength Building", duration: "20 min" },
    ],
  },
  {
    id: "bp2",
    title: "Bell's Palsy Recovery",
    description: "Facial nerve rehabilitation protocol.",
    cover: "https://images.pexels.com/photos/3768131/pexels-photo-3768131.jpeg?auto=compress&cs=tinysrgb&w=940",
    sessions: [
      { id: "bp2-s1", title: "Day 1 · Facial Awareness", duration: "8 min" },
      { id: "bp2-s2", title: "Day 2 · Smile Symmetry", duration: "10 min" },
      { id: "bp2-s3", title: "Day 3 · Eye Closure", duration: "10 min" },
    ],
  },
  {
    id: "bp3",
    title: "Shoulder Reconstruction",
    description: "Rotator cuff and capsule rehabilitation.",
    cover: "https://images.pexels.com/photos/4498151/pexels-photo-4498151.jpeg?auto=compress&cs=tinysrgb&w=940",
    sessions: [
      { id: "bp3-s1", title: "Phase 1 · Pendulum Swings", duration: "10 min" },
      { id: "bp3-s2", title: "Phase 2 · Assisted Flexion", duration: "15 min" },
      { id: "bp3-s3", title: "Phase 3 · Active Range", duration: "20 min" },
    ],
  },
];

export interface AdminUser {
  id: string;
  name: string;
  email: string;
  role: "Patient" | "Doctor" | "Admin";
  status: "Active" | "Suspended";
  joinedAt: string;
}

export const ADMIN_USERS: AdminUser[] = [
  { id: "u1", name: "Aarav Sharma", email: "aarav@medmove.ai", role: "Patient", status: "Active", joinedAt: "Jan 02" },
  { id: "u2", name: "Dr. Neha Verma", email: "neha@medmove.ai", role: "Doctor", status: "Active", joinedAt: "Dec 14" },
  { id: "u3", name: "Sara Iyer", email: "sara@medmove.ai", role: "Patient", status: "Active", joinedAt: "Jan 11" },
  { id: "u4", name: "Dr. Arjun Mehta", email: "arjun@medmove.ai", role: "Doctor", status: "Active", joinedAt: "Nov 28" },
  { id: "u5", name: "Karthik Nair", email: "karthik@medmove.ai", role: "Patient", status: "Suspended", joinedAt: "Jan 20" },
];

export interface SystemMetric {
  label: string;
  value: string;
  status: "healthy" | "warning" | "critical";
}

export const SYSTEM_METRICS: SystemMetric[] = [
  { label: "API Uptime", value: "99.98%", status: "healthy" },
  { label: "Inference Latency", value: "126ms", status: "healthy" },
  { label: "Active Sessions", value: "142", status: "healthy" },
  { label: "DB Storage", value: "62%", status: "warning" },
  { label: "Cloud Storage", value: "48%", status: "healthy" },
  { label: "Error Rate", value: "0.4%", status: "healthy" },
];

export const findExercise = (id: string) =>
  EXERCISES.find((e) => e.id === id) ?? EXERCISES[0];
