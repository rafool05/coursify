const JWT_SECRET = 'ilovemyselfmorethanyoucankthinkof'
import express from 'express'
import {z} from 'zod'
import jwt from 'jsonwebtoken'
import bcrypt from 'bcrypt'
import {umodel,cmodel} from '../db.js'
import {auth} from "../index.js"
const router = express.Router();
router.use(express.json());

router.post('/signup',async (req,res)=>{
    const body = req.body
    const username = body.username, password = body.password

    try {
        const User = z.object({
            username : z.string().min(5).max(25),
            password : z.string().min(5).max(50)
        })
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
router.post('/courses/:id',auth,async(req,res)=>{
    if(!(await cmodel.findOne({id : req.params.id}))){
        res.json({
            message : "Course does not exist"
        })
    }
    await umodel.updateOne(
        {_id : req.user.id},
        {$push : {purchasedCourses : req.params.id} }
    )
    res.json({ 
        message : "Course purchased successfully" 
    })
})   

router.get('/purchasedCourses',auth,async (req,res) =>{
    const user = await umodel.findONe({
        _id : req.user.id
    })
    res.json({
        purchasedCourses : await cmodel.find({
            id : { $in : user.purchasedCourses }
        })
    })

})
router.get('/courses',(req,res)=>{
    res.json({
        courses : cmodel.find()
    })
})
export {
    router
}