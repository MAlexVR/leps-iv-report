"use client";

import { useReportStore } from "@/stores/useReportStore";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface NavigationButtonsProps {
  maxSteps: number;
}

export function NavigationButtons({ maxSteps }: NavigationButtonsProps) {
  const { currentStep, nextStep, prevStep } = useReportStore();

  return (
    <div className="bg-white/80 backdrop-blur-md border-t border-gray-100 py-3.5 px-4 sticky bottom-0 z-30 shadow-[0_-4px_6px_-1px_rgb(0,0,0,0.02)]">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <button
          onClick={prevStep}
          disabled={currentStep === 0}
          className="flex items-center gap-2 px-6 py-2.5 rounded-xl text-sm font-semibold bg-gray-50 text-gray-700 hover:bg-gray-100 hover:text-gray-900 border border-gray-200 disabled:opacity-40 disabled:cursor-not-allowed transition-all focus:outline-none focus:ring-2 focus:ring-gray-200"
        >
          <ChevronLeft size={18} className="translate-x-[2px]" />
          <span className="hidden sm:inline">Anterior paso</span>
          <span className="sm:hidden">Atrás</span>
        </button>

        {currentStep < maxSteps - 1 ? (
          <button
            onClick={nextStep}
            className="flex items-center gap-2 px-6 py-2.5 rounded-xl text-sm font-semibold bg-sena-green text-white hover:bg-[#2CA100] shadow-md shadow-sena-green/30 hover:shadow-lg transition-all focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-sena-green/50"
          >
            <span className="hidden sm:inline">Siguiente paso</span>
            <span className="sm:hidden">Sig</span>
            <ChevronRight size={18} className="-translate-x-[2px]" />
          </button>
        ) : (
          <div className="w-24" /> // Placeholder to keep center alignment if necessary
        )}
      </div>
    </div>
  );
}
