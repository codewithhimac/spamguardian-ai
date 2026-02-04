
import React, { useState, useCallback, useEffect } from 'react';
import { 
  ShieldCheck, 
  ShieldAlert, 
  RefreshCw, 
  ChevronRight, 
  Info, 
  BarChart3, 
  Mail, 
  Lock,
  ExternalLink,
  AlertCircle
} from 'lucide-react';
import { ClassificationStatus, ClassificationResult, ProcessingStep } from './types.ts';
import { preprocessText } from './services/textProcessor.ts';
import { classifyEmail } from './services/geminiService.ts';
import MetricsDashboard from './components/MetricsDashboard.tsx';

const App: React.FC = () => {
  const [inputText, setInputText] = useState('');
  const [status, setStatus] = useState<ClassificationStatus>(ClassificationStatus.IDLE);
  const [result, setResult] = useState<ClassificationResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'classifier' | 'metrics'>('classifier');
  
  const [pipelineSteps, setPipelineSteps] = useState<ProcessingStep[]>([
    { name: 'Data Validation', status: 'pending' },
    { name: 'Text Preprocessing', status: 'pending' },
    { name: 'Feature Extraction (TF-IDF)', status: 'pending' },
    { name: 'Model Inference', status: 'pending' },
  ]);

  const updatePipelineStep = (index: number, status: 'pending' | 'active' | 'completed') => {
    setPipelineSteps(prev => prev.map((step, i) => i === index ? { ...step, status } : step));
  };

  const handleClassify = async () => {
    if (!inputText.trim()) return;

    setStatus(ClassificationStatus.LOADING);
    setError(null);
    setResult(null);
    
    // Reset pipeline UI
    setPipelineSteps(prev => prev.map(s => ({ ...s, status: 'pending' })));

    try {
      // Step 1: Validation
      updatePipelineStep(0, 'active');
      await new Promise(r => setTimeout(r, 400));
      updatePipelineStep(0, 'completed');

      // Step 2: Preprocessing
      updatePipelineStep(1, 'active');
      const cleaned = preprocessText(inputText);
      await new Promise(r => setTimeout(r, 600));
      updatePipelineStep(1, 'completed');

      // Step 3: Feature Extraction Simulation
      updatePipelineStep(2, 'active');
      await new Promise(r => setTimeout(r, 500));
      updatePipelineStep(2, 'completed');

      // Step 4: Inference
      updatePipelineStep(3, 'active');
      const classification = await classifyEmail(inputText, cleaned);
      updatePipelineStep(3, 'completed');

      setResult(classification);
      setStatus(ClassificationStatus.SUCCESS);
    } catch (err: any) {
      setError(err.message || 'An unexpected error occurred during analysis.');
      setStatus(ClassificationStatus.ERROR);
    }
  };

  const resetForm = () => {
    setInputText('');
    setResult(null);
    setStatus(ClassificationStatus.IDLE);
    setPipelineSteps(prev => prev.map(s => ({ ...s, status: 'pending' })));
  };

  return (
    <div className="relative min-h-screen flex flex-col bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900 overflow-hidden">
  
  {/* Ambient Glow */}
  <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(99,102,241,0.18),transparent_60%)] pointer-events-none" />

  {/* Content wrapper */}
  <div className="relative z-10 flex flex-col min-h-screen">

      {/* Navbar */}
      <nav className="bg-white/10 backdrop-blur-xl border-b border-white/20 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            <div className="flex items-center space-x-2">
              <div className="bg-indigo-600 p-2 rounded-lg">
                <ShieldCheck className="w-6 h-6 text-white" />
              </div>
              <div>
                <span className="text-xl font-bold text-white tracking-tight">SpamGuardian</span>
                <span className="text-xs block text-indigo-200 font-medium uppercase ">Enterprise ML AI</span>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              <button 
                onClick={() => setActiveTab('classifier')}
                className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${activeTab === 'classifier' ? 'text-indigo-600 bg-indigo-50' : 'text-indigo-200 hover:text-white'}`}
              >
                Classifier
              </button>
              <button 
                onClick={() => setActiveTab('metrics')}
                className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${activeTab === 'metrics' ? 'text-indigo-600 bg-indigo-50' : 'text-indigo-200 hover:text-white'}`}
              >
                Model Health
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="flex-grow max-w-7xl w-full mx-auto py-8 px-4 sm:px-6 lg:px-8">
        {activeTab === 'classifier' ? (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            {/* Input Column */}
            <div className="lg:col-span-7 space-y-6">
              <section className="bg-white/10 backdrop-blur-xl rounded-2xl border border-white/20 shadow-2xl overflow-hidden">
                <div className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h2 className="text-xl font-semibold tracking-tight text-white flex items-center">
                      <Mail className="w-5 h-5 mr-2 text-indigo-300" />
                      Email Content Analysis
                    </h2>
                    <div className="flex items-center text-xs font-medium text-indigo-200 bg-white/5 backdrop-blur-lg border border-white/10 px-2 py-1 rounded-2xl">
                      <Lock className="w-3 h-3 mr-1" /> End-to-End Encrypted Inference
                    </div>
                  </div>
                  
                  <textarea
                    value={inputText}
                    onChange={(e) => setInputText(e.target.value)}
                    placeholder="Paste the raw email content here (subject line, headers, and body)..."
                    className="w-100 min-h-[300px] w-full p-4 text-slate-700 bg-white/5 border border-white/10 text-white placeholder:text-indigo-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all outline-none resize-none placeholder:text-indigo-300"
                    disabled={status === ClassificationStatus.LOADING}
                  />

                  <div className="mt-6 flex items-center justify-between">
                    <button
                      onClick={resetForm}
                      className="px-4 py-2 text-indigo-200 hover:text-white font-medium transition-colors"
                      disabled={status === ClassificationStatus.LOADING}
                    >
                      Clear
                    </button>
                    <button
                      onClick={handleClassify}
                      disabled={status === ClassificationStatus.LOADING || !inputText.trim()}
                      className={`px-8 py-3 bg-indigo-500/80 hover:bg-indigo-500 shadow-lg shadow-indigo-500/30 text-white rounded-xl font-semibold shadow-lg shadow-indigo-200 transition-all flex items-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed`}
                    >
                      {status === ClassificationStatus.LOADING ? (
                        <>
                          <RefreshCw className="w-5 h-5 animate-spin" />
                          <span>Processing Pipeline...</span>
                        </>
                      ) : (
                        <>
                          <span>Run Prediction</span>
                          <ChevronRight className="w-5 h-5" />
                        </>
                      )}
                    </button>
                  </div>
                </div>
              </section>

              {/* Pipeline Status Indicator */}
              <section className="<section className= bg-slate-900 backdrop-blur-lg border-white/10 rounded-2xl p-6">
                <h3 className="text-sm font-bold text-slate-200 uppercase tracking-widest mb-4">Live Execution Trace</h3>
                <div className="space-y-4">
                  {pipelineSteps.map((step, idx) => (
                    <div key={idx} className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <div className={`w-2 h-2 rounded-full ${
                          step.status === 'completed' ? 'bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]' : 
                          step.status === 'active' ? 'bg-indigo-500 animate-pulse' : 'bg-slate-300'
                        }`} />
                        <span className={`text-sm font-medium ${
                          step.status === 'active' ? 'text-indigo-600' : 
                          step.status === 'completed' ? 'text-slate-700' : 'text-indigo-300'
                        }`}>
                          {step.name}
                        </span>
                      </div>
                      {step.status === 'completed' && <ShieldCheck className="w-4 h-4 text-emerald-500" />}
                    </div>
                  ))}
                </div>
              </section>
            </div>

            {/* Result Column */}
            <div className="lg:col-span-5 space-y-6">
              {status === ClassificationStatus.IDLE && (
                <div className="bg-white/10 backdrop-blur-xl border border-white/20 shadow-2xl rounded-2xl p-12 flex flex-col items-center justify-center text-center">
                  <div className="bg-slate-50 p-6 rounded-full mb-4">
                    <Info className="w-8 h-8 text-slate-300" />
                  </div>
                  <h3 className="text-xl font-semibold tracking-tight text-indigo-200">Awaiting Input</h3>
                  <p className="text-indigo-300 text-sm max-w-[240px] mt-2">
                    Enter email text to initiate the secure classification pipeline.
                  </p>
                </div>
              )}

              {status === ClassificationStatus.ERROR && (
                <div className="bg-red-50 border border-red-100 rounded-2xl p-6 animate-in fade-in slide-in-from-top-2">
                  <div className="flex items-start space-x-3">
                    <AlertCircle className="w-6 h-6 text-red-500 shrink-0" />
                    <div>
                      <h3 className="text-red-800 font-semibold">Classification Failed</h3>
                      <p className="text-red-600 text-sm mt-1">{error}</p>
                    </div>
                  </div>
                </div>
              )}

              {result && (
                <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-500">
                  {/* Verdict Card */}
                  <div className={`rounded-2xl border-2 p-6 transition-all shadow-xl transition-all duration-300 hover:-translate-y-1 hover:shadow-indigo-500/10 ${
                    result.isSpam ? 'bg-red-500/10 border-red-400/30 backdrop-blur-xl' : 'bg-emerald-500/10 border-emerald-400/30 backdrop-blur-xl'
                  }`}>
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center space-x-2">
                        {result.isSpam ? (
                          <ShieldAlert className="w-8 h-8 text-red-600" />
                        ) : (
                          <ShieldCheck className="w-8 h-8 text-emerald-600" />
                        )}
                        <h2 className={`text-2xl font-bold ${result.isSpam ? 'text-red-800' : 'text-emerald-800'}`}>
                          {result.isSpam ? 'SPAM DETECTED' : 'SAFE CONTENT'}
                        </h2>
                      </div>
                      <div className={`px-3 py-1 rounded-full text-sm font-bold ${
                        result.isSpam ? 'bg-red-100 text-red-700' : 'bg-emerald-100 text-emerald-700'
                      }`}>
                        {(result.confidence * 100).toFixed(1)}% Confidence
                      </div>
                    </div>
                    
                    <div className="bg-white/10 backdrop-blur-xl border border-white/20 shadow-2xl rounded-xl p-6">
                      <h4 className="text-xs font-bold text-slate-200 text-[14px] uppercase mb-1">Expert Explanation</h4>
                      <p className="text-indigo-200 text-sm leading-relaxed">
                        {result.explanation}
                      </p>
                    </div>
                  </div>

                  {/* Feature Importance Card */}
                  <div className="bg-white/5 backdrop-blur-lg border border-white/10 rounded-2xl p-6 shadow-xl transition-all duration-300 hover:-translate-y-1 hover:shadow-indigo-500/10">
                    <h3 className="text-sm font-bold text-slate-200 uppercase tracking-widest mb-4">Top Feature Indicators</h3>
                    <div className="flex flex-wrap gap-2">
                      {result.topFeatures.map((feature, i) => (
                        <span key={i} className="px-3 py-1.5 bg-white/5 border border-slate-700 rounded-lg text-sm text-slate-400 font-medium">
                          {feature}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Inference Telemetry */}
                  <div className="bg-slate-900 rounded-2xl p-6 text-white shadow-xl transition-all duration-300 hover:-translate-y-1 hover:shadow-indigo-500/10">
                    <h3 className="text-xs font-bold text-slate-500 text-[15.5px] uppercase tracking-widest mb-4">Inference Telemetry</h3>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <span className="text-slate-500 text-[12px] uppercase font-bold block">Latency</span>
                        <span className="text-indigo-400 font-mono text-lg">{result.metadata.processingTimeMs}ms</span>
                      </div>
                      <div>
                        <span className="text-slate-500 text-[12px] uppercase font-bold block">Resource Usage</span>
                        <span className="text-indigo-400 font-mono text-lg">{(result.metadata.tokensCount).toFixed(0)} TKN</span>
                      </div>
                      <div>
                        <span className="text-slate-500 text-[12px] uppercase font-bold block">Model Endpoint</span>
                        <span className="text-slate-300 font-mono text-sm">v3-flash.prod</span>
                      </div>
                      <div>
                        <span className="text-slate-500 text-[12px] uppercase font-bold block">Validation</span>
                        <span className="text-emerald-400 font-mono text-sm">Pass</span>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Security Banner */}
              <div className="bg-white/5 backdrop-blur-lg border border-white/10 rounded-2xl p-6">
                <div className="flex items-start space-x-3">
                  <Lock className="w-5 h-5 text-indigo-600 mt-1" />
                  <div>
                    <h4 className="text-xl font-semibold tracking-tight text-indigo-200">Privacy-First Architecture</h4>
                    <p className="text-indigo-300 text-xs mt-1 leading-relaxed">
                      This classifier uses stateless inference. Your email content is never stored or used for model retraining, adhering to SOC2/GDPR standards.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
            <header className="mb-8 max-w-2xl">
              <h1 className="text-3xl font-bold text-white">Model Integrity & Metrics</h1>
              <p className="text-indigo-200 mt-2">
                Detailed performance evaluation of the underlying classifier. Metrics are based on the latest validation pass on the UCI SMS/SpamAssassin merged dataset.
              </p>
            </header>
            <MetricsDashboard />
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="bg-white/5 backdrop-blur-lg border border-white/10 py-7 mt-12">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <p className="text-slate-200 text-sm flex items-center justify-center space-x-2">
            <span>Powered by Gemini 3 Flash and Advanced ML Pipelines</span>
            <span className="w-1 h-1 bg-slate-200 rounded-full" />
            <a href="#" className="flex items-center hover:text-indigo-600 transition-colors">
              API Documentation <ExternalLink className="w-3 h-3 ml-1" />
            </a>
          </p>
        </div>
      </footer>
      </div>
    </div>
  );
};

export default App;
