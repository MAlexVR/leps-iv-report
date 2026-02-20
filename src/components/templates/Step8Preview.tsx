"use client";

import { useState } from "react";
import { useReportStore } from "@/stores/useReportStore";
import { generatePDF } from "@/lib/pdf-generator";
import { Download, FileText, Loader2, AlertCircle } from "lucide-react";

export default function Step8Preview() {
  const store = useReportStore();
  const [generating, setGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleGenerate = async () => {
    setGenerating(true);
    setError(null);
    try {
      await generatePDF(store);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Error al generar el PDF");
    } finally {
      setGenerating(false);
    }
  };

  const isDaqMissing = !store.daqResults;
  const isElOk = true; // No EL dependencies anymore

  const ready = !isDaqMissing && isElOk;

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div className="text-center space-y-2 mb-8 mt-4">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-sena-green/10 mb-2">
          <FileText size={32} className="text-sena-green" />
        </div>
        <h2 className="text-2xl font-bold text-gray-800">
          Generación del Informe
        </h2>
        <p className="text-gray-500">
          Revise la disponibilidad de los datos antes de exportar el PDF.
        </p>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 p-6 space-y-4">
        <h3 className="font-semibold text-gray-800 mb-4">
          Estado de la Información
        </h3>

        <div className="space-y-3">
          <div className="flex items-center justify-between p-3 rounded-lg border border-gray-100 bg-gray-50">
            <span className="text-sm font-medium text-gray-700">
              1. Archivos DAQ y SunData
            </span>
            {isDaqMissing ? (
              <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-red-100 text-red-700 border border-red-200">
                Faltante
              </span>
            ) : (
              <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-green-100 text-green-700 border border-green-200">
                Completado
              </span>
            )}
          </div>

          <div className="flex items-center justify-between p-3 rounded-lg border border-gray-100 bg-gray-50">
            <span className="text-sm font-medium text-gray-700">
              2. Módulo y Cliente
            </span>
            {store.moduleInfo.referencia && store.clientInfo.company ? (
              <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-green-100 text-green-700 border border-green-200">
                Completado
              </span>
            ) : (
              <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-amber-100 text-amber-700 border border-amber-200">
                Incompleto
              </span>
            )}
          </div>

          <div className="flex items-center justify-between p-3 rounded-lg border border-gray-100 bg-gray-50">
            <span className="text-sm font-medium text-gray-700">
              3. Registro Fotográfico (5 fotos)
            </span>
            {Object.values(store.testItemPhotos).every((v) => v !== null) ? (
              <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-green-100 text-green-700 border border-green-200">
                Completado
              </span>
            ) : (
              <span className="text-xs font-medium px-2.5 py-1 rounded-full bg-amber-100 text-amber-700 border border-amber-200">
                Recomendado
              </span>
            )}
          </div>

          <div className="flex items-center justify-between p-3 rounded-lg border border-gray-100 bg-gray-50">
            <span className="text-sm font-medium text-gray-700">
              4. Texto de Procedimiento Editable
            </span>
            {store.procedimientoEnsayo.length > 50 ? (
              <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-green-100 text-green-700 border border-green-200">
                Completado
              </span>
            ) : (
              <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-amber-100 text-amber-700 border border-amber-200">
                Vacío
              </span>
            )}
          </div>

          <div className="flex items-center justify-between p-3 rounded-lg border border-gray-100 bg-gray-50">
            <span className="text-sm font-medium text-gray-700">
              5. Comprobante de Firmas
            </span>
            {store.performer.signatureImage &&
            store.reviewer.signatureImage &&
            store.approver.signatureImage ? (
              <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-green-100 text-green-700 border border-green-200">
                Completado
              </span>
            ) : (
              <span className="text-xs font-medium px-2.5 py-1 rounded-full bg-amber-100 text-amber-700 border border-amber-200">
                Incompleto (Opcional)
              </span>
            )}
          </div>
        </div>

        {error && (
          <div className="mt-4 p-4 rounded-lg bg-red-50 text-red-600 text-sm flex items-start gap-2 border border-red-100">
            <AlertCircle size={16} className="mt-0.5 shrink-0" />
            <p>{error}</p>
          </div>
        )}

        <div className="pt-6 mt-6 border-t border-gray-100">
          <button
            onClick={handleGenerate}
            disabled={!ready || generating}
            className="w-full flex items-center justify-center gap-2 py-3.5 rounded-xl text-white font-medium bg-sena-green hover:bg-sena-green-dark transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-sm hover:shadow-md"
          >
            {generating ? (
              <Loader2 size={20} className="animate-spin" />
            ) : (
              <Download size={20} />
            )}
            {generating ? "Generando Documento..." : "Descargar Informe PDF"}
          </button>

          {!ready && (
            <p className="text-center text-xs text-red-500 mt-3">
              Debe completar la carga de datos DAQ (Paso 5) para poder generar
              el informe.
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
