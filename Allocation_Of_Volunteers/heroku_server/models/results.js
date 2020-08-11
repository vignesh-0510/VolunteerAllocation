const mongoose = require('mongoose')

const ResultSchema = mongoose.Schema({
  id: {
    type: Object,
    required: true
  },
  name: {
    type: Object,
    required: true
  },
  email: {
    type: Object,
    required: true
  },
  skills: {
    type: Object,
    required: true
  },
  volunteers_allocated: {
    type: Object,
    require: true
  }
})

module.exports = mongoose.model('Result',ResultSchema)
