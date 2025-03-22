import express from 'express'
import jwt from 'jsonwebtoken'
import {router as adminRoute} from './routes/admin.js'
import {router as userRoute} from './routes/users.js'
const app = express();
const JWT_SECRET = 'ilovemyselfmorethanyoucankthinkof'

app.use('/admin',adminRoute)
app.use('/users',userRoute)
async function auth(req,res,next){
    const token = req.headers.authorization
    
    if(!token){
        res.status(403).json({
            message : "You are not signed in"
        })
        return;
    }

    try{
        const decoded = jwt.verify(token,JWT_SECRET);
        req.user = decoded
        next();
    }
    catch(err){
        // console.log(err)
        res.status(403).json({
            message : "Unauthorised"
        })
    }
    
}
function adminAuth(req,res,next){
    if(!req.user.isAdmin){
        res.status(403).json({
            message : "Unauthorised"
        })
    }
    else next();
}
export {
    auth,adminAuth
}
app.listen(3000)