import { create } from "zustand";
import {
  DAQResults,
  ModuleInfo,
  ClientInfo,
  AmbientConditions,
  TestItemPhotos,
  MeasurementConditions,
  MeasurementResults,
  NominalValues,
  MeasurementEquipment,
  NormativeReference,
  SignatureInfo,
} from "@/types/report";

interface ReportStore {
  currentStep: number;
  setStep: (step: number) => void;
  nextStep: () => void;
  prevStep: () => void;

  // Step 1
  daqResults: DAQResults | null;
  setDaqResults: (r: DAQResults) => void;

  // Step 2
  moduleInfo: ModuleInfo;
  setModuleInfo: (info: Partial<ModuleInfo>) => void;
  clientInfo: ClientInfo;
  setClientInfo: (info: Partial<ClientInfo>) => void;

  // Step 3
  ambientConditions: AmbientConditions;
  setAmbientConditions: (c: Partial<AmbientConditions>) => void;
  measurementConditions: MeasurementConditions;
  setMeasurementConditions: (c: Partial<MeasurementConditions>) => void;

  // Step 4
  measurementResults: MeasurementResults;
  setMeasurementResults: (r: Partial<MeasurementResults>) => void;
  nominalValues: NominalValues;
  setNominalValues: (v: Partial<NominalValues>) => void;

  // Step 5
  equipment: MeasurementEquipment[];
  setEquipment: (e: MeasurementEquipment[]) => void;
  addEquipment: (e: MeasurementEquipment) => void;
  removeEquipment: (idx: number) => void;
  references: NormativeReference[];
  setReferences: (r: NormativeReference[]) => void;
  addReference: (r: NormativeReference) => void;
  updateReference: (idx: number, r: Partial<NormativeReference>) => void;
  removeReference: (idx: number) => void;

  // Step 6 / Common
  testItemPhotos: TestItemPhotos;
  setTestItemPhotos: (p: Partial<TestItemPhotos>) => void;
  procedimientoEnsayo: string;
  setProcedimientoEnsayo: (p: string) => void;
  incertidumbreMedicion: string;
  setIncertidumbreMedicion: (p: string) => void;
  performer: SignatureInfo;
  setPerformer: (s: Partial<SignatureInfo>) => void;
  reviewer: SignatureInfo;
  setReviewer: (s: Partial<SignatureInfo>) => void;
  approver: SignatureInfo;
  setApprover: (s: Partial<SignatureInfo>) => void;

  // Metadata
  reportCode: string;
  setReportCode: (c: string) => void;
  reportVersion: string;
  setReportVersion: (v: string) => void;
  reportDate: string;
  setReportDate: (d: string) => void;
  vigenciaDate: string;
  setVigenciaDate: (d: string) => void;
}

const DEFAULT_REFERENCES: NormativeReference[] = [
  {
    id: "1",
    code: "IEC 60904-3 Ed. 4 (2019-02)",
    title:
      "Photovoltaic devices - Part 3: Measurement principles for terrestrial photovoltaic (PV) solar devices with reference spectral irradiance data",
  },
  {
    id: "2",
    code: "IEC 60904-7 Ed. 4 (2019-08)",
    title:
      "Photovoltaic devices - Part 7: Computation of the spectral mismatch correction for measurements of photovoltaic devices",
  },
  {
    id: "3",
    code: "IEC 60904-8 Ed. 3 (2014-05)",
    title:
      "Photovoltaic devices - Part 8: Measurement of spectral responsivity of a photovoltaic (PV) device",
  },
  {
    id: "4",
    code: "IEC 60904-9 Ed. 3 (2020-09)",
    title:
      "Photovoltaic devices - Part 9: Solar simulator performance requirements",
  },
];

const DEFAULT_EQUIPMENT: MeasurementEquipment[] = [
  {
    descripcion: "WPVS Reference Solar Cell",
    modelo: "Czibula & Grundmann - RS-ID-5",
    serial: "075-2019",
    trazabilidad: "47050-PTB-23",
    fechaCalibracion: "26.06.2023",
  },
  {
    descripcion: "Calibration Resistor",
    modelo: "burster - 1240-0.5",
    serial: "591128",
    trazabilidad: "33492-D-K-15141-01-00",
    fechaCalibracion: "18.12.2023",
  },
  {
    descripcion: "IV-Curve Tracer",
    modelo: "Pasan - CT506/HL3",
    serial: "0010046614000000212",
    trazabilidad: "E258256-D-K-15070-01-01",
    fechaCalibracion: "22.01.2024",
  },
  {
    descripcion: "Temperature Sensor",
    modelo: "GHM - Pt100/4-L",
    serial: "FL3 009",
    trazabilidad: "T216408-D-K-15070-01-01",
    fechaCalibracion: "13.07.2023",
  },
];

const today = new Date().toISOString().split("T")[0];

export const useReportStore = create<ReportStore>((set) => ({
  currentStep: 0,
  setStep: (step) => set({ currentStep: step }),
  nextStep: () => set((s) => ({ currentStep: Math.min(s.currentStep + 1, 7) })),
  prevStep: () => set((s) => ({ currentStep: Math.max(s.currentStep - 1, 0) })),

  daqResults: null,
  setDaqResults: (r) => set({ daqResults: r }),

  moduleInfo: {
    objeto: "Módulo fotovoltaico monofacial",
    fabricante: "",
    referencia: "",
    materialCeldas: "mono-Si",
    serial: "",
    areaModulo: "",
    observaciones: "",
  },
  setModuleInfo: (info) =>
    set((s) => ({ moduleInfo: { ...s.moduleInfo, ...info } })),

  clientInfo: {
    company: "",
    contacto: "",
    direccion: "",
    codigoPostal: "",
    pais: "",
    noOrden: "",
  },
  setClientInfo: (info) =>
    set((s) => ({ clientInfo: { ...s.clientInfo, ...info } })),

  ambientConditions: {
    temperatura: "(25 ± 3) °C",
    humedadRelativa: "(50 ± 30) %",
  },
  setAmbientConditions: (c) =>
    set((s) => ({ ambientConditions: { ...s.ambientConditions, ...c } })),

  measurementConditions: {
    irradianciaTotal: "",
    temperaturaModulo: "",
    sistemaMedicion: "",
    correccionDesajuste: "",
    hysteresis: "",
    numeroSecciones: "10",
    duracionMedicion: "",
    comentarios: "",
  },
  setMeasurementConditions: (c) =>
    set((s) => ({
      measurementConditions: { ...s.measurementConditions, ...c },
    })),

  measurementResults: {
    isc: { value: 0, uncertainty: 0 },
    voc: { value: 0, uncertainty: 0 },
    impp: { value: 0, uncertainty: 0 },
    vmpp: { value: 0, uncertainty: 0 },
    pmpp: { value: 0, uncertainty: 0 },
    ff: { value: 0, uncertainty: 0 },
    efficiency: { value: 0, uncertainty: 0 },
  },
  setMeasurementResults: (r) =>
    set((s) => ({ measurementResults: { ...s.measurementResults, ...r } })),

  nominalValues: {
    isc: 0,
    voc: 0,
    impp: 0,
    vmpp: 0,
    pmpp: 0,
    ff: 0,
    efficiency: 0,
  },
  setNominalValues: (v) =>
    set((s) => ({ nominalValues: { ...s.nominalValues, ...v } })),

  equipment: DEFAULT_EQUIPMENT,
  setEquipment: (e) => set({ equipment: e }),
  addEquipment: (e) => set((s) => ({ equipment: [...s.equipment, e] })),
  removeEquipment: (idx) =>
    set((s) => ({ equipment: s.equipment.filter((_, i) => i !== idx) })),

  references: DEFAULT_REFERENCES,
  setReferences: (r) => set({ references: r }),
  addReference: (r) => set((s) => ({ references: [...s.references, r] })),
  updateReference: (idx, r) =>
    set((s) => ({
      references: s.references.map((item, i) =>
        i === idx ? { ...item, ...r } : item,
      ),
    })),
  removeReference: (idx) =>
    set((s) => ({ references: s.references.filter((_, i) => i !== idx) })),

  testItemPhotos: {
    frontal: null,
    trasera: null,
    cajaConexiones: null,
    cablesConectores: null,
    etiqueta: null,
  },
  setTestItemPhotos: (p) =>
    set((s) => ({ testItemPhotos: { ...s.testItemPhotos, ...p } })),

  procedimientoEnsayo:
    "La calibración se realiza en condiciones de prueba estándar (STC) de acuerdo con IEC 60904-1 Ed.3 (2020-09) bajo irradiancia con un simulador solar pulsado clase A+A+A+ según [4]. La irradiancia se controla con una célula solar de referencia durante la medición para corregir las fluctuaciones.\n\nAntes de la calibración, el módulo FV se almacena a (25 ± 3) °C y (50 ± 30) %rH durante al menos 10 horas.\n\nLa medición de la curva IV (curva de corriente-tensión) se realiza con un amplificador de potencia de 2 ó 3 cuadrantes y un casete de carga electrónico. Los conectores solares del módulo fotovoltaico se conectan al sistema de medición en tecnología de cuatro hilos con conectores solares en Y especialmente desarrollados. Se realizan mediciones de histéresis -medición hacia delante del ISC al VOC y medición hacia atrás del VOC al ISC y se calcula la media de ambas curvas.\n\nEl resultado de la medición incluye la corrección del desajuste espectral [2] o tiene en cuenta el desajuste espectral mediante el aumento de la incertidumbre de medición. El desajuste espectral se debe a la desviación del espectro del simulador con respecto al espectro estándar AM1.5G [1] en combinación con la diferente respuesta espectral de la célula de referencia y el dispositivo bajo prueba (DUT).",
  setProcedimientoEnsayo: (p) => set({ procedimientoEnsayo: p }),

  incertidumbreMedicion:
    "La incertidumbre ampliada de medición se expresa como la incertidumbre estándar de medición multiplicada por el factor de cobertura factor k=2. Se ha determinado de conformidad con la norma EA-4/02 M:2022. El valor del mensurando se encuentra dentro del rango de valores asignado con una probabilidad del 95%. No se incluye ninguna parte para la estabilidad a largo plazo del objeto de calibración. Las incertidumbres de medición son valores absolutos relacionados con el valor medido.",
  setIncertidumbreMedicion: (p) => set({ incertidumbreMedicion: p }),

  performer: { name: "", role: "Técnico de laboratorio", signatureImage: null },
  setPerformer: (s) => set((st) => ({ performer: { ...st.performer, ...s } })),
  reviewer: {
    name: "",
    role: "Responsable de la gestión técnica y administrativa",
    signatureImage: null,
  },
  setReviewer: (s) => set((st) => ({ reviewer: { ...st.reviewer, ...s } })),
  approver: { name: "", role: "Director técnico", signatureImage: null },
  setApprover: (s) => set((st) => ({ approver: { ...st.approver, ...s } })),

  reportCode: "LEPS-F.015.001",
  setReportCode: (c) => set({ reportCode: c }),
  reportVersion: "2.0",
  setReportVersion: (v) => set({ reportVersion: v }),
  reportDate: today,
  setReportDate: (d) => set({ reportDate: d }),
  vigenciaDate: today,
  setVigenciaDate: (d) => set({ vigenciaDate: d }),
}));
