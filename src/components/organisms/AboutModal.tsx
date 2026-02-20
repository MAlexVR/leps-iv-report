"use client";

import Modal from "@/components/atoms/Modal";
import { Info } from "lucide-react";

interface AboutModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function AboutModal({ isOpen, onClose }: AboutModalProps) {
  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Acerca de"
      description="Información del sistema"
      icon={Info}
      iconColor="text-sena-green"
      maxWidth="max-w-md"
    >
      <div className="text-center space-y-4">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="/logo-leps.png" alt="LEPS" className="h-20 mx-auto" />

        <div>
          <h3 className="text-base font-bold text-gray-800 tracking-tight">
            LEPS Analizador de Curvas I-V
          </h3>
          <p className="text-xs text-gray-400 font-medium mt-0.5">
            Versión 1.0.0
          </p>
        </div>

        <div className="text-sm text-gray-600 space-y-2 text-left bg-gray-50/80 rounded-xl p-5 border border-gray-100 shadow-inner">
          <p className="flex justify-between items-center border-b border-gray-200/60 pb-1.5">
            <span className="font-semibold text-gray-800">Laboratorio</span>
            <span className="text-gray-600 text-right text-xs">LEPS</span>
          </p>
          <p className="flex justify-between items-center border-b border-gray-200/60 pb-1.5">
            <span className="font-semibold text-gray-800">Institución</span>
            <span className="text-gray-600 text-right text-xs">SENA</span>
          </p>
          <p className="flex justify-between items-center border-b border-gray-200/60 pb-1.5">
            <span className="font-semibold text-gray-800">Centro</span>
            <span
              className="text-gray-600 text-right text-xs max-w-[150px] truncate"
              title="Centro de Electricidad, Electrónica y Telecomunicaciones"
            >
              CEET
            </span>
          </p>
          <p className="flex justify-between items-center border-b border-gray-200/60 pb-1.5">
            <span className="font-semibold text-gray-800">Regional</span>
            <span className="text-gray-600 text-right text-xs">
              Distrito Capital
            </span>
          </p>
          <p className="flex justify-between items-center pb-0.5 pt-1">
            <span className="font-semibold text-gray-800">Norma</span>
            <span className="text-gray-600 font-mono bg-white px-1.5 py-0.5 rounded text-[10px] border border-gray-200">
              IEC 60904-1 Ed.3
            </span>
          </p>
        </div>

        <p className="text-[11px] text-gray-500 leading-relaxed bg-white/50 px-2 py-3 rounded-xl border border-gray-50">
          Aplicación web para el análisis de archivos DAQ del simulador de sol
          GSOLA, procesamiento de curvas I-V, determinación del punto máximo de
          potencia (MPP) y generación de informes de ensayos estacionarios
          conforme a la norma IEC 60904-1.
        </p>

        <div className="bg-sena-green/5 rounded-xl p-3 border border-sena-green/10 mt-2 text-left">
          <p className="text-xs font-semibold text-sena-green mb-1">Autor:</p>
          <p className="text-[11px] text-gray-600 leading-tight">
            Ing. Mauricio Alexander Vargas Rodríguez, MSc., MBA Esp. PM. <br />
            Instructor G14 del área de telecomunicaciones
          </p>
        </div>

        {/* Institutional logos (Only SENA and LEPS, or just SENA since LEPS is at top) */}
        <div className="flex justify-center items-center gap-5 pt-3 pb-2">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/logo-sena.png"
            alt="SENA"
            className="h-10 opacity-75 grayscale hover:grayscale-0 transition-all duration-300"
          />
        </div>

        <p className="text-[10px] text-gray-400 font-medium pt-2 border-t border-gray-100">
          © {new Date().getFullYear()} SENA — Servicio Nacional de Aprendizaje.
          <br /> Todos los derechos reservados.
        </p>
      </div>
    </Modal>
  );
}
