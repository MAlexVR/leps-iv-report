"use client";

import { useReportStore } from "@/stores/useReportStore";
import { Upload, X } from "lucide-react";
import { useRef } from "react";
import { TestItemPhotos } from "@/types/report";

function PhotoBox({
  label,
  photoKey,
  photoData,
  onChange,
}: {
  label: string;
  photoKey: keyof TestItemPhotos;
  photoData: string | null;
  onChange: (updates: Partial<TestItemPhotos>) => void;
}) {
  const fileRef = useRef<HTMLInputElement>(null);

  const handleImage = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => onChange({ [photoKey]: reader.result as string });
    reader.readAsDataURL(file);
  };

  return (
    <div className="border border-gray-200 rounded-lg p-3 flex flex-col items-center justify-center bg-gray-50 min-h-[160px] relative transition-colors hover:border-sena-green/30">
      <h4 className="text-xs font-semibold text-gray-600 w-full text-center mb-2 z-10 bg-white/80 py-1 rounded shadow-sm">
        {label}
      </h4>
      {photoData ? (
        <div className="relative w-full h-full flex items-center justify-center mt-1">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={photoData}
            alt={label}
            className="max-h-32 w-auto object-contain rounded"
          />
          <button
            onClick={() => onChange({ [photoKey]: null })}
            className="absolute -top-1 -right-1 p-1 bg-red-100 rounded-full text-red-600 hover:bg-red-200 shadow-sm transition-colors"
          >
            <X size={14} />
          </button>
        </div>
      ) : (
        <button
          onClick={() => fileRef.current?.click()}
          className="flex flex-col items-center justify-center gap-2 text-gray-400 hover:text-sena-green transition-colors mt-2"
        >
          <Upload size={24} />
          <span className="text-[10px] text-center px-2">Cargar imagen</span>
        </button>
      )}
      <input
        ref={fileRef}
        type="file"
        accept="image/*"
        onChange={handleImage}
        className="hidden"
      />
    </div>
  );
}

export default function Step2TestItem() {
  const { moduleInfo, setModuleInfo, testItemPhotos, setTestItemPhotos } =
    useReportStore();

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-xl border border-gray-200 p-5 space-y-5">
        <h3 className="text-sm font-semibold text-gray-700 border-b border-gray-100 pb-2">
          Fotografías del Ítem de Ensayo
        </h3>

        <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
          <PhotoBox
            photoKey="frontal"
            label="Vista Frontal"
            photoData={testItemPhotos.frontal}
            onChange={setTestItemPhotos}
          />
          <PhotoBox
            photoKey="trasera"
            label="Vista Trasera"
            photoData={testItemPhotos.trasera}
            onChange={setTestItemPhotos}
          />
          <PhotoBox
            photoKey="cajaConexiones"
            label="Caja de Conexiones"
            photoData={testItemPhotos.cajaConexiones}
            onChange={setTestItemPhotos}
          />
          <PhotoBox
            photoKey="cablesConectores"
            label="Cables y Conectores"
            photoData={testItemPhotos.cablesConectores}
            onChange={setTestItemPhotos}
          />
          <PhotoBox
            photoKey="etiqueta"
            label="Etiqueta"
            photoData={testItemPhotos.etiqueta}
            onChange={setTestItemPhotos}
          />
        </div>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 p-5 space-y-4">
        <h3 className="text-sm font-semibold text-gray-700 border-b border-gray-100 pb-2">
          Observaciones
        </h3>
        <div>
          <textarea
            value={moduleInfo.observaciones}
            onChange={(e) => setModuleInfo({ observaciones: e.target.value })}
            placeholder="Ingrese observaciones sobre el estado visual del módulo fotovoltaico (células, marcos, conexiones, defectos, etc.)."
            className="w-full h-32 px-3 py-2 text-sm border border-gray-200 rounded-lg focus:ring-2 focus:ring-sena-green outline-none resize-none transition-all"
          />
        </div>
      </div>
    </div>
  );
}
