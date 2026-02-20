"use client";

import Modal from "@/components/atoms/Modal";
import { HelpCircle } from "lucide-react";

interface HelpModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function HelpModal({ isOpen, onClose }: HelpModalProps) {
  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Guía de Referencia"
      description="Ensayo estacionario de trazado curva I‐V y determinación de punto máximo de potencia (MPP)"
      icon={HelpCircle}
      iconColor="text-sky-500"
    >
      <div className="space-y-5 text-sm text-gray-600">
        {[
          {
            step: 1,
            title: "Módulo y Cliente",
            desc: "Complete la identificación del módulo fotovoltaico bajo prueba (fabricante, referencia, serial, material de celdas, área) y los datos del cliente solicitante.",
            color: "bg-sena-green",
          },
          {
            step: 2,
            title: "Ítem de Ensayo",
            desc: "Suba cinco (5) fotografías descriptivas del panel y anote las observaciones sobre el estado visual del módulo fotovoltaico.",
            color: "bg-sena-green",
          },
          {
            step: 3,
            title: "Procedimiento",
            desc: "Fije el procedimiento textual a seguir durante el ensayo (editable según se requiera reportar).",
            color: "bg-sena-green",
          },
          {
            step: 4,
            title: "Condiciones",
            desc: "Registre las condiciones ambientales del laboratorio y condiciones de medición del simulador.",
            color: "bg-sena-green",
          },
          {
            step: 5,
            title: "Datos DAQ",
            desc: "Cargue los archivos de salida del simulador GSOLA (*.daq y *.csv) para procesar las curvas de corriente-tensión e identificar repeticiones válidas.",
            color: "bg-sena-green",
          },
          {
            step: 6,
            title: "Resultados",
            desc: "Revise los resultados de la medición (Isc, Voc, Pmpp, FF, Eficiencia) contra sus valores nominales. Ajuste la descripción de la incertidumbre.",
            color: "bg-sena-green",
          },
          {
            step: 7,
            title: "Equipos y Referencias Normativas",
            desc: "Administre los equipos analíticos empleados y gestione la tabla dinámica de referencias normativas (IEC, etc.) seguidas.",
            color: "bg-sena-green",
          },
          {
            step: 8,
            title: "Vista Previa y Generación",
            desc: "Revise la lista de verificación (checklist) y proceda a generar y descargar el informe final en formato PDF.",
            color: "bg-sena-green",
          },
        ].map((item) => (
          <div key={item.step} className="flex gap-3">
            <div
              className={`shrink-0 w-7 h-7 rounded-lg ${item.color} text-white text-xs font-bold flex items-center justify-center mt-0.5`}
            >
              {item.step}
            </div>
            <div>
              <h3 className="font-semibold text-gray-800 mb-0.5">
                {item.title}
              </h3>
              <p className="leading-relaxed">{item.desc}</p>
            </div>
          </div>
        ))}

        {/* Archivos requeridos */}
        <div className="border-t border-gray-100 pt-4">
          <h3 className="font-semibold text-gray-800 mb-2">
            Archivos requeridos
          </h3>
          <div className="bg-gray-50 rounded-xl p-3 space-y-2 text-xs border border-gray-100 shadow-inner">
            <div className="flex items-start gap-2">
              <code className="bg-green-100 text-green-800 px-1.5 py-0.5 rounded font-mono shrink-0">
                None Name.csv
              </code>
              <span>
                SunData — archivo CSV con parámetros eléctricos por medición
                (UTF-16-LE)
              </span>
            </div>
            <div className="flex items-start gap-2">
              <code className="bg-blue-100 text-blue-700 px-1.5 py-0.5 rounded font-mono shrink-0">
                *-cali.daq
              </code>
              <span>
                Archivos DAQ calibrados — puntos V,I de cada curva I-V
              </span>
            </div>
            <div className="flex items-start gap-2">
              <code className="bg-gray-200 text-gray-600 px-1.5 py-0.5 rounded font-mono shrink-0">
                *.jpg
              </code>
              <span>
                Capturas de pantalla del equipo de medición (opcional)
              </span>
            </div>
          </div>
        </div>
      </div>
    </Modal>
  );
}
