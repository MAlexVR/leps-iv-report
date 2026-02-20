"use client";

import { useEffect } from "react";
import { useReportStore } from "@/stores/useReportStore";
import { Zap } from "lucide-react";

export default function Step6Results() {
  const {
    daqResults,
    measurementResults,
    setMeasurementResults,
    nominalValues,
    setNominalValues,
    incertidumbreMedicion,
    setIncertidumbreMedicion,
  } = useReportStore();

  // Auto-fill from DAQ graphic analysis
  useEffect(() => {
    if (daqResults && measurementResults.isc.value === 0) {
      const g = daqResults.graphicResults;
      const a = daqResults.averageResults;
      setMeasurementResults({
        isc: { value: parseFloat(g.Isc.toFixed(2)), uncertainty: 0.15 },
        voc: { value: parseFloat(g.Voc.toFixed(2)), uncertainty: 0.25 },
        impp: { value: parseFloat(g.Ipm.toFixed(2)), uncertainty: 0.2 },
        vmpp: { value: parseFloat(g.Vpm.toFixed(2)), uncertainty: 0.35 },
        pmpp: { value: parseFloat(g.Pmax.toFixed(2)), uncertainty: 4.91 },
        ff: { value: parseFloat((g.FF * 100).toFixed(2)), uncertainty: 0.88 },
        efficiency: {
          value: parseFloat((a.ModEff * 100).toFixed(2)),
          uncertainty: 0.32,
        },
      });
    }
  }, [daqResults, measurementResults.isc.value, setMeasurementResults]);

  const deviation = (measured: number, nominal: number) => {
    if (nominal === 0) return "—";
    const pct = (((measured - nominal) / nominal) * 100).toFixed(1);
    return `${parseFloat(pct) > 0 ? "+" : ""}${pct} %`;
  };

  const rows = [
    {
      label: "Corriente de corto circuito",
      sym: "Isc / A",
      key: "isc" as const,
      nomKey: "isc" as const,
    },
    {
      label: "Voltaje de circuito abierto",
      sym: "Voc / V",
      key: "voc" as const,
      nomKey: "voc" as const,
    },
    {
      label: "Corriente a la potencia máxima",
      sym: "Impp / A",
      key: "impp" as const,
      nomKey: "impp" as const,
    },
    {
      label: "Voltaje a la potencia máxima",
      sym: "Vmpp / V",
      key: "vmpp" as const,
      nomKey: "vmpp" as const,
    },
    {
      label: "Potencia máxima *",
      sym: "Pmpp / W",
      key: "pmpp" as const,
      nomKey: "pmpp" as const,
    },
    {
      label: "Factor de llenado *",
      sym: "FF / %",
      key: "ff" as const,
      nomKey: "ff" as const,
    },
    {
      label: "Eficiencia *",
      sym: "η / %",
      key: "efficiency" as const,
      nomKey: "efficiency" as const,
    },
  ];

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-xl border border-gray-200 p-5 space-y-4">
        <h3 className="text-sm font-semibold text-gray-700 border-b border-gray-100 pb-2">
          Incertidumbre en la medición
        </h3>
        <p className="text-xs text-gray-500 mb-2">
          Edite el texto de la incertidumbre en la medición que se visualizará
          en el informe generado.
        </p>
        <textarea
          value={incertidumbreMedicion}
          onChange={(e) => setIncertidumbreMedicion(e.target.value)}
          className="w-full min-h-[150px] px-3 py-2 text-sm text-gray-700 border border-gray-200 rounded-lg focus:ring-2 focus:ring-sena-green outline-none resize-y leading-relaxed"
          placeholder="Descripción de la incertidumbre..."
        />
      </div>

      {daqResults && (
        <div className="bg-blue-50 rounded-xl p-4 flex items-start gap-3 text-sm text-blue-700">
          <Zap size={16} className="mt-0.5 flex-shrink-0" />
          <p>
            Los valores medidos se han pre-llenado desde el análisis gráfico de
            la curva promedio. Ajuste los valores de incertidumbre según
            corresponda.
          </p>
        </div>
      )}

      {/* Measurement Results Table */}
      <div className="bg-white rounded-xl border border-gray-200 p-5 overflow-x-auto">
        <h3 className="text-sm font-semibold text-gray-700 border-b border-gray-100 pb-2 mb-4">
          Resultados con Incertidumbre
        </h3>
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-gray-50">
              <th className="px-3 py-2 text-left font-medium text-gray-600">
                Mesurando
              </th>
              <th className="px-3 py-2 font-medium text-gray-600">Símbolo</th>
              <th className="px-3 py-2 font-medium text-gray-600">
                Valor medido
              </th>
              <th className="px-3 py-2 font-medium text-gray-600">
                ± Incertidumbre
              </th>
            </tr>
          </thead>
          <tbody>
            {rows.map(({ label, sym, key }) => (
              <tr key={key} className="border-t border-gray-100">
                <td className="px-3 py-2 text-gray-700">{label}</td>
                <td className="px-3 py-2 text-center text-gray-500 font-mono text-xs">
                  {sym}
                </td>
                <td className="px-3 py-2 text-center">
                  <input
                    type="number"
                    step="0.01"
                    value={measurementResults[key].value || ""}
                    onChange={(e) =>
                      setMeasurementResults({
                        [key]: {
                          ...measurementResults[key],
                          value: parseFloat(e.target.value) || 0,
                        },
                      })
                    }
                    className="w-24 px-2 py-1 text-center text-sm border border-gray-200 rounded focus:ring-2 focus:ring-sena-green outline-none"
                  />
                </td>
                <td className="px-3 py-2 text-center">
                  <input
                    type="number"
                    step="0.01"
                    value={measurementResults[key].uncertainty || ""}
                    onChange={(e) =>
                      setMeasurementResults({
                        [key]: {
                          ...measurementResults[key],
                          uncertainty: parseFloat(e.target.value) || 0,
                        },
                      })
                    }
                    className="w-20 px-2 py-1 text-center text-sm border border-gray-200 rounded focus:ring-2 focus:ring-sena-green outline-none"
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <p className="text-xs text-gray-400 mt-2">* Valor derivado</p>
      </div>

      {/* Nominal Values and Comparison */}
      <div className="bg-white rounded-xl border border-gray-200 p-5 overflow-x-auto">
        <h3 className="text-sm font-semibold text-gray-700 border-b border-gray-100 pb-2 mb-4">
          Información Adicional — Comparación con Valores Nominales
        </h3>
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-gray-50">
              <th className="px-3 py-2 text-left font-medium text-gray-600"></th>
              {rows.map((r) => (
                <th
                  key={r.key}
                  className="px-2 py-2 font-medium text-gray-600 text-center text-xs"
                >
                  {r.sym}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            <tr className="border-t border-gray-100">
              <td className="px-3 py-2 font-medium text-gray-700 text-xs">
                Valores nominales
              </td>
              {rows.map((r) => (
                <td key={r.key} className="px-2 py-2 text-center">
                  <input
                    type="number"
                    step="0.01"
                    value={nominalValues[r.nomKey] || ""}
                    onChange={(e) =>
                      setNominalValues({
                        [r.nomKey]: parseFloat(e.target.value) || 0,
                      })
                    }
                    className="w-20 px-1 py-1 text-center text-xs border border-gray-200 rounded focus:ring-2 focus:ring-sena-green outline-none"
                  />
                </td>
              ))}
            </tr>
            <tr className="border-t border-gray-100 bg-gray-50">
              <td className="px-3 py-2 font-medium text-gray-700 text-xs">
                Resultado medición
              </td>
              {rows.map((r) => (
                <td
                  key={r.key}
                  className="px-2 py-2 text-center text-xs font-mono"
                >
                  {measurementResults[r.key].value || "—"}
                </td>
              ))}
            </tr>
            <tr className="border-t border-gray-200 bg-amber-50">
              <td className="px-3 py-2 font-medium text-amber-700 text-xs">
                Desviación
              </td>
              {rows.map((r) => {
                const dev = deviation(
                  measurementResults[r.key].value,
                  nominalValues[r.nomKey],
                );
                const isNeg = dev.startsWith("-");
                return (
                  <td
                    key={r.key}
                    className={`px-2 py-2 text-center text-xs font-medium ${isNeg ? "text-red-600" : dev === "—" ? "text-gray-400" : "text-sena-green"}`}
                  >
                    {dev}
                  </td>
                );
              })}
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}
