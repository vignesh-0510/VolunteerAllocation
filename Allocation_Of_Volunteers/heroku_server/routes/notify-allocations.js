const express = require('express')
const nodemailer = require('nodemailer')
const router = express.Router()

const Results = require('../models/results')
const Volunteers = require('../models/volunteer')
const Recipients = require('../models/recipient')

router.get('/', async (req,res) => {
   res.send('Messages are being sent')

   const send_notification_to_victim = async (result) => {
      var message = `Heyyy ${result.name} !!!<br><br>We hope you are doing great<br><br>Some volunteers have been alloted to help you.Their name, contact info. and skills are mentioned below.<br><br>`
      for(const volunteer of result.volunteers_allocated){
         message = message.concat(`name: ${volunteer.name} | email: ${volunteer.email} | skills: ${volunteer.skills[0].join(' & ')}<br><br>`)
      }
      message = message.concat('We are so fortunate to serve you.<br><br>Thanks for being a member of Ask Foundation family, Have a nice life ahead.')
      var auth = {
         user: process.env.USERNAME,
         pass: process.env.PASSWORD
      }

      var html_message = `<html><h3 style="color:#ED5565;background-color:black;border-radius:10px;padding:15px;">${message}</h3></html>`

      const transporter = nodemailer.createTransport({
         service: 'gmail',
         auth: auth
      })
      const metaData = {
         from: 'askfoundation.1709@gmail.com',
         to: result.email,
         subject: 'Allocation notification from Ask Foundation!!!',
         html: html_message
      }
      
      const send = (metaData) => {
         return new Promise(function (resolve, reject){
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
      }
      await send(metaData).catch(console.error)
   }

   const send_notification_to_volunteer = async (volunteer_name,volunteer_email,recipient_name,recipient_email) => {
      var auth = {
         user: process.env.USERNAME,
         pass: process.env.PASSWORD
      }

      const transporter = nodemailer.createTransport({
         service: 'gmail',
         auth: auth
      })

      var html_message = `<html><h3 style="color:#ED5565;background-color:black;border-radius:10px;padding:15px;">Heyyy ${volunteer_name} !!! <br><br>You have been allocated to help the victim whose details are mentioned below. You can contact him via his/her email-id(also mentioned below).<br><br>    Victim Name: ${recipient_name} <br>    Victim Email-id: ${recipient_email}<br><br>Thanks for volunteering and being the part of such a noble cause of helping people. Have a nice life ahead.</h3></html>`

      const metaData = {
         from: 'askfoundation.1709@gmail.com',
         to: volunteer_email,
         subject: 'Allocation notification from Ask Foundation!!!',
         html: html_message
      }

      const send = (metaData) => {
         return new Promise(function (resolve, reject){
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
      }
      await send(metaData).catch(console.error)
   }

   var map1 = new Map()
   var map2 = new Map()

   const results = await Results.find({})
   for(const result of results){
      if(result.skills.length===0){
         await Recipients.findOneAndRemove({_id: result.id}, (err,data) => {
            if(err){
               console.log('Unable to delete try again later.')
            }
            else{
               console.log('ArtWork successfully deleted.')
            }
         })
      }
      send_notification_to_victim(result)
      for(const volunteer of result.volunteers_allocated){
         if(!map1.has(volunteer._id)){
            map1.set(volunteer._id,volunteer.can_serve)   
         }
         if(!map2.has(volunteer._id)){
            map2.set(volunteer._id,1)
         }
         else{
            map2.set(volunteer._id,map2.get(volunteer._id)+1)
         }
         send_notification_to_volunteer(volunteer.name,volunteer.email,result.name,result.email)
      }
      console.log(result)
   }
   for(var entry of map1.entries()){
      var x = entry[1] - map2.get(entry[0])
      if(x===0){
         await Volunteers.findOneAndRemove({_id: entry[0]}, (err,data) => {
            if(err){
               console.log('Unable to delete try again later.')
            }
            else{
               console.log('ArtWork successfully deleted.')
            }
         })
      }
      else{
         await Volunteers.findOneAndUpdate({_id: entry[0]},{can_serve: x}, (err,data) => {
            if(err){
               console.log(err)
            }
            else{
               console.log(data)
            }
         })
      }
   }

   await Results.collection.drop().catch(console.error)
})

module.exports = router
