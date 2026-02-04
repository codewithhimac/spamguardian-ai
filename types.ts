
export enum ClassificationStatus {
  IDLE = 'IDLE',
  LOADING = 'LOADING',
  SUCCESS = 'SUCCESS',
  ERROR = 'ERROR'
}

export interface ClassificationResult {
  isSpam: boolean;
  confidence: number;
  explanation: string;
  topFeatures: string[];
  metadata: {
    processingTimeMs: number;
    tokensCount: number;
  };
}

export interface ModelMetrics {
  accuracy: number;
  precision: number;
  recall: number;
  f1Score: number;
  confusionMatrix: {
    tp: number;
    tn: number;
    fp: number;
    fn: number;
  };
}

export interface ProcessingStep {
  name: string;
  status: 'pending' | 'active' | 'completed';
}
