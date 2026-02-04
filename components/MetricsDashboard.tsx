
import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell, PieChart, Pie } from 'recharts';
import { MOCK_TRAINING_METRICS, TF_IDF_EXPLANATION } from '../constants.ts';

const MetricsDashboard: React.FC = () => {
  const barData = [
    { name: 'Accuracy', value: MOCK_TRAINING_METRICS.accuracy * 100 },
    { name: 'Precision', value: MOCK_TRAINING_METRICS.precision * 100 },
    { name: 'Recall', value: MOCK_TRAINING_METRICS.recall * 100 },
    { name: 'F1 Score', value: MOCK_TRAINING_METRICS.f1Score * 100 },
  ];

  const pieData = [
    { name: 'True Positive', value: MOCK_TRAINING_METRICS.confusionMatrix.tp, color: '#10b981' },
    { name: 'True Negative', value: MOCK_TRAINING_METRICS.confusionMatrix.tn, color: '#3b82f6' },
    { name: 'False Positive', value: MOCK_TRAINING_METRICS.confusionMatrix.fp, color: '#f43f5e' },
    { name: 'False Negative', value: MOCK_TRAINING_METRICS.confusionMatrix.fn, color: '#f59e0b' },
  ];

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 p-4">
      <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
        <h3 className="text-lg font-semibold text-slate-800 mb-4">Core Model Performance</h3>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={barData} layout="vertical" margin={{ left: 20 }}>
              <CartesianGrid strokeDasharray="3 3" horizontal={true} vertical={false} />
              <XAxis type="number" domain={[0, 100]} hide />
              <YAxis dataKey="name" type="category" width={80} tick={{ fontSize: 12 }} />
              <Tooltip formatter={(value: number) => [`${value.toFixed(1)}%`, 'Score']} />
              <Bar dataKey="value" fill="#6366f1" radius={[0, 4, 4, 0]} barSize={24} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
        <h3 className="text-lg font-semibold text-slate-800 mb-4">Confusion Matrix (Validation)</h3>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={pieData}
                innerRadius={60}
                outerRadius={80}
                paddingAngle={5}
                dataKey="value"
              >
                {pieData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>
        <div className="grid grid-cols-2 gap-2 text-xs mt-2">
          {pieData.map(item => (
            <div key={item.name} className="flex items-center space-x-2">
              <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }} />
              <span className="text-slate-600 font-medium">{item.name}: {item.value}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="lg:col-span-2 bg-slate-50 p-6 rounded-xl border border-slate-200">
        <h3 className="text-sm font-bold text-slate-500 uppercase tracking-wider mb-2">Model Architecture Insights</h3>
        <p className="text-slate-700 leading-relaxed text-sm">
          {TF_IDF_EXPLANATION}
        </p>
        <div className="mt-4 flex flex-wrap gap-2">
          <span className="px-2 py-1 bg-white border border-slate-200 rounded text-xs text-slate-600 font-medium">Pipeline: Logistic Regression</span>
          <span className="px-2 py-1 bg-white border border-slate-200 rounded text-xs text-slate-600 font-medium">Vocabulary: 20,000 max_features</span>
          <span className="px-2 py-1 bg-white border border-slate-200 rounded text-xs text-slate-600 font-medium">Stopwords: NLTK English</span>
          <span className="px-2 py-1 bg-white border border-slate-200 rounded text-xs text-slate-600 font-medium">N-Grams: (1, 2)</span>
        </div>
      </div>
    </div>
  );
};

export default MetricsDashboard;
