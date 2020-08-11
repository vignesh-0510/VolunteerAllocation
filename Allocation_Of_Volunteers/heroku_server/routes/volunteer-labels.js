const express = require('express')

const router = express.Router()

const Labels = require('../models/volunteer-skill-labels')

router.get('/', (req,res) => {
    Labels.find({})
   .then(labels => {
      console.log(labels)
      res.send(labels)
   })
})

module.exports = router
