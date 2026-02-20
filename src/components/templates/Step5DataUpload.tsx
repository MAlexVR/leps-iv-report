"use client";

import { useState, useCallback } from "react";
import { useReportStore } from "@/stores/useReportStore";
import { processDAQData } from "@/lib/daq-parser";
import {
  Upload,
  FileText,
  FolderOpen,
  Image,
  CheckCircle2,
  AlertCircle,
  Loader2,
  Calendar,
  Factory,
  Ruler,
  Timer,
  ArrowRightLeft,
  ClipboardList,
} from "lucide-react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  ComposedChart,
  ReferenceDot,
  ReferenceLine,
} from "recharts";

const COLORS = [
  "#2563eb",
  "#dc2626",
  "#16a34a",
  "#d97706",
  "#7c3aed",
  "#db2777",
  "#0891b2",
  "#65a30d",
  "#ea580c",
  "#6366f1",
];

export default function Step5DataUpload() {
  const { daqResults, setDaqResults } = useReportStore();
  const [csvFile, setCsvFile] = useState<File | null>(null);
  const [daqFiles, setDaqFiles] = useState<File[]>([]);
  const [jpgFiles, setJpgFiles] = useState<File[]>([]);
  const [processing, setProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleProcess = useCallback(async () => {
    if (!csvFile) {
      setError("Seleccione el archivo SunData CSV");
      return;
    }
    if (daqFiles.length === 0) {
      setError("Seleccione los archivos DAQ");
      return;
    }

    setProcessing(true);
    setError(null);
    try {
      const results = await processDAQData(csvFile, daqFiles, jpgFiles);
      setDaqResults(results);
    } catch (e) {
      setError(
        e instanceof Error ? e.message : "Error al procesar los archivos",
      );
    } finally {
      setProcessing(false);
    }
  }, [csvFile, daqFiles, jpgFiles, setDaqResults]);

  const handleDaqFiles = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) setDaqFiles(Array.from(e.target.files));
  };

  const handleJpgFiles = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) setJpgFiles(Array.from(e.target.files));
  };

  const caliCount = daqFiles.filter((f) => {
    const n = f.name.toLowerCase();
    return (
      n.endsWith("-cali.daq") &&
      !n.includes("-irr-cali") &&
      !n.includes("-irr.")
    );
  }).length;

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-bold text-gray-800">Carga de Datos DAQ</h2>
        <p className="text-sm text-gray-500 mt-1">
          Seleccione los archivos de entrada generados por el sistema de
          adquisición de datos del simulador de sol GSOLA.
        </p>
      </div>

      {/* ── File Inputs ── */}
      <div className="grid gap-4 md:grid-cols-3">
        {/* CSV */}
        <div className="bg-white rounded-xl border border-gray-200 p-4 hover:border-sena-green/30 transition-colors">
          <div className="flex items-center gap-2 mb-3">
            <div className="p-2 rounded-lg bg-blue-50">
              <FileText size={18} className="text-blue-600" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-700">SunData CSV</p>
              <p className="text-xs text-gray-400">None Name.csv</p>
            </div>
          </div>
          <input
            type="file"
            accept=".csv"
            onChange={(e) =>
              e.target.files?.[0] && setCsvFile(e.target.files[0])
            }
            className="w-full text-xs"
          />
          {csvFile && (
            <p className="mt-2 text-xs text-sena-green flex items-center gap-1">
              <CheckCircle2 size={12} /> {csvFile.name}
            </p>
          )}
        </div>

        {/* DAQ */}
        <div className="bg-white rounded-xl border border-gray-200 p-4 hover:border-sena-green/30 transition-colors">
          <div className="flex items-center gap-2 mb-3">
            <div className="p-2 rounded-lg bg-amber-50">
              <FolderOpen size={18} className="text-amber-600" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-700">Archivos DAQ</p>
              <p className="text-xs text-gray-400">
                Carpeta con archivos *.daq
              </p>
            </div>
          </div>
          {/* @ts-ignore */}
          <input
            type="file"
            multiple
            {...{ webkitdirectory: "" }}
            onChange={handleDaqFiles}
            className="w-full text-xs"
          />
          {daqFiles.length > 0 && (
            <p className="mt-2 text-xs text-sena-green flex items-center gap-1">
              <CheckCircle2 size={12} /> {daqFiles.length} archivos ({caliCount}{" "}
              curvas I-V calibradas)
            </p>
          )}
        </div>

        {/* JPG */}
        <div className="bg-white rounded-xl border border-gray-200 p-4 hover:border-sena-green/30 transition-colors">
          <div className="flex items-center gap-2 mb-3">
            <div className="p-2 rounded-lg bg-purple-50">
              <Image size={18} className="text-purple-600" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-700">Capturas JPG</p>
              <p className="text-xs text-gray-400">
                Carpeta con capturas del equipo
              </p>
            </div>
          </div>
          {/* @ts-ignore */}
          <input
            type="file"
            multiple
            {...{ webkitdirectory: "" }}
            accept="image/*"
            onChange={handleJpgFiles}
            className="w-full text-xs"
          />
          {jpgFiles.length > 0 && (
            <p className="mt-2 text-xs text-sena-green flex items-center gap-1">
              <CheckCircle2 size={12} />{" "}
              {
                jpgFiles.filter((f) => f.name.toLowerCase().endsWith(".jpg"))
                  .length
              }{" "}
              capturas JPG
            </p>
          )}
        </div>
      </div>

      {/* ── Process Button ── */}
      <div className="flex items-center gap-4">
        <button
          onClick={handleProcess}
          disabled={processing || !csvFile || daqFiles.length === 0}
          className="flex items-center gap-2 px-6 py-2.5 rounded-xl text-sm font-medium bg-sena-green text-white hover:bg-sena-green-dark disabled:opacity-40 disabled:cursor-not-allowed shadow-sm transition-all"
        >
          {processing ? (
            <Loader2 size={16} className="animate-spin" />
          ) : (
            <Upload size={16} />
          )}
          {processing ? "Procesando..." : "Procesar Datos"}
        </button>
        {error && (
          <p className="text-sm text-red-600 flex items-center gap-1">
            <AlertCircle size={14} /> {error}
          </p>
        )}
      </div>

      {/* ══════════════════ RESULTS ══════════════════ */}
      {daqResults && (
        <div className="space-y-6 pt-4 border-t border-gray-200">
          <div className="flex items-center gap-2">
            <CheckCircle2 size={20} className="text-sena-green" />
            <h3 className="text-lg font-semibold text-gray-800">
              Datos Procesados Exitosamente
            </h3>
          </div>

          {/* ── Datos del Ensayo (Python: constant_values) ── */}
          <div className="bg-white rounded-xl border border-gray-200 p-5">
            <h4 className="text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
              <ClipboardList size={16} className="text-indigo-500" />
              Datos del Ensayo
            </h4>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
              <MetadataCard
                icon={Calendar}
                label="Fecha del ensayo"
                value={daqResults.testMetadata.Test_Date}
              />
              <MetadataCard
                icon={Factory}
                label="Fabricante / ID"
                value={daqResults.testMetadata.Manuf}
              />
              <MetadataCard
                icon={Ruler}
                label="Área módulo (mm²)"
                value={parseFloat(daqResults.testMetadata.Area).toFixed(1)}
              />
              <MetadataCard
                icon={Timer}
                label="Tiempo de barrido"
                value={`${daqResults.testMetadata.STime} ms`}
              />
              <MetadataCard
                icon={ArrowRightLeft}
                label="Dirección barrido"
                value={daqResults.testMetadata.SDirection}
              />
            </div>
          </div>

          {/* ── Summary Cards ── */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            <SummaryCard
              label="Mediciones"
              value={String(daqResults.individualCurves.length)}
            />
            <SummaryCard
              label="Puntos por curva"
              value={String(daqResults.averageCurve.length)}
            />
            <SummaryCard
              label="Capturas JPG"
              value={String(daqResults.curveScreenshots.length)}
            />
            <SummaryCard
              label="Filas SunData"
              value={String(daqResults.sunData.length)}
            />
          </div>

          {/* ── Resultados del Análisis Gráfico ── */}
          <div className="bg-white rounded-xl border border-gray-200 p-5">
            <h4 className="text-sm font-semibold text-gray-700 mb-3">
              Resultados del Análisis Gráfico (Curva Promedio)
            </h4>
            <div className="grid grid-cols-3 md:grid-cols-6 gap-3">
              <ResultCard
                label="Voc"
                value={daqResults.graphicResults.Voc.toFixed(6)}
                unit="V"
              />
              <ResultCard
                label="Isc"
                value={daqResults.graphicResults.Isc.toFixed(6)}
                unit="A"
              />
              <ResultCard
                label="Pmax"
                value={daqResults.graphicResults.Pmax.toFixed(6)}
                unit="W"
              />
              <ResultCard
                label="Vpm"
                value={daqResults.graphicResults.Vpm.toFixed(6)}
                unit="V"
              />
              <ResultCard
                label="Ipm"
                value={daqResults.graphicResults.Ipm.toFixed(6)}
                unit="A"
              />
              <ResultCard
                label="FF"
                value={daqResults.graphicResults.FF.toFixed(4)}
                unit=""
              />
            </div>
          </div>

          {/* ── Resultados Promedio SunData ── */}
          <div className="bg-white rounded-xl border border-gray-200 p-5">
            <h4 className="text-sm font-semibold text-gray-700 mb-3">
              Resultados Promedio SunData
            </h4>
            <div className="grid grid-cols-3 md:grid-cols-6 gap-3">
              {Object.entries(daqResults.visibleAverages)
                .filter(([_, val]) => val !== "")
                .map(([col, val]) => (
                  <ResultCard key={col} label={col} value={val} unit="" />
                ))}
            </div>
          </div>

          {/* ── Curvas I-V Individuales (repetibilidad) ── */}
          <div className="bg-white rounded-xl border border-gray-200 p-5">
            <h4 className="text-sm font-semibold text-gray-700 mb-3">
              Curvas I-V Individuales (Repetibilidad del Ensayo)
            </h4>
            <ResponsiveContainer width="100%" height={400}>
              <LineChart margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis
                  dataKey="voltage"
                  type="number"
                  domain={[0, "dataMax"]}
                  label={{
                    value: "Voltaje (V)",
                    position: "insideBottomRight",
                    offset: -10,
                  }}
                  tick={{ fontSize: 11 }}
                  tickMargin={8}
                />
                <YAxis
                  label={{
                    value: "Corriente (A)",
                    angle: -90,
                    position: "insideLeft",
                    offset: 15,
                  }}
                  tick={{ fontSize: 11 }}
                  tickMargin={8}
                />
                <Tooltip
                  formatter={(val: number) => val.toFixed(4)}
                  labelFormatter={(val: number) =>
                    `V = ${Number(val).toFixed(3)} V`
                  }
                />
                <Legend wrapperStyle={{ fontSize: 10 }} />
                {daqResults.individualCurves.map((curve, idx) => (
                  <Line
                    key={idx}
                    data={curve.data}
                    dataKey="current"
                    name={curve.name}
                    stroke={COLORS[idx % COLORS.length]}
                    dot={false}
                    strokeWidth={1.5}
                    type="monotone"
                    activeDot={{ r: 4 }}
                  />
                ))}
              </LineChart>
            </ResponsiveContainer>
          </div>

          {/* ── Curva I-V y P-V Promedio ── */}
          <div className="bg-white rounded-xl border border-gray-200 p-5">
            <h4 className="text-sm font-semibold text-gray-700 mb-3">
              Curvas I-V y P-V Promedio
            </h4>
            <ResponsiveContainer width="100%" height={400}>
              <ComposedChart
                data={daqResults.averageCurve}
                margin={{ top: 5, right: 60, left: 20, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis
                  dataKey="voltage"
                  type="number"
                  domain={[0, "dataMax"]}
                  label={{
                    value: "Voltaje (V)",
                    position: "insideBottomRight",
                    offset: -10,
                  }}
                  tick={{ fontSize: 11 }}
                  tickMargin={8}
                />
                <YAxis
                  yAxisId="left"
                  label={{
                    value: "Corriente (A)",
                    angle: -90,
                    position: "insideLeft",
                    offset: 15,
                  }}
                  tick={{ fontSize: 11 }}
                  tickMargin={8}
                />
                <YAxis
                  yAxisId="right"
                  orientation="right"
                  label={{
                    value: "Potencia (W)",
                    angle: 90,
                    position: "insideRight",
                    offset: 15,
                  }}
                  tick={{ fontSize: 11 }}
                  tickMargin={8}
                />
                <Tooltip
                  formatter={(val: number, name: string) => [
                    val.toFixed(4),
                    name,
                  ]}
                  labelFormatter={(val: number) =>
                    `V = ${Number(val).toFixed(3)} V`
                  }
                />
                <Legend wrapperStyle={{ fontSize: 11, paddingTop: "10px" }} />
                <Line
                  yAxisId="left"
                  dataKey="current"
                  name="I-V prom."
                  stroke="#ef4444"
                  dot={false}
                  strokeWidth={2}
                  type="monotone"
                  activeDot={{ r: 4, fill: "#ef4444" }}
                />
                <Line
                  yAxisId="right"
                  dataKey="power"
                  name="P-V prom."
                  stroke="#39a900"
                  dot={false}
                  strokeWidth={2}
                  type="monotone"
                  activeDot={{ r: 4, fill: "#39a900" }}
                />

                {/* Líneas de referencia para MPP */}
                <ReferenceLine
                  yAxisId="left"
                  x={daqResults.graphicResults.Vpm}
                  stroke="#fdc300"
                  strokeDasharray="4 4"
                  opacity={0.7}
                />
                <ReferenceLine
                  yAxisId="left"
                  y={daqResults.graphicResults.Ipm}
                  stroke="#fdc300"
                  strokeDasharray="4 4"
                  opacity={0.7}
                />

                {/* Marcadores de puntos clave */}
                <ReferenceDot
                  yAxisId="left"
                  x={daqResults.graphicResults.Vpm}
                  y={daqResults.graphicResults.Ipm}
                  r={5}
                  fill="#fdc300"
                  stroke="#fdc300"
                  strokeWidth={2}
                />
                <ReferenceDot
                  yAxisId="right"
                  x={daqResults.graphicResults.Vpm}
                  y={daqResults.graphicResults.Pmax}
                  r={5}
                  fill="#39a900"
                  stroke="#39a900"
                  strokeWidth={2}
                />
                <ReferenceDot
                  yAxisId="left"
                  x={0}
                  y={daqResults.graphicResults.Isc}
                  r={4}
                  fill="#ef4444"
                />
                <ReferenceDot
                  yAxisId="left"
                  x={daqResults.graphicResults.Voc}
                  y={0}
                  r={4}
                  fill="#00304d"
                />
              </ComposedChart>
            </ResponsiveContainer>
            <div className="mt-3 flex items-center justify-center gap-6 text-xs text-gray-500">
              <span>
                ● MPP: Pmax = {daqResults.graphicResults.Pmax.toFixed(2)} W
              </span>
              <span>Vpm = {daqResults.graphicResults.Vpm.toFixed(2)} V</span>
              <span>Ipm = {daqResults.graphicResults.Ipm.toFixed(2)} A</span>
            </div>
          </div>

          {/* ── SunData Table ── */}
          <div className="bg-white rounded-xl border border-gray-200 p-5 overflow-x-auto">
            <h4 className="text-sm font-semibold text-gray-700 mb-3">
              Tabla SunData (Todas las Mediciones)
            </h4>
            <table className="w-full text-xs">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-200">
                  <th className="px-3 py-2 text-left font-medium text-gray-500 whitespace-nowrap">
                    #
                  </th>
                  {daqResults.visibleColumns.map((col) => (
                    <th
                      key={col}
                      className="px-3 py-2 text-center font-medium text-gray-500 whitespace-nowrap"
                    >
                      {col}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {daqResults.visibleRows.map((row, idx) => (
                  <tr
                    key={idx}
                    className="border-b border-gray-100 last:border-0 hover:bg-gray-50"
                  >
                    <td className="px-3 py-2 text-gray-400">{idx + 1}</td>
                    {daqResults.visibleColumns.map((col) => {
                      const val = row[col];
                      const isNumeric = !isNaN(parseFloat(val));
                      return (
                        <td
                          key={col}
                          className={`px-3 py-2 whitespace-nowrap ${isNumeric ? "text-center" : "text-left font-mono text-gray-600"}`}
                        >
                          {val}
                        </td>
                      );
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* ── Screenshots ── */}
          {daqResults.curveScreenshots.length > 0 && (
            <div className="bg-white rounded-xl border border-gray-200 p-5">
              <h4 className="text-sm font-semibold text-gray-700 mb-3">
                Capturas del Equipo de Medición
              </h4>
              <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
                {daqResults.curveScreenshots.map((img, idx) => (
                  <div
                    key={idx}
                    className="border border-gray-200 rounded-lg overflow-hidden"
                  >
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={img.dataUrl}
                      alt={img.name}
                      className="w-full h-auto"
                    />
                    <p className="text-[10px] text-gray-400 text-center py-1 truncate px-1">
                      {img.name}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

/* ── Helper Components ── */

function SummaryCard({ label, value }: { label: string; value: string }) {
  return (
    <div className="bg-sena-green/10 rounded-lg p-3 text-center">
      <p className="text-2xl font-bold text-sena-green">{value}</p>
      <p className="text-xs text-sena-green">{label}</p>
    </div>
  );
}

function ResultCard({
  label,
  value,
  unit,
}: {
  label: string;
  value: string;
  unit: string;
}) {
  return (
    <div className="bg-gray-50 rounded-lg p-2.5 text-center">
      <p className="text-xs text-gray-500">{label}</p>
      <p className="text-sm font-semibold text-gray-800">
        {value}{" "}
        <span className="text-xs font-normal text-gray-400">{unit}</span>
      </p>
    </div>
  );
}

function MetadataCard({
  icon: Icon,
  label,
  value,
}: {
  icon: React.ElementType;
  label: string;
  value: string;
}) {
  return (
    <div className="bg-indigo-50/50 rounded-lg p-3 flex items-start gap-2.5">
      <Icon size={15} className="text-indigo-400 mt-0.5 shrink-0" />
      <div className="min-w-0">
        <p className="text-[10px] text-indigo-400 leading-tight">{label}</p>
        <p className="text-sm font-medium text-gray-800 truncate">{value}</p>
      </div>
    </div>
  );
}
