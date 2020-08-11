const express = require('express')
const mongoose = require('mongoose')
require('dotenv/config')

const app = express()

app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header('Access-Control-Allow-Methods','GET,POST')
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});

app.use(express.json())
app.use(express.urlencoded({ extended: false}))

app.use('/register-volunteer',require('./routes/register-volunteer'))
app.use('/register-recipient',require('./routes/register-recipient'))
app.use('/get-recipient-labels',require('./routes/recipient-labels'))
app.use('/get-volunteer-labels',require('./routes/volunteer-labels'))
app.use('/notify-allocations',require('./routes/notify-allocations'))

app.get('/',(req,res)=>{
  res.send('Hello there!!! I am server.')
})

mongoose.connect(process.env.DB_CONNECTION,
  { useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false },
  (error) => {
    if(error){
      console.log(error)
    }
    else{
      console.log('Connected to DB!!!')
    }
  }
)



const port = process.env.PORT || 4000

app.listen(port,()=>console.log(`Server is up and running!!! at http://localhost:${port}` ))
