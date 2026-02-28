import { useState } from "react";
import { useNavigate } from "react-router";
import {
  Bell,
  Shield,
  HelpCircle,
  FileText,
  LogOut,
  ChevronRight,
  Moon,
  Ruler,
} from "lucide-react";
import { Card } from "../components/ui/card";
import { Switch } from "../components/ui/switch";
import { BottomNav } from "../components/BottomNav";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../components/ui/select";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "../components/ui/alert-dialog";

export function Settings() {
  const navigate = useNavigate();
  const [notifications, setNotifications] = useState(true);
  const [darkMode, setDarkMode] = useState(false);
  const [units, setUnits] = useState("metric");
  const [showLogoutDialog, setShowLogoutDialog] = useState(false);

  const handleLogout = () => {
    setShowLogoutDialog(false);
    navigate("/welcome");
  };

  return (
    <div className="min-h-screen bg-secondary pb-20">
      {/* Header */}
      <div className="bg-background border-b border-border px-6 pt-12 pb-6">
        <h1 className="text-2xl font-semibold">Settings</h1>
      </div>

      <div className="px-6 py-6 max-w-md mx-auto space-y-6">
        {/* Preferences */}
        <div>
          <h2 className="text-sm font-semibold text-muted-foreground mb-3 px-1">
            PREFERENCES
          </h2>
          <Card className="divide-y divide-border">
            <div className="p-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-accent/10 rounded-lg flex items-center justify-center">
                  <Bell className="w-5 h-5 text-accent" />
                </div>
                <div>
                  <p className="font-medium">Notifications</p>
                  <p className="text-sm text-muted-foreground">
                    Assessment reminders
                  </p>
                </div>
              </div>
              <Switch checked={notifications} onCheckedChange={setNotifications} />
            </div>

            <div className="p-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-accent/10 rounded-lg flex items-center justify-center">
                  <Moon className="w-5 h-5 text-accent" />
                </div>
                <div>
                  <p className="font-medium">Dark Mode</p>
                  <p className="text-sm text-muted-foreground">
                    Use dark theme
                  </p>
                </div>
              </div>
              <Switch checked={darkMode} onCheckedChange={setDarkMode} />
            </div>

            <div className="p-4 flex items-center justify-between">
              <div className="flex items-center gap-3 flex-1">
                <div className="w-10 h-10 bg-accent/10 rounded-lg flex items-center justify-center">
                  <Ruler className="w-5 h-5 text-accent" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-medium">Units</p>
                  <p className="text-sm text-muted-foreground">
                    Measurement system
                  </p>
                </div>
              </div>
              <Select value={units} onValueChange={setUnits}>
                <SelectTrigger className="w-32">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="metric">Metric</SelectItem>
                  <SelectItem value="imperial">Imperial</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </Card>
        </div>

        {/* Privacy & Security */}
        <div>
          <h2 className="text-sm font-semibold text-muted-foreground mb-3 px-1">
            PRIVACY & SECURITY
          </h2>
          <Card className="divide-y divide-border">
            <button
              onClick={() => {}}
              className="w-full p-4 flex items-center justify-between hover:bg-secondary transition-colors"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-accent/10 rounded-lg flex items-center justify-center">
                  <Shield className="w-5 h-5 text-accent" />
                </div>
                <div className="text-left">
                  <p className="font-medium">Privacy Policy</p>
                  <p className="text-sm text-muted-foreground">
                    How we handle your data
                  </p>
                </div>
              </div>
              <ChevronRight className="w-5 h-5 text-muted-foreground" />
            </button>

            <button
              onClick={() => {}}
              className="w-full p-4 flex items-center justify-between hover:bg-secondary transition-colors"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-accent/10 rounded-lg flex items-center justify-center">
                  <FileText className="w-5 h-5 text-accent" />
                </div>
                <div className="text-left">
                  <p className="font-medium">Terms of Service</p>
                  <p className="text-sm text-muted-foreground">
                    Our terms and conditions
                  </p>
                </div>
              </div>
              <ChevronRight className="w-5 h-5 text-muted-foreground" />
            </button>
          </Card>
        </div>

        {/* Support */}
        <div>
          <h2 className="text-sm font-semibold text-muted-foreground mb-3 px-1">
            SUPPORT
          </h2>
          <Card className="divide-y divide-border">
            <button
              onClick={() => navigate("/design-system")}
              className="w-full p-4 flex items-center justify-between hover:bg-secondary transition-colors"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-accent/10 rounded-lg flex items-center justify-center">
                  <FileText className="w-5 h-5 text-accent" />
                </div>
                <div className="text-left">
                  <p className="font-medium">Design System</p>
                  <p className="text-sm text-muted-foreground">
                    View component library
                  </p>
                </div>
              </div>
              <ChevronRight className="w-5 h-5 text-muted-foreground" />
            </button>

            <button
              onClick={() => {}}
              className="w-full p-4 flex items-center justify-between hover:bg-secondary transition-colors"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-accent/10 rounded-lg flex items-center justify-center">
                  <HelpCircle className="w-5 h-5 text-accent" />
                </div>
                <div className="text-left">
                  <p className="font-medium">Help & Support</p>
                  <p className="text-sm text-muted-foreground">
                    Get help with the app
                  </p>
                </div>
              </div>
              <ChevronRight className="w-5 h-5 text-muted-foreground" />
            </button>

            <div className="p-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-accent/10 rounded-lg flex items-center justify-center">
                  <FileText className="w-5 h-5 text-accent" />
                </div>
                <div>
                  <p className="font-medium">Version</p>
                  <p className="text-sm text-muted-foreground">1.0.0 (2026)</p>
                </div>
              </div>
            </div>
          </Card>
        </div>

        {/* Account Actions */}
        <div>
          <h2 className="text-sm font-semibold text-muted-foreground mb-3 px-1">
            ACCOUNT
          </h2>
          <Card>
            <button
              onClick={() => setShowLogoutDialog(true)}
              className="w-full p-4 flex items-center gap-3 hover:bg-destructive/5 transition-colors rounded-lg"
            >
              <div className="w-10 h-10 bg-destructive/10 rounded-lg flex items-center justify-center">
                <LogOut className="w-5 h-5 text-destructive" />
              </div>
              <p className="font-medium text-destructive">Sign Out</p>
            </button>
          </Card>
        </div>
      </div>

      {/* Logout Confirmation Dialog */}
      <AlertDialog open={showLogoutDialog} onOpenChange={setShowLogoutDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Sign Out</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to sign out? Your data will be safely stored
              and available when you sign back in.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleLogout} className="bg-destructive text-white hover:bg-destructive/90">
              Sign Out
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <BottomNav />
    </div>
  );
}