const express = require('express')
const nodemailer = require('nodemailer')
const router = express.Router()

const Recipient = require('../models/recipient')
const RecipientSkills = require('../models/availableRecipientSkills')

router.post('/', (req,res) => {
  res.send(req.body);
  console.log(req.body)
  RecipientSkills.findOne({label:req.body.label},(err,result) => {
    if(err || !result){
      console.log(err)
    }
    else{
      const new_recipient = new Recipient({
        name: req.body.name,
        email: req.body.email,
        skills: result.skills,
        priorities: result.priorities
      })
      new_recipient.save()
      .then(data => console.log(data))
      .catch(err => conosole.log(err))
    }
  })
  var auth = {
    user: process.env.USERNAME,
    pass: process.env.PASSWORD
  }

  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: auth
  })

  var message = `<html><h3 style="color:#ED5565;background-color:black;border-radius:10px;padding:15px;">Heyyy ${req.body.name} !!!<br><br>Thanks for being a family member of Ask Foundation.<br><br>You will be notified as soon as possible when there will be someone who can help you.</h3></html>`

  const metaData = {
    from: 'askfoundation.1709@gmail.com',
    to: req.body.email,
    subject: 'Confirmation email from Ask Foundation!!!',
    html: message
  }
  transporter.sendMail(metaData,(err,info)=>{
    if(err){
        console.log(err)
    }
    else{
        console.log('The message is sent!')
        console.log(info)
    }
  })
})

module.exports = router
