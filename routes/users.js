const JWT_SECRET = 'ilovemyselfmorethanyoucankthinkof'
import express from 'express'
import {z} from 'zod'
import jwt from 'jsonwebtoken'
import bcrypt from 'bcrypt'
import mongoose from 'mongoose';
import {umodel,cmodel} from './db.js'
const router = express.Router();
router.use(express.json());

router.post('/signup',async (req,res)=>{
    const body = req.body
    const username = body.username, password = body.password

    try {
        const User = {
            username : z.string().min(5).max(25),
            password : z.string().min(5).max(50)
        }
        const parseResult = User.safeParse({username,password})
        if(parseResult.success){
            await umodel.create({
                username,
                password : await bcrypt.hash(password,5),
                isAdmin : false 
            })
            res.json({
                message : "You are signed up"
            })
        }
        else{
            res.status(403).json({
                message : "Invalid Credentials"
            })
        }
    }
    catch(err){
        res.status(403).json({
            message : "User already exists"
        })

    }
})

router.post('/login',async (req,res)=>{
    const body = req.body;
    const {username, password} = body;
    const curUser = await umodel.findOne({
        username
    })
    if(!curUser){
        res.status(403).json({
            message : "User doesn't exist"
        })
    }
    else{
        if(await bcrypt.compare(password,curUser.password)){
            res.json({
                message : "You are logged in",
                token : jwt.sign({
                    id : curUser._id,
                    isAdmin : curUser.isAdmin
                })
            })
        }
        else{
            res.status(403).json({
                message : "Entered password does not match"
            })
        }
    }

})