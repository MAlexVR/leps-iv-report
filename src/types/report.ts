export interface IVDataPoint {
  voltage: number;
  current: number;
  power: number;
}

/**
 * Fila completa del CSV SunData (todas las columnas numéricas visibles).
 * Las columnas ocultas (HIDDEN_COLUMNS) no se incluyen aquí.
 */
export interface SunDataRow {
  ModEff: number;
  Rsh: number;
  Rs: number;
  FF: number;
  Isc: number;
  Voc: number;
  Ipm: number;
  Vpm: number;
  Pmax: number;
  EnvTemp: number;
  SunRef: number;
  Ivld: number;
  Vld: number;
  StdIsc: number;
  Pvld: number;
  Test_Time: string;
  Jsc: number;
  RCTemp: number;
}

/**
 * "Datos del ensayo" — metadatos constantes extraídos del CSV SunData.
 * Corresponde a la sección "Datos del ensayo" en el DAQAnalyzer Python
 * (process_csv_data → constant_values: Test_Date, Manuf, Area, STime, SDirection)
 */
export interface TestMetadata {
  Test_Date: string; // Fecha del ensayo (ej: "2025/02/26")
  Manuf: string; // Fabricante / identificador (ej: "Modulo INTI")
  Area: string; // Área del módulo en mm² (ej: "8593.200000")
  STime: string; // Tiempo de barrido en ms (ej: "30")
  SDirection: string; // Dirección del barrido (ej: "Isc→Voc")
}

export interface DAQResults {
  averageCurve: IVDataPoint[];
  individualCurves: { name: string; data: IVDataPoint[] }[];
  curveScreenshots: { name: string; dataUrl: string }[];
  sunData: SunDataRow[];
  visibleColumns: string[];
  visibleRows: Record<string, string>[];
  visibleAverages: Record<string, string>;
  testMetadata: TestMetadata;
  averageResults: {
    ModEff: number;
    Rsh: number;
    Rs: number;
    FF: number;
    Isc: number;
    Voc: number;
    Ipm: number;
    Vpm: number;
    Pmax: number;
    EnvTemp: number;
    SunRef: number;
    Jsc: number;
    RCTemp: number;
  };
  graphicResults: {
    Voc: number;
    Isc: number;
    Pmax: number;
    Vpm: number;
    Ipm: number;
    FF: number;
  };
}

export interface ModuleInfo {
  objeto: string;
  fabricante: string;
  referencia: string;
  materialCeldas: string;
  serial: string;
  areaModulo: string;
  observaciones: string;
}

export interface TestItemPhotos {
  frontal: string | null;
  trasera: string | null;
  cajaConexiones: string | null;
  cablesConectores: string | null;
  etiqueta: string | null;
}

export interface ClientInfo {
  company: string;
  contacto: string;
  direccion: string;
  codigoPostal: string;
  pais: string;
  noOrden: string;
}

export interface AmbientConditions {
  temperatura: string;
  humedadRelativa: string;
}

export interface MeasurementConditions {
  irradianciaTotal: string;
  temperaturaModulo: string;
  sistemaMedicion: string;
  correccionDesajuste: string;
  hysteresis: string;
  numeroSecciones: string;
  duracionMedicion: string;
  comentarios: string;
}

export interface MeasurementResults {
  isc: { value: number; uncertainty: number };
  voc: { value: number; uncertainty: number };
  impp: { value: number; uncertainty: number };
  vmpp: { value: number; uncertainty: number };
  pmpp: { value: number; uncertainty: number };
  ff: { value: number; uncertainty: number };
  efficiency: { value: number; uncertainty: number };
}

export interface NominalValues {
  isc: number;
  voc: number;
  impp: number;
  vmpp: number;
  pmpp: number;
  ff: number;
  efficiency: number;
}

export interface MeasurementEquipment {
  descripcion: string;
  modelo: string;
  serial: string;
  trazabilidad: string;
  fechaCalibracion: string;
}

export interface SignatureInfo {
  name: string;
  role: string;
  signatureImage: string | null;
}

export interface NormativeReference {
  id: string;
  code: string;
  title: string;
}

export interface ReportState {
  daqResults: DAQResults | null;
  moduleInfo: ModuleInfo;
  clientInfo: ClientInfo;
  ambientConditions: AmbientConditions;
  measurementConditions: MeasurementConditions;
  measurementResults: MeasurementResults;
  nominalValues: NominalValues;
  equipment: MeasurementEquipment[];
  references: NormativeReference[];
  testItemPhotos: TestItemPhotos;
  procedimientoEnsayo: string;
  incertidumbreMedicion: string;
  performer: SignatureInfo;
  reviewer: SignatureInfo;
  approver: SignatureInfo;
  reportCode: string;
  reportVersion: string;
  reportDate: string;
  vigenciaDate: string;
}
