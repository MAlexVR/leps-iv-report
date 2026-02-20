"use client";

import { useReportStore } from "@/stores/useReportStore";
import { ElementType } from "react";

interface Step {
  label: string;
  icon: ElementType;
}

interface StepIndicatorProps {
  steps: Step[];
}

export function StepIndicator({ steps }: StepIndicatorProps) {
  const { currentStep } = useReportStore();

  return (
    <div className="sticky top-[60px] md:top-[69px] z-30 bg-white/80 backdrop-blur-xl border-b border-gray-200/50 shadow-sm py-3">
      <div className="max-w-7xl mx-auto px-4">
        {/* Modern Stepper Container */}
        <div className="flex flex-wrap items-center justify-center gap-2 md:gap-3 lg:gap-4">
          {steps.map((step, idx) => {
            const isActive = idx === currentStep;
            const isCompleted = idx < currentStep;
            const Icon = step.icon;

            return (
              <button
                key={idx}
                onClick={() => useReportStore.getState().setStep(idx)}
                title={step.label}
                className={`group flex items-center gap-1.5 px-2 md:px-2.5 py-1 md:py-1.5 rounded-lg text-[10px] md:text-[11px] font-semibold transition-all duration-300 ease-out border ${
                  isActive
                    ? "bg-sena-green border-sena-green text-white shadow-md shadow-sena-green/20 scale-105"
                    : isCompleted
                      ? "bg-white border-sena-green/30 text-sena-green hover:bg-sena-green/5 hover:border-sena-green/50"
                      : "bg-white border-gray-200 text-gray-400 hover:border-gray-300 hover:text-gray-600 hover:bg-gray-50 hover:scale-105"
                }`}
              >
                <div
                  className={`flex items-center justify-center p-1 rounded-md transition-colors duration-300 ${
                    isActive
                      ? "bg-white/20 text-white"
                      : isCompleted
                        ? "bg-sena-green/10 text-sena-green group-hover:bg-sena-green/20"
                        : "bg-gray-50 text-gray-400 group-hover:bg-gray-100 group-hover:text-gray-600"
                  }`}
                >
                  <Icon size={12} strokeWidth={isActive ? 2.5 : 2} />
                </div>
                <span className="hidden sm:inline-block tracking-wide">
                  {idx + 1}. {step.label}
                </span>
                <span className="sm:hidden font-bold">{idx + 1}</span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
