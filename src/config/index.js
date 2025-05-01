const devConfig = require('./dev')
const env = process.env.NODE_ENV

let envConfig ={}

if(env === 'dev') envConfig = devConfig


const getEnv = function (){
    if(env === 'dev') return 'dev'
    return 'live'
}

const isLive = function(){
    if(['live'].indexOf(getEnv())===-1)return false
    return true
}

module.exports ={...envConfig,getEnv,env,isLive}