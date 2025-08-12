import cookieParser from "cookie-parser"
import express from "express"
import cors from "cors"
import schedulerRoutes from "./routes/schedulerRoutes.js"

const app = express()

app.use(express.json());
app.use(cookieParser())

app.use(cors({
    origin:"http://localhost:5173",
    Credentials:true,
}))
app.use("/api/schedule", schedulerRoutes);

app.get("/", (req, res) => {
  res.send("API is running ");
});

app.listen(5000,()=>{
    console.log("App is running ")
})
