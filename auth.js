import jwt from 'jsonwebtoken'
import 'dotenv/config'
const JWT_SECRET = process.end.JWT_SECRET
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