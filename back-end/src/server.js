import server from 'express'
import router from './routes/authRoutes.js'
import connectDB from './config/db.js'
import sessionMiddleware from './middlewares/session.js'


connectDB()
const app = server()

app.use(server.json())
app.use(sessionMiddleware)
app.use('/user', router)

const PORT = process.env.PORT || 5000

app.listen(PORT, ()=>{
    console.log(`app is listening to PORT ${PORT}`)
})

