const mongoose = require('mongoose')

const VictimSelectLabelsSchema = mongoose.Schema({
    label: {
        type: Object,
        required: true
    }
})

module.exports = mongoose.model('victim-select-labels',VictimSelectLabelsSchema)
