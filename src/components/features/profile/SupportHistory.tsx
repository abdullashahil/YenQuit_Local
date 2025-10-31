import React from "react";
import { Card } from "../../ui/card";
import { Button } from "../../ui/button";
import { Phone, MessageSquare } from "lucide-react";

export function SupportHistory() {
  const handleCall = (number: string) => {
    window.location.href = `tel:${number}`;
  };

  return (
    <Card className="rounded-3xl shadow-lg border-0 p-6">
      {/* Header */}
      <div className="mb-6 text-center md:text-left">
        <h3 className="text-xl font-semibold text-[#1C3B5E]">
          24/7 Helpline
        </h3>
        <p className="text-sm mt-1 text-[#333333]/60">
          Get immediate support from our helplines
        </p>
      </div>

      {/* Responsive Grid Container */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Yenepoya Helpline */}
        <div className="bg-gradient-to-r from-[#20B2AA]/5 to-[#20B2AA]/10 rounded-2xl p-6 border border-[#20B2AA]/30 flex flex-col md:flex-row items-start gap-4">
          <div className="w-12 h-12 bg-[#20B2AA] rounded-full flex items-center justify-center flex-shrink-0">
            <Phone className="text-white" size={24} />
          </div>
          <div className="flex-1">
            <h3 className="text-[#1C3B5E] text-lg font-semibold mb-2">
              Yenepoya Helpline
            </h3>
            <p className="text-[#333333] text-sm mb-4">
              Speak directly with our trained counselors for personalized
              support and guidance on your quit journey.
            </p>
            <Button
              onClick={() => handleCall("+911234567890")}
              className="w-full md:w-auto rounded-2xl bg-[#20B2AA] hover:bg-[#20B2AA]/90 text-white px-6 py-5"
            >
              <Phone className="mr-2 h-4 w-4" /> Call Now: +91 12345 67890
            </Button>
          </div>
        </div>

        {/* National Helpline */}
        <div className="bg-gradient-to-r from-[#1C3B5E]/5 to-[#1C3B5E]/10 rounded-2xl p-6 border border-[#1C3B5E]/30 flex flex-col md:flex-row items-start gap-4">
          <div className="w-12 h-12 bg-[#1C3B5E] rounded-full flex items-center justify-center flex-shrink-0">
            <MessageSquare className="text-white" size={24} />
          </div>
          <div className="flex-1">
            <h3 className="text-[#1C3B5E] text-lg font-semibold mb-2">
              National Tobacco Cessation Helpline
            </h3>
            <p className="text-[#333333] text-sm mb-4">
              Available 24/7 for confidential support and advice from national
              tobacco cessation experts.
            </p>
            <Button
              onClick={() => handleCall("1800-11-2356")}
              variant="outline"
              className="w-full md:w-auto rounded-2xl border-[#1C3B5E] text-[#1C3B5E] hover:bg-[#1C3B5E]/10 px-6 py-5"
            >
              <Phone className="mr-2 h-4 w-4" /> Call Now: 1800-11-2356
            </Button>
          </div>
        </div>
      </div>
    </Card>
  );
}
