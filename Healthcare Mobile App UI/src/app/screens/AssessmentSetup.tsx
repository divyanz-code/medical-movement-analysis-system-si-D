import { useState } from "react";
import { useNavigate } from "react-router";
import { ArrowLeft, Check } from "lucide-react";
import { Button } from "../components/ui/button";
import { Card } from "../components/ui/card";

export function AssessmentSetup() {
  const navigate = useNavigate();
  const [selectedJoint, setSelectedJoint] = useState<string>("");
  const [selectedTask, setSelectedTask] = useState<string>("");

  const joints = [
    { id: "knee", name: "Knee", description: "Flexion, extension, squat" },
    {
      id: "shoulder",
      name: "Shoulder",
      description: "Reach, rotation, elevation",
    },
    { id: "hip", name: "Hip", description: "Flexion, extension, rotation" },
    { id: "elbow", name: "Elbow", description: "Flexion, extension" },
    { id: "ankle", name: "Ankle", description: "Dorsiflexion, plantarflexion" },
  ];

  const tasks = [
    {
      id: "flexion",
      name: "Flexion",
      description: "Bending movement assessment",
    },
    {
      id: "extension",
      name: "Extension",
      description: "Straightening movement assessment",
    },
    {
      id: "squat",
      name: "Squat",
      description: "Full body squat pattern",
    },
    {
      id: "rotation",
      name: "Rotation",
      description: "Rotational movement pattern",
    },
  ];

  const canProceed = selectedJoint && selectedTask;

  return (
    <div className="min-h-screen bg-background pb-24">
      {/* Header */}
      <div className="sticky top-0 bg-background border-b border-border px-4 py-4 flex items-center gap-3 z-10">
        <button
          onClick={() => navigate(-1)}
          className="w-10 h-10 rounded-lg flex items-center justify-center hover:bg-secondary transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        <h1 className="text-xl font-semibold">Assessment Setup</h1>
      </div>

      <div className="px-6 py-6 max-w-md mx-auto">
        {/* Step indicator */}
        <div className="flex items-center gap-2 mb-6">
          <div className="flex-1 h-1 bg-accent rounded-full" />
          <div className="flex-1 h-1 bg-muted rounded-full" />
          <div className="flex-1 h-1 bg-muted rounded-full" />
        </div>

        {/* Joint Selection */}
        <div className="mb-8">
          <h2 className="text-lg font-semibold mb-2">Select Joint</h2>
          <p className="text-sm text-muted-foreground mb-4">
            Choose the joint you want to assess
          </p>
          <div className="space-y-3">
            {joints.map((joint) => (
              <Card
                key={joint.id}
                className={`p-4 cursor-pointer transition-all ${
                  selectedJoint === joint.id
                    ? "border-2 border-accent bg-accent/5"
                    : "border border-border hover:border-accent/50"
                }`}
                onClick={() => setSelectedJoint(joint.id)}
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">{joint.name}</p>
                    <p className="text-sm text-muted-foreground">
                      {joint.description}
                    </p>
                  </div>
                  {selectedJoint === joint.id && (
                    <div className="w-6 h-6 bg-accent rounded-full flex items-center justify-center">
                      <Check className="w-4 h-4 text-white" />
                    </div>
                  )}
                </div>
              </Card>
            ))}
          </div>
        </div>

        {/* Task Selection */}
        <div className="mb-8">
          <h2 className="text-lg font-semibold mb-2">Select Movement Task</h2>
          <p className="text-sm text-muted-foreground mb-4">
            Choose the movement pattern to analyze
          </p>
          <div className="space-y-3">
            {tasks.map((task) => (
              <Card
                key={task.id}
                className={`p-4 cursor-pointer transition-all ${
                  selectedTask === task.id
                    ? "border-2 border-accent bg-accent/5"
                    : "border border-border hover:border-accent/50"
                }`}
                onClick={() => setSelectedTask(task.id)}
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">{task.name}</p>
                    <p className="text-sm text-muted-foreground">
                      {task.description}
                    </p>
                  </div>
                  {selectedTask === task.id && (
                    <div className="w-6 h-6 bg-accent rounded-full flex items-center justify-center">
                      <Check className="w-4 h-4 text-white" />
                    </div>
                  )}
                </div>
              </Card>
            ))}
          </div>
        </div>
      </div>

      {/* Fixed Bottom CTA */}
      <div className="fixed bottom-0 left-0 right-0 bg-background border-t border-border px-6 py-4">
        <div className="max-w-md mx-auto">
          <Button
            size="lg"
            className="w-full"
            disabled={!canProceed}
            onClick={() => navigate("/camera")}
          >
            Continue to Recording
          </Button>
        </div>
      </div>
    </div>
  );
}
