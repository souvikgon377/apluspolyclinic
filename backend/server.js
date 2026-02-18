import express from "express"
import cors from 'cors'
import 'dotenv/config'
import connectCloudinary from "./config/cloudinary.js"
import userRouter from "./routes/userRoute.js"
import doctorRouter from "./routes/doctorRoute.js"
import adminRouter from "./routes/adminRoute.js"
import { db } from "./config/firebase.js"

// app config
const app = express()
const port = process.env.PORT || 4000

// Initialize Firestore (db is already initialized in config/firebase.js)
console.log("Firestore initialized successfully")

connectCloudinary()

// middlewares
app.use(express.json())
app.use(cors({
  origin: [
    'http://localhost:5173',  // Frontend dev
    'http://localhost:5174',  // Admin dev
    'https://apluspolyclinicasansol.netlify.app',  // Frontend production
    'https://aplusadmin.netlify.app'  // Admin production (if deployed)
  ],
  credentials: true
}))

// api endpoints
app.use("/api/user", userRouter)
app.use("/api/admin", adminRouter)
app.use("/api/doctor", doctorRouter)

app.get("/", (req, res) => {
  res.send("API Working")
});

app.listen(port, () => console.log(`Server started on PORT:${port}`))