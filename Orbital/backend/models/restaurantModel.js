const mongoose = require('mongoose');

const restaurantSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, unique: true },
  name: { type: String, required: true },
  yearEstablished: { type: Number },
  about: { type: String },
  address: { type: String },
  hygieneCertUrl: { type: String },
  recommendedItems: [{ type: String }],
});

module.exports = mongoose.model('Restaurant', restaurantSchema);

