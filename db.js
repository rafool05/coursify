import mongoose from 'mongoose'
import 'dotenv/config'
const mongo_url = process.env.mongo_url
mongoose.connect(mongo_url)

const Schema = mongoose.Schema;

const user = new Schema({
    username : {type : String, unique : true},
    password : String,
    isAdmin : Boolean,
    purchasedCourses : Array
})

const courses = new Schema({
    title : String,
    description : String,
    price : Number,
    imageLink : String,
    published : Boolean,
    id : Number
    
})

const umodel = mongoose.model('user',user)
const cmodel = mongoose.model('courses',courses)

export{
    umodel,
    cmodel
}