// HARP X-Ray Inspection Form Types

export type HarpTestType =
  | "HARP QA"
  | "New Install"
  | "Acceptance Test"
  | "Plans Approved"
  | "Replacement";

export type XrayType = "Intra-oral" | "Pan" | "Ceph" | "CT";

export type MsNiResult = "MS" | "NI";

export type YesNoResult = "Yes" | "No";

export type ImageType = "Film" | "Digital" | "Phosphor Plate";

export interface HarpItemCheck {
  id: number;
  label: string;
  result: MsNiResult | null;
}

export interface HarpTechniqueRow {
  id: string;
  sourceToConeDistance: string;
  setKv: string;
  setMa: string;
  setTime: string;
  measuredKvp: string;
  measuredTime: string;
  outputMr: string;
  peeAverageMr: string;
}

export interface HarpHalfValueLayer {
  kV: string;
  mA: string;
  time: string;
  totalFiltrationMmAl: string;
  measuredHvlMm: string;
  requiredHvlMm: string;
  mR: string;
}

export interface HarpInspectionForm {
  // Step 1: Test Setup
  testType: HarpTestType | null;
  xrayTypes: XrayType[];
  clinicName: string;
  clinicAddress: string;
  clinicPhone: string;
  accountNumber: string;
  roomNumber: string;
  inspectionDate: string;
  technicianName: string;
  technicianDate: string;

  // Step 2: Equipment Info
  equipmentMake: string;
  equipmentModel: string;
  controlSerial: string;
  tubeSerial: string;
  xrisNumber: string;
  imageType: ImageType | null;

  // Step 3: Items 1-12
  items1to12: HarpItemCheck[];

  // Step 4: Test Parameters
  techniqueRows: HarpTechniqueRow[];
  notes: string;

  // Step 5: Items 13-24 + HVL
  items13to17: HarpItemCheck[];
  item18KvCheck: YesNoResult | null;
  item19TimeCheck: YesNoResult | null;
  item20HarpSpec: YesNoResult | null;
  peeKv: string;
  peeMa: string;
  peeSec: string;
  beamAlignment: string;
  halfValueLayer: HarpHalfValueLayer;
}

export const defaultHarpForm: HarpInspectionForm = {
  testType: null,
  xrayTypes: [],
  clinicName: "",
  clinicAddress: "",
  clinicPhone: "",
  accountNumber: "",
  roomNumber: "",
  inspectionDate: "",
  technicianName: "",
  technicianDate: "",

  equipmentMake: "",
  equipmentModel: "",
  controlSerial: "",
  tubeSerial: "",
  xrisNumber: "",
  imageType: null,

  items1to12: [
    { id: 1, label: 'Line "ON" indicator', result: null },
    { id: 2, label: 'X-ray "ON" indicator', result: null },
    { id: 3, label: 'Multiple tube indicators', result: null },
    { id: 4, label: 'Line voltage compensator', result: null },
    { id: 5, label: 'kV / mA / Technique indication', result: null },
    { id: 6, label: 'Tube head leakage', result: null },
    { id: 7, label: 'Tube head stability', result: null },
    { id: 8, label: 'Interlocks', result: null },
    { id: 9, label: 'Labels', result: null },
    { id: 10, label: 'Warning Signs', result: null },
    { id: 11, label: 'Exposure Switch', result: null },
    { id: 12, label: 'kVp accuracy', result: null },
  ],

  techniqueRows: [
    {
      id: crypto.randomUUID(),
      sourceToConeDistance: "",
      setKv: "",
      setMa: "",
      setTime: "",
      measuredKvp: "",
      measuredTime: "",
      outputMr: "",
      peeAverageMr: "",
    },
  ],
  notes: "",

  items13to17: [
    { id: 13, label: 'H-V-L (Filtration)', result: null },
    { id: 14, label: 'Collimation pan', result: null },
    { id: 15, label: 'Patient exposure entrance', result: null },
    { id: 16, label: 'Output reproducibility', result: null },
    { id: 17, label: 'Timer: (mech/elect)', result: null },
  ],
  item18KvCheck: null,
  item19TimeCheck: null,
  item20HarpSpec: null,
  peeKv: "",
  peeMa: "",
  peeSec: "",
  beamAlignment: "",

  halfValueLayer: {
    kV: "",
    mA: "",
    time: "",
    totalFiltrationMmAl: "",
    measuredHvlMm: "",
    requiredHvlMm: "",
    mR: "",
  },
};
