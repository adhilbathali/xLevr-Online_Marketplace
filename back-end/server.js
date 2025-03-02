const server = require('express')
const app = server()
const Dotenv = require('dotenv')
Dotenv.config()

const PORT = process.env.PORT || 5000

app.listen(PORT, ()=>{
    console.log(`app is listening to PORT ${PORT}`)
})