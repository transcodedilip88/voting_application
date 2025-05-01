const express = require('express')
const cors = require('cors')
const mongoose = require('mongoose')
const app = express()
const {dbUrl,port}= require('./src/config')
const logger = require('morgan')
const router = require('./src/api/routes')
const swagger = require('swagger-ui-express')
const swaggerDocument = require('./src/swagger/swagger.json')

app.use(logger('dev'))
app.use(cors())
app.use(express.json())
app.use(express.urlencoded({extended:true}))

app.use('/api',router)
app.use('/swagger',swagger.serve,swagger.setup(swaggerDocument))

app.use((err,req,res,next)=>{
    let {status,code,message} = err
    if(!status || status === 500){
        status = 500,
        code = 'Internal server error',
        message = 'Oops something went wrong'
    }
    res.status(status).json(code,message)
})

async function connectToDatabase() {
    try {
        await mongoose.connect(dbUrl,{})
        const server = app.listen(port,()=>{
            console.log(`database connected and server started on port ${port}`);
        })
    } catch (error) {
        console.log("database connection error : ",error);
        
    }
}

connectToDatabase()