import express from "express"
import { uploadFile } from "../controller/file.controller.js"
import { upload } from "../middleware/multer.middleware.js"
import { authMiddleware } from "../middleware/auth.middleware.js"
import { extractionContent } from "../controller/extraction.controller.js"

const router= express.Router()

router.post("/upload",authMiddleware , upload.single("file"),uploadFile)
router.post("/extract",authMiddleware , upload.single("Screenshot"),extractionContent)

export default router