const mongoose = require('mongoose');

const VisualizationSchema = new mongoose.Schema({
  visualizationId: { type: String, required: true },
  reportType: { type: String, required: true },
  imageUrl: { type: String, required: true },
  imagePublicId: { type: String },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Visualization', VisualizationSchema);
