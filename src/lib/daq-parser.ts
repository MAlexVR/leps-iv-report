/**
 * DAQ Analyzer — Migración fiel del pipeline Python (main.py)
 *
 * Referencia: DAQAnalyzer/main.py — class DAQAnalyzer
 *
 * Pipeline:
 * 1. Parsear SunData CSV (UTF-16-LE con BOM) → parámetros por medición + "datos del ensayo"
 * 2. Extraer timestamps de las imágenes JPG (regex: YYYY-MM-DD HH-MM-SS.jpg)
 * 3. Leer archivos *-cali.daq (NO irr-cali, NO irr.daq) → filtrar por timestamps de imágenes
 * 4. Calcular promedios de V, I y P = V × I
 * 5. Análisis gráfico (Python _extract_metrics):
 *    - Voc = max(V_avg)        ← NOT last point!
 *    - Isc = max(I_avg)        ← NOT first point!
 *    - Pmax = max(P_avg)
 *    - Vpm, Ipm = V, I at argmax(P_avg)
 *    - FF = round(Pmax / (Voc * Isc), 4)
 */

import {
  DAQResults,
  IVDataPoint,
  SunDataRow,
  TestMetadata,
} from "@/types/report";

// ════════════════════════════════════════════════════════════════
// Columnas ocultas del CSV (igual que HIDDEN_COLUMNS en Python)
// ════════════════════════════════════════════════════════════════
const HIDDEN_COLUMNS = [
  "Test_Date",
  "ID",
  "Temp",
  "TMod",
  "Insol",
  "Irev",
  "Manuf",
  "ModType",
  "Area",
  "STime",
  "SDirection",
  "IrrCali",
  "Unnamed: 30",
  "",
];

// ════════════════════════════════════════════════════════════════
// 1. PARSEAR SUNDATA CSV (UTF-16-LE)
// ════════════════════════════════════════════════════════════════
interface CSVParseResult {
  rows: SunDataRow[];
  testMetadata: TestMetadata;
  allColumns: string[];
  rawRows: Record<string, string>[];
}

function parseSunDataCSV(csvBuffer: ArrayBuffer): CSVParseResult {
  // Decodificar UTF-16-LE (pandas usa encoding='UTF-16' que maneja BOM)
  const decoder = new TextDecoder("utf-16le");
  let text = decoder.decode(csvBuffer);
  if (text.charCodeAt(0) === 0xfeff) text = text.substring(1);

  const lines = text
    .trim()
    .split("\n")
    .map((l) => l.trim())
    .filter((l) => l.length > 0);
  if (lines.length < 2)
    throw new Error("El archivo CSV no contiene datos suficientes");

  const allColumns = lines[0].split(",").map((h) => h.trim());
  const getIdx = (name: string): number => allColumns.indexOf(name);

  const rawRows: Record<string, string>[] = [];
  const rows: SunDataRow[] = [];

  for (let i = 1; i < lines.length; i++) {
    const cols = lines[i].split(",");
    if (cols.length < 20) continue;

    // Guardar fila raw completa
    const rawRow: Record<string, string> = {};
    allColumns.forEach((h, idx) => {
      rawRow[h] = (cols[idx] || "").trim();
    });
    rawRows.push(rawRow);

    // Parsear columnas visibles (SunDataRow)
    const getVal = (name: string) => parseFloat(cols[getIdx(name)] || "0") || 0;
    rows.push({
      ModEff: getVal("ModEff"),
      Rsh: getVal("Rsh"),
      Rs: getVal("Rs"),
      FF: getVal("FF"),
      Isc: getVal("Isc"),
      Voc: getVal("Voc"),
      Ipm: getVal("Ipm"),
      Vpm: getVal("Vpm"),
      Pmax: getVal("Pmax"),
      EnvTemp: getVal("EnvTemp"),
      SunRef: getVal("SunRef"),
      Ivld: getVal("Ivld"),
      Vld: getVal("Vld"),
      StdIsc: getVal("StdIsc"),
      Pvld: getVal("Pvld"),
      Test_Time: (cols[getIdx("Test_Time")] || "").trim(),
      Jsc: getVal("Jsc"),
      RCTemp: getVal("RCTemp"),
    });
  }

  if (rows.length === 0)
    throw new Error("No se encontraron filas de datos en el CSV");

  // "Datos del ensayo" — Python: constant_values (líneas 298-300)
  const first = rawRows[0];
  const testMetadata: TestMetadata = {
    Test_Date: (first["Test_Date"] || "Unknown").replace(/\//g, "-"),
    Manuf: first["Manuf"] || "Unknown",
    Area: first["Area"] || "0",
    STime: first["STime"] || "0",
    SDirection: first["SDirection"] || "Unknown",
  };

  return { rows, testMetadata, allColumns, rawRows };
}

// ════════════════════════════════════════════════════════════════
// 2. PARSEAR ARCHIVO DAQ (texto CSV: V,I)
// ════════════════════════════════════════════════════════════════
function parseDAQFile(text: string): { voltage: number[]; current: number[] } {
  const voltage: number[] = [];
  const current: number[] = [];
  for (const line of text.trim().split("\n")) {
    const parts = line.trim().split(",");
    if (parts.length >= 2) {
      const v = parseFloat(parts[0]);
      const i = parseFloat(parts[1]);
      if (!isNaN(v) && !isNaN(i)) {
        voltage.push(v);
        current.push(i);
      }
    }
  }
  return { voltage, current };
}

// ════════════════════════════════════════════════════════════════
// 3. EXTRAER TIMESTAMPS DE IMÁGENES JPG
//    Python: extract_image_filenames (líneas 328-338)
//    regex: r"(\d{4}-\d{2}-\d{2} \d{2}-\d{2}-\d{2})\.jpg"
// ════════════════════════════════════════════════════════════════
function extractImageDates(jpgFiles: File[]): string[] {
  const dates: string[] = [];
  const pattern = /(\d{4}-\d{2}-\d{2} \d{2}-\d{2}-\d{2})\.jpg$/i;
  for (const file of jpgFiles) {
    const match = file.name.match(pattern);
    if (match) dates.push(match[1]);
  }
  return dates;
}

// ════════════════════════════════════════════════════════════════
// 4. FILTRAR Y EMPAREJAR DAQ FILES
//    Python: extract_daq_filenames (líneas 340-349) + process_and_save_all (línea 356)
//    - Solo *-cali.daq (NO irr-cali, NO irr.daq)
//    - Filtrar: valid_daq_files = [f for f if any(date in f for date in image_dates)]
// ════════════════════════════════════════════════════════════════
function filterDAQFiles(daqFiles: File[], imageDates: string[]): File[] {
  // Paso 1: Solo archivos *-cali.daq que NO sean irr-cali ni irr.daq
  const caliFiles = daqFiles.filter((f) => {
    const name = f.name.toLowerCase();
    return (
      name.endsWith("-cali.daq") &&
      !name.includes("-irr-cali") &&
      !name.includes("-irr.")
    );
  });

  if (caliFiles.length === 0) {
    throw new Error(
      "No se encontraron archivos *-cali.daq (curvas I-V calibradas)",
    );
  }

  // Paso 2: Si hay imágenes, filtrar por timestamps coincidentes
  // Python (línea 356): valid_daq_files = [f for f in self.daq_files if any(date in f for date in self.image_dates)]
  if (imageDates.length > 0) {
    const matched = caliFiles.filter((f) =>
      imageDates.some((date) => f.name.includes(date)),
    );
    if (matched.length > 0)
      return matched.sort((a, b) => a.name.localeCompare(b.name));
    // Si no matchea ninguno, usar todos (fallback)
  }

  return caliFiles.sort((a, b) => a.name.localeCompare(b.name));
}

// ════════════════════════════════════════════════════════════════
// 5. CALCULAR PROMEDIOS
//    Python: _calculate_averages (líneas 386-403)
// ════════════════════════════════════════════════════════════════
function calculateAverageCurve(
  curves: { voltage: number[]; current: number[] }[],
): IVDataPoint[] {
  if (curves.length === 0) return [];
  const minLen = Math.min(...curves.map((c) => c.voltage.length));
  const avgPoints: IVDataPoint[] = [];
  for (let i = 0; i < minLen; i++) {
    let sumV = 0,
      sumI = 0;
    for (const curve of curves) {
      sumV += curve.voltage[i];
      sumI += curve.current[i];
    }
    const avgV = sumV / curves.length;
    const avgI = sumI / curves.length;
    avgPoints.push({ voltage: avgV, current: avgI, power: avgV * avgI });
  }
  return avgPoints;
}

// ════════════════════════════════════════════════════════════════
// 6. ANÁLISIS GRÁFICO
//    Python: _extract_metrics (líneas 405-416) — CRITICAL: usa np.max(), NO primer/último punto
//    Voc = float(np.max(v_avg))
//    Isc = float(np.max(i_avg))
//    Pmax = float(np.max(p_avg))
//    idx_pmax = int(np.argmax(p_avg))
//    Vpm = float(v_avg[idx_pmax])
//    Ipm = float(i_avg[idx_pmax])
//    FF = round(Pmax / (Voc * Isc), 4) if (Voc * Isc) != 0 else 0.0
// ════════════════════════════════════════════════════════════════
function graphicAnalysis(avgCurve: IVDataPoint[]): {
  Isc: number;
  Voc: number;
  Pmax: number;
  Vpm: number;
  Ipm: number;
  FF: number;
} {
  if (avgCurve.length === 0)
    return { Isc: 0, Voc: 0, Pmax: 0, Vpm: 0, Ipm: 0, FF: 0 };

  // np.max(v_avg) — máximo voltaje en la curva promedio
  const Voc = Math.max(...avgCurve.map((p) => p.voltage));

  // np.max(i_avg) — máxima corriente en la curva promedio
  const Isc = Math.max(...avgCurve.map((p) => p.current));

  // np.max(p_avg) y argmax
  let maxP = 0,
    maxIdx = 0;
  for (let i = 0; i < avgCurve.length; i++) {
    if (avgCurve[i].power > maxP) {
      maxP = avgCurve[i].power;
      maxIdx = i;
    }
  }

  const Pmax = maxP;
  const Vpm = avgCurve[maxIdx].voltage;
  const Ipm = avgCurve[maxIdx].current;

  // FF = round(Pmax / (Voc * Isc), 4)
  const FF =
    Voc * Isc !== 0 ? Math.round((Pmax / (Voc * Isc)) * 10000) / 10000 : 0;

  return { Isc, Voc, Pmax, Vpm, Ipm, FF };
}

// ════════════════════════════════════════════════════════════════
// 7. PROMEDIOS SUNDATA
//    Python: self.df_avg = self.df_visible.mean(numeric_only=True) (línea 293)
// ════════════════════════════════════════════════════════════════
function averageSunData(rows: SunDataRow[]) {
  const n = rows.length;
  if (n === 0)
    return {
      ModEff: 0,
      Rsh: 0,
      Rs: 0,
      FF: 0,
      Isc: 0,
      Voc: 0,
      Ipm: 0,
      Vpm: 0,
      Pmax: 0,
      EnvTemp: 0,
      SunRef: 0,
      Jsc: 0,
      RCTemp: 0,
    };
  const sum = (key: keyof SunDataRow) =>
    rows.reduce(
      (acc, r) => acc + (typeof r[key] === "number" ? (r[key] as number) : 0),
      0,
    );
  return {
    ModEff: sum("ModEff") / n,
    Rsh: sum("Rsh") / n,
    Rs: sum("Rs") / n,
    FF: sum("FF") / n,
    Isc: sum("Isc") / n,
    Voc: sum("Voc") / n,
    Ipm: sum("Ipm") / n,
    Vpm: sum("Vpm") / n,
    Pmax: sum("Pmax") / n,
    EnvTemp: sum("EnvTemp") / n,
    SunRef: sum("SunRef") / n,
    Jsc: sum("Jsc") / n,
    RCTemp: sum("RCTemp") / n,
  };
}

// ════════════════════════════════════════════════════════════════
// FUNCIÓN PRINCIPAL — process_and_save_all en Python (líneas 351-384)
// ════════════════════════════════════════════════════════════════
export async function processDAQData(
  csvFile: File,
  daqFiles: File[],
  jpgFiles: File[],
): Promise<DAQResults> {
  // 1. Parsear SunData CSV
  const csvBuffer = await csvFile.arrayBuffer();
  const {
    rows: sunData,
    testMetadata,
    allColumns,
    rawRows,
  } = parseSunDataCSV(csvBuffer);

  // 2. Extraer timestamps de imágenes JPG
  const imageDates = extractImageDates(jpgFiles);

  // 3. Filtrar archivos DAQ (matching con imágenes)
  const validDAQFiles = filterDAQFiles(daqFiles, imageDates);

  // 4. Leer y parsear cada curva I-V calibrada
  const parsedCurves: { name: string; voltage: number[]; current: number[] }[] =
    [];
  for (const file of validDAQFiles) {
    const text = await file.text();
    const parsed = parseDAQFile(text);
    if (parsed.voltage.length > 0) {
      parsedCurves.push({
        name: file.name.replace(/-cali\.daq$/i, ""),
        ...parsed,
      });
    }
  }

  if (parsedCurves.length === 0) {
    throw new Error("No se pudieron parsear curvas I-V de los archivos DAQ");
  }

  // 5. Curvas individuales con potencia
  const individualCurves = parsedCurves.map((c) => ({
    name: c.name,
    data: c.voltage.map((v, i) => ({
      voltage: v,
      current: c.current[i],
      power: v * c.current[i],
    })),
  }));

  // 6. Calcular curva promedio — Python: _calculate_averages (línea 373)
  const averageCurve = calculateAverageCurve(
    parsedCurves.map((c) => ({ voltage: c.voltage, current: c.current })),
  );

  // 7. Análisis gráfico — Python: _extract_metrics (línea 374)
  const graphicResults = graphicAnalysis(averageCurve);

  // 8. Promediar SunData — Python: self.df_avg (línea 293)
  const avgSunData = averageSunData(sunData);

  // 9. Extra columns logic matching Python df_visible
  const visibleColumns = allColumns.filter(
    (c) => c && !HIDDEN_COLUMNS.includes(c),
  );
  const visibleRows = rawRows.map((row) => {
    const vr: Record<string, string> = {};
    visibleColumns.forEach((c) => (vr[c] = row[c] || ""));
    return vr;
  });
  const visibleAverages: Record<string, string> = {};
  visibleColumns.forEach((c) => {
    // Only calculate average if all rows have a valid number for this column
    const nums = visibleRows.map((r) => parseFloat(r[c]));
    if (nums.every((n) => !isNaN(n)) && nums.length > 0) {
      visibleAverages[c] = (
        nums.reduce((a, b) => a + b, 0) / nums.length
      ).toFixed(4);
    } else {
      visibleAverages[c] = "";
    }
  });

  // 10. Cargar capturas JPG como base64
  const curveScreenshots: { name: string; dataUrl: string }[] = [];
  for (const file of jpgFiles) {
    if (!file.name.toLowerCase().endsWith(".jpg")) continue;
    try {
      const buffer = await file.arrayBuffer();
      const base64 = btoa(
        new Uint8Array(buffer).reduce(
          (data, byte) => data + String.fromCharCode(byte),
          "",
        ),
      );
      curveScreenshots.push({
        name: file.name,
        dataUrl: `data:image/jpeg;base64,${base64}`,
      });
    } catch {
      /* skip */
    }
  }
  curveScreenshots.sort((a, b) => a.name.localeCompare(b.name));

  return {
    averageCurve,
    individualCurves,
    curveScreenshots,
    sunData,
    visibleColumns,
    visibleRows,
    visibleAverages,
    testMetadata,
    averageResults: avgSunData,
    graphicResults,
  };
}
