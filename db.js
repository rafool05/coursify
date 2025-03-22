import mongoose from 'mongoose'
import { number } from 'zod';

mongoose.connect('mongodb+srv://r_afool:oJwg%26aTmG7cs7eDa@cluster0.dkuwz.mongodb.net/coursify')

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