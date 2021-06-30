const express = require('express')
const fileUpload = require('express-fileupload')
const fs = require('fs')
const mongoose = require('mongoose')
const mongodb = require('mongodb')
const Count = require('./Count')
const path = require('path')
const cors = require('cors')
require('colors')
require('dotenv').config()
mongoose.connect('mongodb://localhost:27017/dct',err=>{
        if(err) return console.error(err)
        console.log('Connected to DB'.underline.blue)
    })
const app = express()
app.use(cors())
app.use(fileUpload());
app.use(express.json())
// app.use(express.urlencoded())
// app.post('/upload', (req,res)=> {
//     sampleFile = req.files.sampleFile
//     res.sendFile((path.join(__dirname,'/temp/',sampleFile.name)))
// })
app.delete('/users', async(req,res)=>{
    try{
        await Count.deleteMany({})
        res.send({success:true})
    }catch(err){console.log(`err`, err)}
})
app.delete('/users/:id', async(req,res)=>{
    try{
        let response = await Count.deleteOne({_id:req.params.id})
        res.send({success:true,response})
    }catch(err){console.log(`err`, err)}
})
app.get('/users',async (req,res)=> {
    try{
        res.json(await Count.find({}))
        console.log("after")
    }catch(err){res.status(500)}
})
app.post('/users',async (req,res)=>{
    const {email,username,password,account} = req.body
    console.log(req.body)

    try {
        const response = await Count.create({email,username,password,account})
        res.json({data:response,success:true})
        console.log("after try",response)
    }catch(err){
        console.log(err)
        res.status(500).json({success:false,err})
    }
})
app.post('/userlogin', async (req,res)=>{
    const {email,password} = req.body
    try{
        const response = await Count.findOne({email:email})
        console.log(`response login`, response)
        console.log(response.password, req.body)
        if(response.password!==password){
            res.status(400).json({sucess:false,message:"Invalid Details"})
        }else{
            res.status(200).json({success:true,data:response})
        }

    }catch(err){
        console.log(err)
    }
})
app.post('/checklogin', async (req,res)=> {
    try {
        const response = await Count.find({username:req.body.username})
        console.log(response)
        if(!response.data || !response[0].password!=req.body.password) res.status(404).json({success:false,message:"Invalid Credentials"})
        else res.json({success:true})
    }catch(err){
        res.status(500)
    }
})
app.put('/users', async (req,res)=> {
    
    try {
        const response = await Count.findOneAndUpdate({_id:req.body.id},{...req.body})
        res.json(response)
    }catch(err){
        res.status(400).json({success:false,err:err})
        console.log(`err`, err)
    }
})
PORT = process.env.PORT
app.listen(4000,()=>console.log('running on port ',4000))