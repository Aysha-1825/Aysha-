export type SolidId =
  | 'cube'
  | 'cuboid'
  | 'square_pyramid'
  | 'triangular_prism'
  | 'tetrahedron'
  | 'cylinder'
  | 'cone'
  | 'hexagonal_prism';

export interface SolidDimension {
  id: string;
  name: string;
  symbol: string;
  min: number;
  max: number;
  step: number;
  defaultValue: number;
  unit: string;
}

export interface SolidFaceInfo {
  name: string;
  shape: string;
  count: number;
  dimensionsDescription: string;
}

export interface SolidDefinition {
  id: SolidId;
  nameArabic: string;
  nameEnglish: string;
  category: 'منشورات ومكعبات' | 'أهرامات' | 'مجسمات دورانية' | 'متعددة الوجوه';
  description: string;
  facesCount: number;
  edgesCount: number;
  verticesCount: number;
  facesDescription: string;
  dimensions: SolidDimension[];
  faceList: SolidFaceInfo[];
  calculateProperties: (dims: Record<string, number>) => {
    lateralArea: number;
    totalArea: number;
    volume: number;
    lateralFormula: string;
    totalFormula: string;
    volumeFormula: string;
    calculationSteps: { label: string; formula: string; result: string }[];
  };
  eulerApplies: boolean;
  netDescription: string;
  funFact: string;
  color: string;
  accentColor: string;
}

export interface QuizQuestion {
  id: number;
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
  solidId?: SolidId;
  difficulty: 'سهل' | 'متوسط' | 'متقدم';
}

export interface RiddleQuestion {
  id: number;
  title: string;
  riddle: string;
  clues: string[];
  options: { id: SolidId; name: string }[];
  correctId: SolidId;
  funExplanation: string;
}

export interface NetDetectiveQuestion {
  id: number;
  title: string;
  instruction: string;
  targetSolidName: string;
  nets: {
    id: string;
    svgPath: string; // descriptive SVG representation
    isValid: boolean;
    reason: string;
    layout: number[][]; // grid representation for 2D net layout
  }[];
  explanation: string;
}

export interface MatchNetQuestion {
  id: number;
  solidName: string;
  solidId: SolidId;
  options: {
    id: string;
    solidId: SolidId;
    label: string;
    previewType: string;
  }[];
  correctIndex: number;
  explanation: string;
}
