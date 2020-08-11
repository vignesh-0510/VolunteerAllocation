const mongoose = require('mongoose')

const RecipientSchema = mongoose.Schema({
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
    priorities: {
        type: Object,
        required: true
    }
})

module.exports = mongoose.model('Recipient',RecipientSchema)
