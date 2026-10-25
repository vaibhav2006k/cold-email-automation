import express from "express"
import { extractionContent } from "../controller/extraction.controller.js"
import { authMiddleware } from "../middleware/auth.middleware.js"
import { upload } from "../middleware/multer.middleware.js"

const router = express.Router()

router.post("/extract", authMiddleware, upload.single("file"), extractionContent)

export default router
