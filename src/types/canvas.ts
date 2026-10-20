export type ElementType = 'text' | 'shape' | 'image' | 'icon' | 'code';
export type AspectRatio = '16:9' | '1:1' | '4:5';

export type ShapeType = 
  | 'card' 
  | 'rectangle' 
  | 'circle' 
  | 'pill' 
  | 'sticky' 
  | 'highlighter' 
  | 'arrow' 
  | 'curved-arrow' 
  | 'diamond' 
  | 'callout' 
  | 'takeaway-bar' 
  | 'line'
  | 'star';

export interface CanvasElement {
  id: string;
  type: ElementType;
  x: number;
  y: number;
  width: number;
  height: number;
  rotation?: number;
  zIndex: number;
  
  // Text specific
  text?: string;
  fontSize?: number;
  fontFamily?: 'sans' | 'serif' | 'mono' | 'display';
  fontWeight?: 'normal' | 'semibold' | 'bold' | 'extrabold';
  textColor?: string;
  textAlign?: 'left' | 'center' | 'right';
  bgColor?: string; // background fill for badge / code block
  
  // Shape specific
  shapeType?: ShapeType;
  fillColor?: string;
  borderColor?: string;
  borderWidth?: number;
  borderRadius?: number;
  opacity?: number;
  shadow?: boolean;
  accentText?: string; // For sticky notes, takeaway badges, or step labels
  
  // Code block specific
  codeText?: string;
  codeLanguage?: string;
  
  // Connector / Arrow specific
  arrowStartId?: string;
  arrowEndId?: string;
  arrowCurvature?: number;
  arrowHead?: 'arrow' | 'dot' | 'none';
  
  // Image specific
  imageUrl?: string;
  imageAlt?: string;
  
  // Icon / Emoji specific
  iconText?: string;
}

export interface CanvasSlide {
  id: string;
  title: string;
  elements: CanvasElement[];
  bgColor?: string;
}

export interface CanvasState {
  aspectRatio: AspectRatio;
  bgColor: string;
  bgTexture: 'solid' | 'grid' | 'dots' | 'glow';
  bgImageUrl?: string;
  elements: CanvasElement[];
  slides?: CanvasSlide[];
  currentSlideIndex?: number;
  selectedElementId: string | null;
}

