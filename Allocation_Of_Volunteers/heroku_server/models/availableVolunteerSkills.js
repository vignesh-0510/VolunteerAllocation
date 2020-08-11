const mongoose = require('mongoose')

const VolunteerSkillsSchema = mongoose.Schema({
    label: {
        type: Object,
        required: true
    },
    skills: {
        type: Object,
        required: true
    }
})

module.exports = mongoose.model('volunteer-skills',VolunteerSkillsSchema)
