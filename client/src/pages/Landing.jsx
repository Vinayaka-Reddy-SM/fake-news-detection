import { Link } from 'react-router-dom';
import { Shield, Zap, History } from 'lucide-react';

const Landing = () => {
  return (
    <div className="min-h-[calc(100vh-64px)] flex flex-col">
      {/* Hero */}
      <div className="flex-grow flex flex-col items-center justify-center text-center px-4 py-20 bg-gradient-to-b from-transparent to-gray-100 dark:to-gray-900/50">
        <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight mb-6">
          Detect <span className="text-transparent bg-clip-text bg-gradient-to-r from-fake to-orange-500">Fake News</span><br />
          in Seconds
        </h1>
        <p className="text-xl md:text-2xl text-gray-600 dark:text-gray-400 max-w-3xl mb-10">
          Powered by machine learning trained on 70,000+ articles. Instantly verify the credibility of any news text.
        </p>
        <Link to="/analyze" className="btn-primary text-lg px-8 py-4 rounded-full font-semibold shadow-lg shadow-primary/30 animate-pulse hover:animate-none">
          Start Analyzing Now
        </Link>
      </div>

      {/* Stats Bar */}
      <div className="bg-white dark:bg-darkCard border-y border-gray-200 dark:border-gray-800 py-6">
        <div className="max-w-7xl mx-auto px-4 flex flex-wrap justify-center gap-8 md:gap-16 text-center text-sm md:text-base font-medium text-gray-500 dark:text-gray-400">
          <span>🎯 72K+ articles trained</span>
          <span>⚡ 95%+ accuracy</span>
          <span>🎓 Trusted by researchers</span>
        </div>
      </div>

      {/* Features */}
      <div className="py-20 px-4 max-w-7xl mx-auto">
        <div className="grid md:grid-cols-3 gap-8">
          <div className="p-6 rounded-2xl bg-white dark:bg-darkCard shadow-sm border border-gray-100 dark:border-gray-800">
            <div className="w-12 h-12 rounded-lg bg-blue-100 dark:bg-blue-900/30 text-blue-600 flex items-center justify-center mb-4">
              <Zap size={24} />
            </div>
            <h3 className="text-xl font-bold mb-2">Instant Results</h3>
            <p className="text-gray-600 dark:text-gray-400">Get immediate predictions using our optimized Logistic Regression model.</p>
          </div>
          <div className="p-6 rounded-2xl bg-white dark:bg-darkCard shadow-sm border border-gray-100 dark:border-gray-800">
            <div className="w-12 h-12 rounded-lg bg-green-100 dark:bg-green-900/30 text-green-600 flex items-center justify-center mb-4">
              <Shield size={24} />
            </div>
            <h3 className="text-xl font-bold mb-2">Confidence Score</h3>
            <p className="text-gray-600 dark:text-gray-400">See exact probabilities for fake vs real, plus the words that influenced the decision.</p>
          </div>
          <div className="p-6 rounded-2xl bg-white dark:bg-darkCard shadow-sm border border-gray-100 dark:border-gray-800">
            <div className="w-12 h-12 rounded-lg bg-purple-100 dark:bg-purple-900/30 text-purple-600 flex items-center justify-center mb-4">
              <History size={24} />
            </div>
            <h3 className="text-xl font-bold mb-2">Analysis History</h3>
            <p className="text-gray-600 dark:text-gray-400">Keep track of everything you've analyzed in your personal dashboard.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Landing;
