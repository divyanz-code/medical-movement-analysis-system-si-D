import { useNavigate } from "react-router";
import { Activity, Shield, TrendingUp, Camera } from "lucide-react";
import { Button } from "../components/ui/button";
import { motion } from "motion/react";

export function Welcome() {
  const navigate = useNavigate();

  const features = [
    {
      icon: Camera,
      title: "Video Analysis",
      description: "Record movement with guided overlays for accurate tracking",
    },
    {
      icon: Activity,
      title: "AI-Powered Insights",
      description: "Get instant feedback on joint angles and movement patterns",
    },
    {
      icon: TrendingUp,
      title: "Track Progress",
      description: "Monitor recovery with detailed trends and history",
    },
    {
      icon: Shield,
      title: "Clinical Grade",
      description: "Built with medical professionals for reliable results",
    },
  ];

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Header with gradient */}
      <div className="bg-gradient-to-br from-primary to-accent pt-16 pb-12 px-6 text-center">
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          <Activity className="w-16 h-16 text-white mx-auto mb-4" />
          <h1 className="text-3xl font-semibold text-white mb-3">
            Welcome to Medical Movement Analysis
          </h1>
          <p className="text-lg text-white/90 max-w-md mx-auto">
            Professional movement assessment at your fingertips
          </p>
        </motion.div>
      </div>

      {/* Features */}
      <div className="flex-1 px-6 py-8">
        <div className="max-w-md mx-auto space-y-6">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <motion.div
                key={index}
                initial={{ x: -20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: index * 0.1, duration: 0.4 }}
                className="flex gap-4"
              >
                <div className="w-12 h-12 rounded-xl bg-accent/10 flex items-center justify-center flex-shrink-0">
                  <Icon className="w-6 h-6 text-accent" />
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-foreground mb-1">
                    {feature.title}
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    {feature.description}
                  </p>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>

      {/* CTA Buttons */}
      <div className="px-6 pb-8 space-y-3 max-w-md mx-auto w-full">
        <Button
          size="lg"
          className="w-full"
          onClick={() => navigate("/signup")}
        >
          Get Started
        </Button>
        <Button
          size="lg"
          variant="outline"
          className="w-full"
          onClick={() => navigate("/login")}
        >
          Sign In
        </Button>
      </div>
    </div>
  );
}
