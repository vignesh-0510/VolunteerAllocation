const mongoose = require('mongoose')

const RecipientSkillsSchema = mongoose.Schema({
    label: {
        type: Object,
        required: true
    },
    skills: {
        type: Object,
        required: true
    },
    priorities: {
        type: Object,
        required: true
    }
})

module.exports = mongoose.model('recipient-skills',RecipientSkillsSchema)
