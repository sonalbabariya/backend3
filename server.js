import express, { json } from 'express'
import cors from 'cors'
import fs from 'fs'
import {arr as data} from './dataBase.js'

const app = express();
app.use(express.json());
// app.use(cors({
//     origin: 'http://localhost:5173',
//     methods: ["GET","POST","PUT","DELETE"],
//     credentials: true
// }));

app.get('/api/getData', (req,res) => {
    try {
        res.send(data)
    } catch (error) {
        console.log(error.message);
    }
})

app.post('/api/createData', (req,res) => {
    try {
        const {userName , email} = req.body;
        data.push({userName , email , id : Date.now()})
        fs.writeFileSync('./dataBase.js', `export const arr = ${JSON.stringify(data,null,2)}`)
        res.send({message: "Data Created Sucessfully!"})
    } catch (error) {
        console.log(error.message)
    }
})

app.get('/api/getsingleData/:userId', (req,res) => {
    try {
        const {userId} = req.params
        const singleData = data.find(info => info.id === Number(userId))
        if(singleData === undefined){
            res.send({message: "User Not Found"})
        }else{
            res.send({user : singleData})
        }
    } catch (error) {
        console.log(error.message);
    }
})

app.delete('/api/deleteData/:userId', (req,res) => {
    try {
        const index = data.findIndex(info => info.id === Number(req.params.userId))
        if (index !== -1) {
            data.splice(index,1)
            fs.writeFileSync('./dataBase.js', `export const arr = ${JSON.stringify(data,null,2)}`)
            res.send({message: "Data Deleted Sucessfully!"})
        }else{
            res.send({message: "User Not Found"})
        }
    } catch (error) {
        console.log(error.message);
    }
})

app.post('/api/updateData/:userId', (req,res) => {
    try {
        const index = data.findIndex(info => info.id === Number(req.params.userId))
        if (index !== -1) {
            const obj = {userName :req.body.userName ,email:req.body.email, id : Number(req.params.userId)}
            data.splice(index,1,obj)
            fs.writeFileSync('./dataBase.js', `export const arr =${JSON.stringify(data,null,2)}`)
            res.send({message: "Data Updated Sucessfully!"})
        }else{
            res.send({message: "User Not Found"})
        }
    } catch (error) {
        console.log(error.message);
    }
})

app.listen(8080,() => {
    console.log("Server is running on port 8080")
})