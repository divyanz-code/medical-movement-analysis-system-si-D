import { useNavigate } from "react-router";
import { Edit, ChevronRight, User as UserIcon, Mail, Cake, Users } from "lucide-react";
import { Button } from "../components/ui/button";
import { Card } from "../components/ui/card";
import { BottomNav } from "../components/BottomNav";
import { mockUser } from "../lib/mockData";
import { Avatar, AvatarFallback } from "../components/ui/avatar";

export function Profile() {
  const navigate = useNavigate();

  const profileSections = [
    {
      label: "Full Name",
      value: mockUser.name,
      icon: UserIcon,
    },
    {
      label: "Email",
      value: mockUser.email,
      icon: Mail,
    },
    {
      label: "Age",
      value: `${mockUser.age} years`,
      icon: Cake,
    },
    {
      label: "Gender",
      value: mockUser.gender.charAt(0).toUpperCase() + mockUser.gender.slice(1),
      icon: Users,
    },
  ];

  return (
    <div className="min-h-screen bg-secondary pb-20">
      {/* Header */}
      <div className="bg-gradient-to-br from-primary to-accent pt-12 pb-16 px-6">
        <div className="max-w-md mx-auto text-center">
          <Avatar className="w-24 h-24 mx-auto mb-4 border-4 border-white/20">
            <AvatarFallback className="bg-white/10 text-white text-2xl">
              {mockUser.name
                .split(" ")
                .map((n) => n[0])
                .join("")}
            </AvatarFallback>
          </Avatar>
          <h1 className="text-2xl font-semibold text-white mb-1">
            {mockUser.name}
          </h1>
          <p className="text-white/80">{mockUser.email}</p>
        </div>
      </div>

      {/* Profile Info */}
      <div className="px-6 -mt-8 max-w-md mx-auto space-y-6">
        <Card className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold">Personal Information</h2>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => navigate("/edit-profile")}
            >
              <Edit className="w-4 h-4 mr-2" />
              Edit
            </Button>
          </div>

          <div className="space-y-4">
            {profileSections.map((section, index) => {
              const Icon = section.icon;
              return (
                <div key={index} className="flex items-center gap-4">
                  <div className="w-10 h-10 bg-secondary rounded-lg flex items-center justify-center">
                    <Icon className="w-5 h-5 text-muted-foreground" />
                  </div>
                  <div className="flex-1">
                    <p className="text-xs text-muted-foreground">
                      {section.label}
                    </p>
                    <p className="font-medium">{section.value}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </Card>

        {/* Medical Profile */}
        <Card className="p-6">
          <h2 className="text-lg font-semibold mb-4">Medical Profile</h2>
          <div className="space-y-4">
            <div>
              <p className="text-sm text-muted-foreground mb-1">
                Affected Limb
              </p>
              <p className="font-medium">
                {mockUser.affectedLimb
                  .split("-")
                  .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
                  .join(" ")}
              </p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground mb-1">
                Assessment Count
              </p>
              <p className="font-medium">5 sessions completed</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground mb-1">
                Member Since
              </p>
              <p className="font-medium">January 2026</p>
            </div>
          </div>
        </Card>

        {/* Quick Actions */}
        <Card className="p-4">
          <button
            onClick={() => navigate("/history")}
            className="w-full flex items-center justify-between py-3 hover:bg-secondary transition-colors rounded-lg px-2"
          >
            <span className="font-medium">View All Assessments</span>
            <ChevronRight className="w-5 h-5 text-muted-foreground" />
          </button>
          <button
            onClick={() => navigate("/settings")}
            className="w-full flex items-center justify-between py-3 hover:bg-secondary transition-colors rounded-lg px-2"
          >
            <span className="font-medium">Account Settings</span>
            <ChevronRight className="w-5 h-5 text-muted-foreground" />
          </button>
        </Card>
      </div>

      <BottomNav />
    </div>
  );
}
