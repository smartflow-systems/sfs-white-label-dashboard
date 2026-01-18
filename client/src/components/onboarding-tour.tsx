import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { X, ArrowRight, ArrowLeft, Sparkles } from "lucide-react";

interface TourStep {
  target: string;
  title: string;
  description: string;
  position: "top" | "bottom" | "left" | "right";
}

const tourSteps: TourStep[] = [
  {
    target: ".sidebar",
    title: "Welcome to Your Dashboard! 🎉",
    description: "Navigate between different sections using the sidebar menu. Access Analytics, API Connections, Referrals, and more.",
    position: "right",
  },
  {
    target: ".metric-card",
    title: "Key Metrics at a Glance",
    description: "Monitor your most important KPIs including API requests, revenue, and performance metrics in real-time.",
    position: "bottom",
  },
  {
    target: ".notifications-center",
    title: "Stay Updated",
    description: "Get notified about important events, system updates, and alerts right here.",
    position: "bottom",
  },
  {
    target: ".tenant-selector",
    title: "Multi-Tenant Management",
    description: "Switch between different client accounts effortlessly. Perfect for agencies managing multiple customers.",
    position: "bottom",
  },
  {
    target: ".command-palette-trigger",
    title: "Power User Shortcut",
    description: "Press ⌘K (Ctrl+K on Windows) anytime to quickly navigate using the command palette.",
    position: "bottom",
  },
];

export function OnboardingTour() {
  const [isActive, setIsActive] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [hasSeenTour, setHasSeenTour] = useState(false);

  useEffect(() => {
    // Check if user has seen tour
    const tourCompleted = localStorage.getItem("tour-completed");
    if (!tourCompleted) {
      setTimeout(() => setIsActive(true), 1000);
    } else {
      setHasSeenTour(true);
    }
  }, []);

  const handleNext = () => {
    if (currentStep < tourSteps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      handleComplete();
    }
  };

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSkip = () => {
    handleComplete();
  };

  const handleComplete = () => {
    setIsActive(false);
    localStorage.setItem("tour-completed", "true");
    setHasSeenTour(true);
  };

  const restartTour = () => {
    setCurrentStep(0);
    setIsActive(true);
  };

  if (hasSeenTour && !isActive) {
    return (
      <Button
        onClick={restartTour}
        variant="outline"
        size="sm"
        className="fixed bottom-4 right-4 z-50 glass-card hover-elevate-gold"
      >
        <Sparkles className="w-4 h-4 mr-2" />
        Restart Tour
      </Button>
    );
  }

  if (!isActive) return null;

  const step = tourSteps[currentStep];

  return (
    <>
      {/* Overlay */}
      <div className="fixed inset-0 bg-black/60 z-[9998] animate-fade-in" onClick={handleSkip} />

      {/* Tour Card */}
      <Card className="fixed z-[9999] glass-card border-yellow-500/50 shadow-2xl shadow-yellow-500/20 p-6 max-w-md animate-scale-in">
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-yellow-500" />
            <h3 className="text-lg font-bold">{step.title}</h3>
          </div>
          <Button onClick={handleSkip} variant="ghost" size="icon" className="h-6 w-6">
            <X className="w-4 h-4" />
          </Button>
        </div>

        <p className="text-sm text-muted-foreground mb-6">{step.description}</p>

        <div className="flex items-center justify-between">
          <div className="text-sm text-muted-foreground">
            Step {currentStep + 1} of {tourSteps.length}
          </div>
          <div className="flex gap-2">
            {currentStep > 0 && (
              <Button onClick={handlePrevious} variant="outline" size="sm">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Previous
              </Button>
            )}
            <Button
              onClick={handleNext}
              className="bg-gradient-to-r from-yellow-500 to-yellow-600 text-black hover:from-yellow-600 hover:to-yellow-700"
              size="sm"
            >
              {currentStep < tourSteps.length - 1 ? (
                <>
                  Next
                  <ArrowRight className="w-4 h-4 ml-2" />
                </>
              ) : (
                "Finish"
              )}
            </Button>
          </div>
        </div>

        {/* Progress dots */}
        <div className="flex gap-1 mt-4 justify-center">
          {tourSteps.map((_, index) => (
            <div
              key={index}
              className={`h-1.5 rounded-full transition-all ${
                index === currentStep
                  ? "w-8 bg-gradient-to-r from-yellow-500 to-yellow-600"
                  : index < currentStep
                  ? "w-1.5 bg-green-500"
                  : "w-1.5 bg-muted"
              }`}
            />
          ))}
        </div>
      </Card>

      <style>{`
        .onboarding-tour-card {
          position: fixed;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
        }
      `}</style>
    </>
  );
}
