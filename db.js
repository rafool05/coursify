import mongoose from 'mongoose'
import { number } from 'zod';

mongoose.connect()

const Schema = mongoose.Schema;

const user = new Schema({
    userid : {type : String, unique : true},
    password : String,
    isAdmin : Boolean
})

const courses = new Schema({
    title : String,
    description : String,
    price : number,
    imageLink : String,
    published : Boolean,
    id : number
    
})

const umodel = mongoose.model('user',user)
const cmodel = mongoose.model('courses',courses)

export{
    umodel,
    cmodel
}