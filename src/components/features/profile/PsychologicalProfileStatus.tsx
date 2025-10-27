import { Card } from "../../ui/card";
import { Button } from "../../ui/button";
import { Brain, CheckCircle2, AlertCircle } from "lucide-react";

export function PsychologicalProfileStatus() {
  const isUpToDate = true;
  const lastAssessment = "Oct 10, 2025";
  const nextRecommended = "Nov 10, 2025";

  return (
    <Card className="rounded-3xl shadow-lg border-0 p-6">
      <div className="flex items-start gap-4 mb-5">
        <div
          className="p-3 rounded-2xl flex-shrink-0"
          style={{ backgroundColor: isUpToDate ? "#8BC34A20" : "#20B2AA10" }}
        >
          <Brain className="w-6 h-6" style={{ color: isUpToDate ? "#8BC34A" : "#20B2AA" }} />
        </div>

        <div className="flex-1">
          <h3 className="text-lg mb-1" style={{ color: "#1C3B5E" }}>
            Psychological Profile
          </h3>
          <p className="text-sm" style={{ color: "#333333", opacity: 0.6 }}>
            AI-powered personalized support
          </p>
        </div>
      </div>

      <div className="mb-5 p-4 rounded-2xl" style={{ backgroundColor: "#f8f8f8" }}>
        <div className="flex items-center gap-2 mb-3">
          {isUpToDate ? (
            <>
              <CheckCircle2 className="w-5 h-5" style={{ color: "#8BC34A" }} />
              <span className="text-sm" style={{ color: "#8BC34A" }}>
                Assessment Up-to-Date
              </span>
            </>
          ) : (
            <>
              <AlertCircle className="w-5 h-5" style={{ color: "#20B2AA" }} />
              <span className="text-sm" style={{ color: "#20B2AA" }}>
                Assessment Recommended
              </span>
            </>
          )}
        </div>

        <div className="space-y-2 text-sm">
          <div className="flex justify-between">
            <span style={{ color: "#333333", opacity: 0.7 }}>Last Completed:</span>
            <span style={{ color: "#333333" }}>{lastAssessment}</span>
          </div>
          <div className="flex justify-between">
            <span style={{ color: "#333333", opacity: 0.7 }}>Next Recommended:</span>
            <span style={{ color: "#333333" }}>{nextRecommended}</span>
          </div>
        </div>
      </div>

      <Button
        className="w-full py-6 rounded-2xl transition-all hover:opacity-90 flex items-center justify-center gap-2"
        style={{
          backgroundColor: isUpToDate ? "#8BC34A" : "#20B2AA",
          color: "white",
        }}
      >
        {isUpToDate ? (
          <>
            <CheckCircle2 className="w-5 h-5" />
            View Current Profile
          </>
        ) : (
          <>
            <Brain className="w-5 h-5" />
            Take New Assessment
          </>
        )}
      </Button>

      <p className="text-xs mt-4 text-center" style={{ color: "#333333", opacity: 0.6 }}>
        Regular assessments help us provide better personalized support
      </p>
    </Card>
  );
}
