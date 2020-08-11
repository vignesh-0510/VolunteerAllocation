const express = require('express')
const nodemailer = require('nodemailer')
const router = express.Router()

const Volunteer = require('../models/volunteer')
const VolunteerSkills = require('../models/availableVolunteerSkills')

router.post('/', (req,res) => {
  res.send(req.body);
  console.log(req.body)
  var skills = []
  for(var i=0;i<req.body.label.length;i++){
    VolunteerSkills.findOne({label:req.body.label[i]}, (err,result) => {
      if(err || !result){
        console.log(err)
      }
      else{
        skills.push(result.skills)
        if(skills.length===req.body.label.length){
          if(req.body.naive_skills !== ''){
            skills.push(req.body.naive_skills)
          }
          const new_volunteer = new Volunteer({
            name: req.body.name,
            email: req.body.email,
            skills: skills.join('-'),
            can_serve: parseInt(req.body.peoples_to_serve)
          })
          new_volunteer.save()
          .then(data => console.log(data))
          .catch(err => conosole.log(err))
        }
      }
    })
  }
  var auth = {
    user: process.env.USERNAME,
    pass: process.env.PASSWORD
  }

  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: auth
  })

  var message = `<html><h3 style="color:#ED5565;background-color:black;border-radius:10px;padding:15px;">Heyyy ${req.body.name} !!!<br><br>Thanks for being the part of this noble initiative of helping people and a family member of Ask Foundation.<br><br>You will be notified as soon as possible when there will be someone who needs your help.</h3></html>`

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
