import express from 'express'
import router from './routes/routes'
import bodyParser from 'body-parser' 
import path from 'path'
const app = express()
app.use(bodyParser.json())
app.use((req,res,next)=>{
  console.log(`${req.method} :  ${req.url} `)
  next()
})
app.use(bodyParser.urlencoded({ extended: true }))
app.use('/api', router)
app.use('/stock',express.static(path.join(__dirname,'./public')));
app.use('/check',(req,res,next)=>{
  res.json({'message':'service online',env:process.env,headers:req.headers})
})



module.exports = app