const mongoose = require('mongoose')

const VolunteerSkillLabelsSchema = mongoose.Schema({
    label: {
        type: Object,
        required: true
    }
})

module.exports = mongoose.model('volunteer-skill-labels',VolunteerSkillLabelsSchema)
