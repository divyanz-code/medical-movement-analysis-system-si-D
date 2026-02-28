import { useState } from "react";
import { useNavigate, useSearchParams } from "react-router";
import { ArrowLeft, User, Mail, Cake, Users, Activity } from "lucide-react";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { Card } from "../components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../components/ui/select";
import { mockUser } from "../lib/mockData";

export function EditProfile() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const isOnboarding = searchParams.get("onboarding") === "true";

  const [formData, setFormData] = useState({
    name: mockUser.name,
    email: mockUser.email,
    age: mockUser.age.toString(),
    gender: mockUser.gender,
    affectedLimb: mockUser.affectedLimb,
  });

  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    await new Promise((resolve) => setTimeout(resolve, 1000));
    setIsLoading(false);

    if (isOnboarding) {
      navigate("/home");
    } else {
      navigate("/profile");
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="sticky top-0 bg-background border-b border-border px-4 py-4 flex items-center gap-3 z-10">
        <button
          onClick={() => navigate(-1)}
          className="w-10 h-10 rounded-lg flex items-center justify-center hover:bg-secondary transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        <h1 className="text-xl font-semibold">
          {isOnboarding ? "Complete Your Profile" : "Edit Profile"}
        </h1>
      </div>

      <div className="px-6 py-6 max-w-md mx-auto">
        {isOnboarding && (
          <div className="mb-6">
            <h2 className="text-2xl font-semibold mb-2">Tell us about yourself</h2>
            <p className="text-muted-foreground">
              This helps us personalize your assessment experience
            </p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <Card className="p-6 space-y-6">
            <div className="space-y-2">
              <Label htmlFor="name">Full Name</Label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                <Input
                  id="name"
                  type="text"
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                  className="pl-10 h-12"
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) =>
                    setFormData({ ...formData, email: e.target.value })
                  }
                  className="pl-10 h-12"
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="age">Age</Label>
              <div className="relative">
                <Cake className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                <Input
                  id="age"
                  type="number"
                  min="1"
                  max="120"
                  value={formData.age}
                  onChange={(e) =>
                    setFormData({ ...formData, age: e.target.value })
                  }
                  className="pl-10 h-12"
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="gender">Gender</Label>
              <div className="relative">
                <Users className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground z-10 pointer-events-none" />
                <Select
                  value={formData.gender}
                  onValueChange={(value) =>
                    setFormData({ ...formData, gender: value as any })
                  }
                >
                  <SelectTrigger className="pl-10 h-12">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="male">Male</SelectItem>
                    <SelectItem value="female">Female</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </Card>

          <Card className="p-6 space-y-6">
            <div>
              <h3 className="font-semibold mb-4">Medical Information</h3>
              <div className="space-y-2">
                <Label htmlFor="affectedLimb">Primary Affected Limb</Label>
                <div className="relative">
                  <Activity className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground z-10 pointer-events-none" />
                  <Select
                    value={formData.affectedLimb}
                    onValueChange={(value) =>
                      setFormData({ ...formData, affectedLimb: value as any })
                    }
                  >
                    <SelectTrigger className="pl-10 h-12">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="left-knee">Left Knee</SelectItem>
                      <SelectItem value="right-knee">Right Knee</SelectItem>
                      <SelectItem value="left-shoulder">
                        Left Shoulder
                      </SelectItem>
                      <SelectItem value="right-shoulder">
                        Right Shoulder
                      </SelectItem>
                      <SelectItem value="left-hip">Left Hip</SelectItem>
                      <SelectItem value="right-hip">Right Hip</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <p className="text-xs text-muted-foreground">
                  This helps us prioritize assessments for you
                </p>
              </div>
            </div>
          </Card>

          <Button
            type="submit"
            size="lg"
            className="w-full"
            disabled={isLoading}
          >
            {isLoading
              ? "Saving..."
              : isOnboarding
              ? "Complete Setup"
              : "Save Changes"}
          </Button>
        </form>
      </div>
    </div>
  );
}
