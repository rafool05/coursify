import express from 'express'
import jwt from 'jsonwebtoken'
import {router as adminRoute} from './routes/admin.js'
import {router as userRoute} from './routes/users.js'
const app = express();

app.use('/admin',adminRoute)
app.use('/users',userRoute)

app.listen(3000)