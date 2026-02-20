"use client";

import { useReportStore } from "@/stores/useReportStore";

export default function Step3Procedure() {
  const { procedimientoEnsayo, setProcedimientoEnsayo } = useReportStore();

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-xl border border-gray-200 p-5 space-y-4">
        <h3 className="text-sm font-semibold text-gray-700 border-b border-gray-100 pb-2">
          Descripción del Procedimiento de Ensayo
        </h3>
        <p className="text-xs text-gray-500 mb-2">
          El siguiente texto describe el procedimiento de ensayo y será impreso
          en el informe final. Puede modificarlo según sea necesario para
          ajustes específicos de la medición actual.
        </p>
        <textarea
          value={procedimientoEnsayo}
          onChange={(e) => setProcedimientoEnsayo(e.target.value)}
          className="w-full min-h-[400px] px-4 py-3 text-sm text-gray-700 border border-gray-200 rounded-lg focus:ring-2 focus:ring-sena-green outline-none transition-all resize-y leading-relaxed"
          placeholder="Ingrese el procedimiento de ensayo..."
        />
      </div>
    </div>
  );
}
