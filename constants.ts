
import { ModelMetrics } from './types';

export const SYSTEM_INSTRUCTION = `You are a production-grade Spam Email Classifier. 
Analyze the provided email text and return a JSON object.
Criteria for Spam:
- Urgent/Threatening language
- Unsolicited commercial offers
- Deceptive links or mismatched sender info
- Poor grammar/all-caps/excessive punctuation
- Requests for sensitive data (phishing)

Your response must strictly follow this JSON schema:
{
  "isSpam": boolean,
  "confidence": number (0.0 to 1.0),
  "explanation": "A professional 2-sentence explanation of the decision",
  "topFeatures": ["Feature1", "Feature2", "Feature3"]
}`;

export const MOCK_TRAINING_METRICS: ModelMetrics = {
  accuracy: 0.982,
  precision: 0.975,
  recall: 0.968,
  f1Score: 0.971,
  confusionMatrix: {
    tp: 485,
    tn: 1240,
    fp: 12,
    fn: 16
  }
};

export const TF_IDF_EXPLANATION = `TF-IDF (Term Frequency-Inverse Document Frequency) is chosen over simpler bag-of-words methods because it penalizes common "stop words" (like 'the', 'is') while highlighting unique, discriminatory keywords (like 'winner', 'pharmacy', 'urgent') that are statistically more significant in identifying spam patterns within large corpora.`;
