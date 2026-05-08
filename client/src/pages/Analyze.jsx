import { useState } from 'react';
import api from '../api/axios';
import toast from 'react-hot-toast';

const Analyze = () => {
  const [text, setText] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);

  const handleAnalyze = async () => {
    if (text.trim().length < 10) {
      toast.error('Text is too short. Please provide more context.');
      return;
    }
    setLoading(true);
    setResult(null);
    try {
      const res = await api.post('/analyze', { text });
      setResult(res.data);
      toast.success('Analysis complete!');
    } catch (err) {
      toast.error(err.response?.data?.error || 'Analysis failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Analyze Article</h1>
      
      {!result ? (
        <div className="space-y-4">
          <div className="relative">
            <textarea
              className="w-full h-64 p-4 border border-gray-300 dark:border-gray-600 rounded-xl bg-white dark:bg-darkCard focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all resize-none text-lg"
              placeholder="Paste news article text here (minimum 100 words recommended)..."
              value={text}
              onChange={(e) => setText(e.target.value)}
            />
            <div className="absolute bottom-4 right-4 text-sm text-gray-400">
              {text.length} characters
            </div>
          </div>
          <div className="flex justify-end gap-4">
            <button className="px-6 py-2 text-gray-500 hover:text-gray-700 dark:hover:text-gray-300 font-medium" onClick={() => setText('')}>
              Clear
            </button>
            <button 
              className="btn-primary px-8" 
              onClick={handleAnalyze} 
              disabled={loading || text.length === 0}
            >
              {loading ? 'Analyzing...' : 'Analyze'}
            </button>
          </div>
        </div>
      ) : (
        <div className="bg-white dark:bg-darkCard rounded-2xl p-8 shadow-sm border border-gray-100 dark:border-gray-800 animate-fadeIn">
          <div className="text-center mb-10">
            <div className={`inline-block px-6 py-2 rounded-full text-xl font-bold mb-4 border-2 ${
              result.label === 'FAKE' ? 'bg-red-100 text-red-600 border-red-500 animate-pulse' : 'bg-green-100 text-green-600 border-green-500'
            }`}>
              {result.label === 'FAKE' ? '🔴 FAKE NEWS' : '🟢 REAL NEWS'}
            </div>
            <h2 className="text-4xl font-extrabold">{(result.confidence * 100).toFixed(1)}% Confident</h2>
          </div>

          <div className="space-y-6 mb-10 max-w-2xl mx-auto">
            <div>
              <div className="flex justify-between mb-2 text-sm font-medium">
                <span>Fake Probability</span>
                <span>{(result.fakeProbability * 100).toFixed(1)}%</span>
              </div>
              <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-4 overflow-hidden">
                <div 
                  className="bg-red-500 h-4 rounded-full transition-all duration-1000 ease-out"
                  style={{ width: `${result.fakeProbability * 100}%` }}
                ></div>
              </div>
            </div>
            <div>
              <div className="flex justify-between mb-2 text-sm font-medium">
                <span>Real Probability</span>
                <span>{(result.realProbability * 100).toFixed(1)}%</span>
              </div>
              <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-4 overflow-hidden">
                <div 
                  className="bg-green-500 h-4 rounded-full transition-all duration-1000 ease-out"
                  style={{ width: `${result.realProbability * 100}%` }}
                ></div>
              </div>
            </div>
          </div>

          {result.label === 'FAKE' && result.suspiciousWords?.length > 0 && (
            <div className="mb-10">
              <h3 className="text-lg font-bold mb-4 text-center">Top Suspicious Words</h3>
              <div className="flex flex-wrap gap-2 justify-center">
                {result.suspiciousWords.map((word, i) => (
                  <span key={i} className="px-3 py-1 bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 rounded-full text-sm font-medium border border-gray-200 dark:border-gray-700">
                    {word}
                  </span>
                ))}
              </div>
            </div>
          )}

          <div className="flex justify-center">
            <button className="btn-primary" onClick={() => { setText(''); setResult(null); }}>
              Analyze Another Article
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Analyze;
