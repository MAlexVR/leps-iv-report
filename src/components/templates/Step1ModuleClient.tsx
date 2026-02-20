"use client";

import { useReportStore } from "@/stores/useReportStore";
import { useRef } from "react";
import { SignatureInfo } from "@/types/report";
import { Upload, X } from "lucide-react";

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
        className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:ring-2 focus:ring-sena-green focus:border-sena-green outline-none transition-all"
      />
    </div>
  );
}

function SignatureBlock({
  label,
  info,
  onChange,
}: {
  label: string;
  info: SignatureInfo;
  onChange: (s: Partial<SignatureInfo>) => void;
}) {
  const fileRef = useRef<HTMLInputElement>(null);

  const handleImage = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => onChange({ signatureImage: reader.result as string });
    reader.readAsDataURL(file);
  };

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-4 space-y-3">
      <h4 className="text-xs font-semibold text-gray-700">{label}</h4>
      <p className="text-[10px] text-gray-400">{info.role}</p>
      <input
        type="text"
        value={info.name}
        onChange={(e) => onChange({ name: e.target.value })}
        placeholder="Nombre completo"
        className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:ring-2 focus:ring-sena-green outline-none"
      />
      <div>
        {info.signatureImage ? (
          <div className="relative inline-block border border-gray-200 rounded-lg p-2">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={info.signatureImage}
              alt="Firma"
              className="h-16 w-auto"
            />
            <button
              onClick={() => onChange({ signatureImage: null })}
              className="absolute -top-2 -right-2 p-0.5 bg-red-100 rounded-full text-red-600 hover:bg-red-200"
            >
              <X size={12} />
            </button>
          </div>
        ) : (
          <button
            onClick={() => fileRef.current?.click()}
            className="flex items-center gap-2 px-3 py-2 text-xs border border-dashed border-gray-300 rounded-lg text-gray-500 hover:border-sena-green/40 hover:text-sena-green transition-colors"
          >
            <Upload size={14} /> Cargar imagen de firma
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
    </div>
  );
}

export default function Step1ModuleClient() {
  const {
    moduleInfo,
    setModuleInfo,
    clientInfo,
    setClientInfo,
    reportCode,
    setReportCode,
    reportVersion,
    setReportVersion,
    reportDate,
    setReportDate,
    vigenciaDate,
    setVigenciaDate,
    performer,
    setPerformer,
    reviewer,
    setReviewer,
    approver,
    setApprover,
  } = useReportStore();

  return (
    <div className="space-y-6">
      <div className="grid md:grid-cols-2 gap-6">
        {/* Module Info */}
        <div className="bg-white rounded-xl border border-gray-200 p-5 space-y-4">
          <h3 className="text-sm font-semibold text-gray-700 border-b border-gray-100 pb-2">
            Ítem de Ensayo
          </h3>
          <Field
            label="Objeto"
            value={moduleInfo.objeto}
            onChange={(v) => setModuleInfo({ objeto: v })}
            placeholder="Módulo fotovoltaico monofacial"
          />
          <Field
            label="Fabricante"
            value={moduleInfo.fabricante}
            onChange={(v) => setModuleInfo({ fabricante: v })}
            placeholder="Jinko Solar"
          />
          <Field
            label="Referencia"
            value={moduleInfo.referencia}
            onChange={(v) => setModuleInfo({ referencia: v })}
            placeholder="JKM460M-60HL4-V"
          />
          <Field
            label="Material de las celdas"
            value={moduleInfo.materialCeldas}
            onChange={(v) => setModuleInfo({ materialCeldas: v })}
            placeholder="mono-Si"
          />
          <Field
            label="Número serial"
            value={moduleInfo.serial}
            onChange={(v) => setModuleInfo({ serial: v })}
            placeholder="65XXE2220317170071060464"
          />
          <Field
            label="Área del módulo"
            value={moduleInfo.areaModulo}
            onChange={(v) => setModuleInfo({ areaModulo: v })}
            placeholder="1903 mm x 1134 mm"
          />
        </div>

        {/* Client Info */}
        <div className="bg-white rounded-xl border border-gray-200 p-5 space-y-4">
          <h3 className="text-sm font-semibold text-gray-700 border-b border-gray-100 pb-2">
            Datos del Cliente
          </h3>
          <Field
            label="Empresa"
            value={clientInfo.company}
            onChange={(v) => setClientInfo({ company: v })}
            placeholder="MBJ Solutions GmbH"
          />
          <Field
            label="Contacto"
            value={clientInfo.contacto}
            onChange={(v) => setClientInfo({ contacto: v })}
            placeholder="Fuß, Michael"
          />
          <Field
            label="Dirección"
            value={clientInfo.direccion}
            onChange={(v) => setClientInfo({ direccion: v })}
            placeholder="Jochim-Klindt-Straße 7"
          />
          <Field
            label="Código Postal / Ciudad"
            value={clientInfo.codigoPostal}
            onChange={(v) => setClientInfo({ codigoPostal: v })}
            placeholder="22926 Ahrensburg"
          />
          <Field
            label="País"
            value={clientInfo.pais}
            onChange={(v) => setClientInfo({ pais: v })}
            placeholder="DEUTSCHLAND"
          />
          <Field
            label="No. de Orden"
            value={clientInfo.noOrden}
            onChange={(v) => setClientInfo({ noOrden: v })}
            placeholder="003MBJS1123"
          />
        </div>
      </div>

      {/* Signatures */}
      <div className="bg-white rounded-xl border border-gray-200 p-5">
        <h3 className="text-sm font-semibold text-gray-700 border-b border-gray-100 pb-2 mb-4">
          Firmas del Informe
        </h3>
        <div className="grid md:grid-cols-3 gap-4">
          <SignatureBlock
            label="Realizó"
            info={performer}
            onChange={setPerformer}
          />
          <SignatureBlock
            label="Revisó"
            info={reviewer}
            onChange={setReviewer}
          />
          <SignatureBlock
            label="Aprobó"
            info={approver}
            onChange={setApprover}
          />
        </div>
      </div>

      {/* Report Metadata */}
      <div className="bg-white rounded-xl border border-gray-200 p-5">
        <h3 className="text-sm font-semibold text-gray-700 border-b border-gray-100 pb-2 mb-4">
          Metadatos del Informe
        </h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Field label="Código" value={reportCode} onChange={setReportCode} />
          <Field
            label="Versión"
            value={reportVersion}
            onChange={setReportVersion}
          />
          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1">
              Fecha del Informe
            </label>
            <input
              type="date"
              value={reportDate}
              onChange={(e) => setReportDate(e.target.value)}
              className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:ring-2 focus:ring-sena-green outline-none"
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1">
              Fecha de Vigencia
            </label>
            <input
              type="date"
              value={vigenciaDate}
              onChange={(e) => setVigenciaDate(e.target.value)}
              className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:ring-2 focus:ring-sena-green outline-none"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
