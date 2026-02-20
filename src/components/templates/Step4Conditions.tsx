"use client";

import { useReportStore } from "@/stores/useReportStore";

function Field({
  label,
  value,
  onChange,
  placeholder,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
}) {
  return (
    <div>
      <label className="block text-xs font-medium text-gray-600 mb-1">
        {label}
      </label>
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:ring-2 focus:ring-sena-green outline-none transition-all"
      />
    </div>
  );
}

export default function Step4Conditions() {
  const {
    ambientConditions,
    setAmbientConditions,
    measurementConditions,
    setMeasurementConditions,
  } = useReportStore();

  return (
    <div className="space-y-6">
      {/* Ambient Conditions */}
      <div className="bg-white rounded-xl border border-gray-200 p-5 space-y-4">
        <h3 className="text-sm font-semibold text-gray-700 border-b border-gray-100 pb-2">
          Condiciones Ambientales (Laboratorio)
        </h3>
        <div className="grid md:grid-cols-2 gap-4">
          <Field
            label="Temperatura"
            value={ambientConditions.temperatura}
            onChange={(v) => setAmbientConditions({ temperatura: v })}
            placeholder="(25 ± 3) °C"
          />
          <Field
            label="Humedad Relativa"
            value={ambientConditions.humedadRelativa}
            onChange={(v) => setAmbientConditions({ humedadRelativa: v })}
            placeholder="(50 ± 30) %"
          />
        </div>
      </div>

      {/* Measurement Conditions */}
      <div className="bg-white rounded-xl border border-gray-200 p-5 space-y-4">
        <h3 className="text-sm font-semibold text-gray-700 border-b border-gray-100 pb-2">
          Condiciones de Medición (Simulador)
        </h3>

        <div className="grid md:grid-cols-2 gap-x-6 gap-y-4">
          <Field
            label="Irradiancia total"
            value={measurementConditions.irradianciaTotal}
            onChange={(v) => setMeasurementConditions({ irradianciaTotal: v })}
            placeholder="1000 W/m² (STC)"
          />
          <Field
            label="Temperatura del módulo"
            value={measurementConditions.temperaturaModulo}
            onChange={(v) => setMeasurementConditions({ temperaturaModulo: v })}
            placeholder="25 °C"
          />

          <div className="md:col-span-2 space-y-4 mt-2 border-t border-gray-50 pt-4">
            <Field
              label="Sistema de medición"
              value={measurementConditions.sistemaMedicion}
              onChange={(v) => setMeasurementConditions({ sistemaMedicion: v })}
              placeholder="Simulador Solar GSOLA"
            />
            <Field
              label="Corrección del desajuste espectral"
              value={measurementConditions.correccionDesajuste}
              onChange={(v) =>
                setMeasurementConditions({ correccionDesajuste: v })
              }
              placeholder="El valor de MM se ha fijado en 1."
            />

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <Field
                label="Hysteresis"
                value={measurementConditions.hysteresis}
                onChange={(v) => setMeasurementConditions({ hysteresis: v })}
                placeholder="0.30 ± 0.05 %"
              />
              <Field
                label="Número de secciones"
                value={measurementConditions.numeroSecciones}
                onChange={(v) =>
                  setMeasurementConditions({ numeroSecciones: v })
                }
                placeholder="10"
              />
              <Field
                label="Duración medicion"
                value={measurementConditions.duracionMedicion}
                onChange={(v) =>
                  setMeasurementConditions({ duracionMedicion: v })
                }
                placeholder="30 ms"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">
                Comentarios
              </label>
              <textarea
                value={measurementConditions.comentarios}
                onChange={(e) =>
                  setMeasurementConditions({ comentarios: e.target.value })
                }
                className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:ring-2 focus:ring-sena-green outline-none h-20 resize-none transition-all"
                placeholder="Comentarios adicionales sobre las condiciones de medición..."
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
