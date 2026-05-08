const express = require('express');
const axios = require('axios');
const Analysis = require('../models/Analysis');
const authMiddleware = require('../middleware/authMiddleware');

const router = express.Router();

// Use authMiddleware for all routes
router.use(authMiddleware);

router.post('/', async (req, res) => {
  try {
    const { text } = req.body;
    if (!text || text.trim().length === 0) {
      return res.status(422).json({ error: 'Text is required' });
    }

    // Call ML Service
    const mlUrl = process.env.ML_SERVICE_URL || 'http://localhost:8001';
    let mlResponse;
    try {
      mlResponse = await axios.post(`${mlUrl}/predict`, { text });
    } catch (mlErr) {
      return res.status(500).json({ error: 'ML Service unavailable' });
    }

    const data = mlResponse.data;

    const analysis = new Analysis({
      userId: req.user._id,
      inputText: text,
      label: data.label,
      confidence: data.confidence,
      fakeProbability: data.fake_probability,
      realProbability: data.real_probability,
      suspiciousWords: data.top_suspicious_words || []
    });

    await analysis.save();
    res.status(200).json(analysis);

  } catch (error) {
    console.error('Analyze error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

router.get('/history', async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const label = req.query.label;

    const query = { userId: req.user._id };
    if (label && (label === 'FAKE' || label === 'REAL')) {
      query.label = label;
    }

    const total = await Analysis.countDocuments(query);
    const analyses = await Analysis.find(query)
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit);

    res.json({
      total,
      page,
      pages: Math.ceil(total / limit),
      data: analyses
    });
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

router.get('/stats', async (req, res) => {
  try {
    const analyses = await Analysis.find({ userId: req.user._id });
    const total = analyses.length;
    const fakeCount = analyses.filter(a => a.label === 'FAKE').length;
    const realCount = total - fakeCount;

    // Recent activity (last 7 days counts)
    const recentActivity = [];
    for (let i = 6; i >= 0; i--) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      const dateStr = d.toISOString().split('T')[0];
      
      const count = analyses.filter(a => a.createdAt.toISOString().split('T')[0] === dateStr).length;
      recentActivity.push({ date: dateStr, count });
    }

    res.json({ total, fakeCount, realCount, recentActivity });
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

router.delete('/:id', async (req, res) => {
  try {
    const analysis = await Analysis.findById(req.params.id);
    if (!analysis) return res.status(404).json({ error: 'Not found' });

    if (analysis.userId.toString() !== req.user._id) {
      return res.status(403).json({ error: 'Forbidden' });
    }

    await Analysis.deleteOne({ _id: analysis._id });
    res.json({ message: 'Deleted' });
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;
