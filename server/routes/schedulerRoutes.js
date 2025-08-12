import express from "express"
import { scheduleProcesses } from "../controllers/SchedulerConroller.js"

const router = express.Router()

router.post('/',scheduleProcesses)

export default router
