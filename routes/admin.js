const JWT_SECRET = 'ilovemyselfmorethanyoucankthinkof'
import express from 'express'
import {z} from 'zod'
import jwt from 'jsonwebtoken'
import bcrypt from 'bcrypt'
import {umodel,cmodel} from '../db.js'
import {auth,adminAuth} from "../auth.js"
const router = express.Router();
router.use(express.json());
let cid 
cmodel.find().then(data =>{
    cid = data.length
})

router.post('/signup',async(req,res) =>{
    const body = req.body;
    const {username, password} = body;
    try{
        const User = z.object
        ({
            username : z.string().min(5).max(25),
            password : z.string().min(5).max(50),
        })
        const parseResult = User.safeParse({username,password})
        if(parseResult.success){
            await umodel.create({
                username,
                password : await bcrypt.hash(password,5),
                isAdmin : true
            })
            res.json({
                message : "You are signed up"
            })
        }
        else{
            res.json()({
                message : "Invalid Input",
                error : parseResult.error
            })
        }
    }
    catch(err){
        res.json({
            message : "User already exists"
        })
    }
})
router.post('/login',async (req,res) =>{
    const body = req.body;
    const {username, password} = body;
    const curUser = await umodel.findOne({
        username
    })
    if(!curUser){
        res.status(403).json({
            message : "User Doesn't Exist"
        })
    }
    else{
        if(curUser.isAdmin == false){
            res.json({
                message : "Unauthorised"
            })
            return;
        }
        if(await bcrypt.compare(password,curUser.password)){
            const token = jwt.sign({
                id : curUser._id,
                isAdmin : true
            },JWT_SECRET)

            // localStorage.setItem("token",token);
            res.json({
                message : "You are signed in",
                token 
            })
        }
        else{
            res.status(403).json({
                message : "Entered password does not match"
            })
        }
    }

})
router.post('/courses',auth,adminAuth,async (req,res) =>{
    const body = req.body;
    const {title, description,price,imageLink,published} = body;
    if(z.string().url().safeParse(imageLink).success){
        await cmodel.create({
            title,
            description,
            price,
            imageLink,
            published,
            id : cid
        })
        res.json({
            message : "Course Created Successfully",
            id : cid
        })
        cid++;
    }
    else{
        res.json({
            message : "Image Link invalid"
        })
    }
})
router.put('/courses/:id',auth,adminAuth,async (req,res) =>{
    const id = parseInt(req.params.id);
    const body = req.body
    const {title, description,price,imageLink,published} = body

    const newCourse = {title, description,price,imageLink,published,id}
    if((await cmodel.replaceOne(
        {id},
        newCourse
    )).modifiedCount == 0){
        res.json({
            message : "Invalid id"
        })
    }
    else{
        res.json({ 
            "message": "Course updated successfully" 
        })
    }
})

router.get('/courses',auth,adminAuth,async (req,res)=>{
    res.json({
        courses : await cmodel.find()
    })
})

export {
    router
}