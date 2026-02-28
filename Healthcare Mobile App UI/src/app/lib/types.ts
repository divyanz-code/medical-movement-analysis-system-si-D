export interface User {
  id: string;
  name: string;
  email: string;
  age: number;
  gender: "male" | "female" | "other";
  affectedLimb: "left-knee" | "right-knee" | "left-shoulder" | "right-shoulder" | "left-hip" | "right-hip";
  avatar?: string;
}

export interface Assessment {
  id: string;
  userId: string;
  date: string;
  jointType: string;
  taskType: string;
  minAngle: number;
  maxAngle: number;
  rom: number;
  movementScore: number;
  compensationDetected: boolean;
  videoUrl?: string;
  notes?: string;
}

export type JointType = "knee" | "shoulder" | "hip" | "elbow" | "ankle";
export type TaskType = "flexion" | "extension" | "squat" | "reach" | "rotation";
export type CompensationStatus = "aligned" | "compensatory" | "warning";
