"use client";

import { useState } from "react";
import { useReportStore } from "@/stores/useReportStore";

// Atomic Design Components
import { Header } from "@/components/organisms/Header";
import { Footer } from "@/components/organisms/Footer";
import { HelpModal } from "@/components/organisms/HelpModal";
import { AboutModal } from "@/components/organisms/AboutModal";
import { StepIndicator } from "@/components/molecules/StepIndicator";
import { NavigationButtons } from "@/components/molecules/NavigationButtons";

// Templates - Steps
import Step1ModuleClient from "@/components/templates/Step1ModuleClient";
import Step2TestItem from "@/components/templates/Step2TestItem";
import Step3Procedure from "@/components/templates/Step3Procedure";
import Step4Conditions from "@/components/templates/Step4Conditions";
import Step5DataUpload from "@/components/templates/Step5DataUpload";
import Step6Results from "@/components/templates/Step6Results";
import Step7Equipment from "@/components/templates/Step7Equipment";
import Step8Preview from "@/components/templates/Step8Preview";

import {
  FileText,
  Upload,
  Building2,
  Thermometer,
  BarChart3,
  Wrench,
  Camera,
  BookOpen,
} from "lucide-react";

const STEPS = [
  {
    label: "Módulo y Cliente",
    icon: Building2,
    description:
      "Información detallada sobre el módulo fotovoltaico y el cliente solicitante.",
  },
  {
    label: "Ítem de Ensayo",
    icon: Camera,
    description:
      "Descripción visual del estado del módulo fotovoltaico mediante fotografías y observaciones.",
  },
  {
    label: "Procedimiento",
    icon: BookOpen,
    description:
      "Descripción textual y editable del procedimiento de ensayo realizado en el laboratorio.",
  },
  {
    label: "Condiciones",
    icon: Thermometer,
    description:
      "Condiciones ambientales del laboratorio y condiciones de medición del simulador.",
  },
  {
    label: "Datos DAQ",
    icon: Upload,
    description:
      "Carga y procesamiento automático de los archivos de salida del simulador GSOLA (*.daq y *.csv).",
  },
  {
    label: "Resultados",
    icon: BarChart3,
    description:
      "Resultados paramétricos de las mediciones, desviación frente a nominales y declaración de incertidumbre.",
  },
  {
    label: "Equipos y Regulas",
    icon: Wrench,
    description:
      "Detalle del equipo de medición empleado y las referencias normativas (IEC) seguidas.",
  },
  {
    label: "Vista Previa",
    icon: FileText,
    description:
      "Generación del informe final en formato PDF basado en IEC 60904-1.",
  },
];

export default function Home() {
  const { currentStep } = useReportStore();
  const [showHelp, setShowHelp] = useState(false);
  const [showAbout, setShowAbout] = useState(false);

  // Determinar el componente renderizado según el paso actual
  const StepComponent = [
    Step1ModuleClient,
    Step2TestItem,
    Step3Procedure,
    Step4Conditions,
    Step5DataUpload,
    Step6Results,
    Step7Equipment,
    Step8Preview,
  ][currentStep];

  return (
    <div className="min-h-screen flex flex-col bg-gray-50/50 font-sans text-gray-900 selection:bg-sena-green/20">
      {/* 1. Header (Organism) */}
      <Header
        onShowHelp={() => setShowHelp(true)}
        onShowAbout={() => setShowAbout(true)}
      />

      {/* 3. Main Content Container */}
      <main className="flex-1 w-full animate-in fade-in duration-500">
        {/* Descripción de la aplicación y etapas */}
        <div className="bg-white border-b border-gray-200 py-6 px-4 md:px-8 shadow-sm">
          <div className="max-w-7xl mx-auto">
            <h2 className="text-xl md:text-2xl font-bold text-sena-green mb-4">
              Ensayo estacionario de trazado curva I‐V y determinación de punto
              máximo de potencia (MPP)
            </h2>
            <p className="text-gray-700 text-sm md:text-base mb-6 italic border-l-4 border-sena-green pl-4 py-2 bg-gray-50 rounded-r-lg">
              Esta aplicación facilita la captura, análisis y generación
              estructurada del informe del Ensayo estacionario de trazado curva
              I‐V y determinación de punto máximo de potencia (MPP), procesando
              automáticamente los datos de adquisición (DAQ) del simulador de
              sol GSola asegurando el cumplimiento con los estándares
              normativos.
            </p>
          </div>
        </div>

        {/* 2. Step Indicator (Molecule) */}
        <div className="mb-4">
          <StepIndicator steps={STEPS} />
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 md:py-8 w-full">
          {/* Stage Description (Under Step Indicator) */}
          <div className="mb-6 flex flex-col items-center justify-center text-center">
            <div className="inline-block bg-sena-green/10 text-sena-green px-4 py-1.5 rounded-full text-sm font-semibold mb-2">
              Paso {currentStep + 1}: {STEPS[currentStep].label}
            </div>
            <p className="text-gray-500 text-sm max-w-2xl">
              {STEPS[currentStep].description}
            </p>
          </div>

          <StepComponent />
        </div>
      </main>

      {/* 4. Navigation Buttons (Molecule) */}
      <NavigationButtons maxSteps={STEPS.length} />

      {/* 5. Footer (Organism) */}
      <Footer />

      {/* Modals (Organisms) */}
      <HelpModal isOpen={showHelp} onClose={() => setShowHelp(false)} />
      <AboutModal isOpen={showAbout} onClose={() => setShowAbout(false)} />
    </div>
  );
}
