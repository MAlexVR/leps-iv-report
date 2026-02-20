"use client";

import { useReportStore } from "@/stores/useReportStore";
import { Plus, X } from "lucide-react";

export default function Step7Equipment() {
  const {
    equipment,
    addEquipment,
    removeEquipment,
    setEquipment,
    references,
    addReference,
    updateReference,
    removeReference,
  } = useReportStore();

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-xl border border-gray-200 p-5 overflow-x-auto">
        <h3 className="text-sm font-semibold text-gray-700 border-b border-gray-100 pb-2 mb-4">
          Equipo de Medición
        </h3>
        <table className="w-full text-xs">
          <thead>
            <tr className="bg-gray-50 border-b border-gray-200">
              <th className="px-3 py-2 text-left font-medium text-gray-600">
                Descripción
              </th>
              <th className="px-3 py-2 text-left font-medium text-gray-600">
                Modelo / Tipo
              </th>
              <th className="px-3 py-2 text-left font-medium text-gray-600">
                Número Serial
              </th>
              <th className="px-3 py-2 text-left font-medium text-gray-600">
                Trazabilidad / Cert.
              </th>
              <th className="px-3 py-2 text-left font-medium text-gray-600">
                Fecha Cal.
              </th>
              <th className="px-2 py-2 w-8"></th>
            </tr>
          </thead>
          <tbody>
            {equipment.map((eq, idx) => (
              <tr key={idx} className="border-b border-gray-100 last:border-0">
                <td className="px-2 py-2">
                  <input
                    type="text"
                    value={eq.descripcion}
                    onChange={(e) => {
                      const newEq = [...equipment];
                      newEq[idx].descripcion = e.target.value;
                      setEquipment(newEq);
                    }}
                    className="w-full px-2 py-1 border border-gray-200 rounded outline-none focus:border-sena-green text-xs"
                  />
                </td>
                <td className="px-2 py-2">
                  <input
                    type="text"
                    value={eq.modelo}
                    onChange={(e) => {
                      const newEq = [...equipment];
                      newEq[idx].modelo = e.target.value;
                      setEquipment(newEq);
                    }}
                    className="w-full px-2 py-1 border border-gray-200 rounded outline-none focus:border-sena-green text-xs"
                  />
                </td>
                <td className="px-2 py-2">
                  <input
                    type="text"
                    value={eq.serial}
                    onChange={(e) => {
                      const newEq = [...equipment];
                      newEq[idx].serial = e.target.value;
                      setEquipment(newEq);
                    }}
                    className="w-full px-2 py-1 border border-gray-200 rounded outline-none focus:border-sena-green text-xs font-mono"
                  />
                </td>
                <td className="px-2 py-2">
                  <input
                    type="text"
                    value={eq.trazabilidad}
                    onChange={(e) => {
                      const newEq = [...equipment];
                      newEq[idx].trazabilidad = e.target.value;
                      setEquipment(newEq);
                    }}
                    className="w-full px-2 py-1 border border-gray-200 rounded outline-none focus:border-sena-green text-xs"
                  />
                </td>
                <td className="px-2 py-2">
                  <input
                    type="text"
                    value={eq.fechaCalibracion}
                    onChange={(e) => {
                      const newEq = [...equipment];
                      newEq[idx].fechaCalibracion = e.target.value;
                      setEquipment(newEq);
                    }}
                    className="w-24 px-2 py-1 border border-gray-200 rounded outline-none focus:border-sena-green text-xs"
                  />
                </td>
                <td className="px-2 py-2 text-center">
                  <button
                    onClick={() => removeEquipment(idx)}
                    className="p-1 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded transition-colors"
                  >
                    <X size={14} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <div className="mt-3">
          <button
            onClick={() =>
              addEquipment({
                descripcion: "",
                modelo: "",
                serial: "",
                trazabilidad: "",
                fechaCalibracion: "",
              })
            }
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-sena-green bg-sena-green/10 rounded-lg hover:bg-sena-green/20 transition-colors"
          >
            <Plus size={14} /> Añadir Equipo
          </button>
        </div>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 p-5 overflow-x-auto">
        <h3 className="text-sm font-semibold text-gray-700 border-b border-gray-100 pb-2 mb-4">
          Referencias Normativas
        </h3>
        <table className="w-full text-xs">
          <thead>
            <tr className="bg-gray-50 border-b border-gray-200">
              <th className="px-3 py-2 text-left font-medium text-gray-600 w-16">
                ID / Ref
              </th>
              <th className="px-3 py-2 text-left font-medium text-gray-600 w-48">
                Código / Norma
              </th>
              <th className="px-3 py-2 text-left font-medium text-gray-600">
                Título / Descripción
              </th>
              <th className="px-2 py-2 w-8"></th>
            </tr>
          </thead>
          <tbody>
            {references.map((ref, idx) => (
              <tr key={idx} className="border-b border-gray-100 last:border-0">
                <td className="px-2 py-2">
                  <input
                    type="text"
                    value={ref.id}
                    onChange={(e) =>
                      updateReference(idx, { id: e.target.value })
                    }
                    className="w-full px-2 py-1 border border-gray-200 rounded outline-none focus:border-sena-green text-xs text-center font-semibold text-gray-600"
                  />
                </td>
                <td className="px-2 py-2">
                  <input
                    type="text"
                    value={ref.code}
                    onChange={(e) =>
                      updateReference(idx, { code: e.target.value })
                    }
                    className="w-full px-2 py-1 border border-gray-200 rounded outline-none focus:border-sena-green text-xs font-mono"
                  />
                </td>
                <td className="px-2 py-2">
                  <textarea
                    value={ref.title}
                    onChange={(e) =>
                      updateReference(idx, { title: e.target.value })
                    }
                    rows={2}
                    className="w-full px-2 py-1 border border-gray-200 rounded outline-none focus:border-sena-green text-xs resize-y"
                  />
                </td>
                <td className="px-2 py-2 text-center align-top">
                  <button
                    onClick={() => removeReference(idx)}
                    className="p-1 text-gray-400 mt-1 hover:text-red-600 hover:bg-red-50 rounded transition-colors"
                  >
                    <X size={14} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <div className="mt-3">
          <button
            onClick={() =>
              addReference({
                id: `${references.length + 1}`,
                code: "",
                title: "",
              })
            }
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-sena-green bg-sena-green/10 rounded-lg hover:bg-sena-green/20 transition-colors"
          >
            <Plus size={14} /> Añadir Referencia
          </button>
        </div>
      </div>
    </div>
  );
}
