const mongoose = require('mongoose');

const planetsSchema = new mongoose.Schema({
  keplerName: {
    type: String,
    required: true,
  },
});

// Connects launches schema wiht the "planets" collection
module.exports = mongoose.model('Planet', planetsSchema);