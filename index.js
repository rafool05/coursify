import express from 'express'
const app = express();

import {adminRoute} from './routes/admin.js'
import {userRoute} from './routes/users.js'

app.use('/admin',adminRoute)
app.use('/users',userRoute)

app.listen(3000)