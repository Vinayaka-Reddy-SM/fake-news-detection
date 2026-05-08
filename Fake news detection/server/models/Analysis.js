const mongoose = require('mongoose');

const AnalysisSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  inputText: { type: String, required: true },
  label: { type: String, required: true, enum: ['FAKE', 'REAL'] },
  confidence: { type: Number, required: true },
  fakeProbability: { type: Number, required: true },
  realProbability: { type: Number, required: true },
  suspiciousWords: [{ type: String }],
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Analysis', AnalysisSchema);
