import { useEffect } from "react";
import { useNavigate } from "react-router";
import { Activity } from "lucide-react";
import { motion } from "motion/react";

export function Splash() {
  const navigate = useNavigate();

  useEffect(() => {
    const timer = setTimeout(() => {
      navigate("/welcome");
    }, 2000);

    return () => clearTimeout(timer);
  }, [navigate]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary to-accent flex items-center justify-center px-6">
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="text-center"
      >
        <motion.div
          animate={{ rotate: [0, 5, -5, 0] }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
          className="inline-block mb-6"
        >
          <Activity className="w-20 h-20 text-white" strokeWidth={2} />
        </motion.div>
        <h1 className="text-4xl font-semibold text-white mb-2">
          Medical Movement
        </h1>
        <p className="text-xl text-white/80">Analysis</p>
      </motion.div>
    </div>
  );
}
