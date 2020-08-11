const mongoose = require('mongoose')

const VolunteerSchema = mongoose.Schema({
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
  can_serve: {
    type: Object,
    require: true
  }
})

module.exports = mongoose.model('Volunteer',VolunteerSchema)
