import Extraction from "../model/extraction.model.js";
import { extractContentWithAi } from "../utils/ai.utils.js";

export const extractionContent = async(req,res)=>{
    try{
        if(!req.file){
            return res.status(400).json({
                success:false,
                message: "File is required..."
            })
        }
        const base64 = req.file.buffer.toString("base64")
        const imageData = `data:${req.file.mimetype};base64,${base64}`;

        const prompt = 'Analyze this image and extract visible information. If it contains a resume, extract: - Name - Email - Phone - Skills - Education - Experience - Projects If it contains a LinkedIn recruitment post, extract: - Recruiter email, if visible - Recruiter or author name - Company - Job role - Required skills - Post content Return valid JSON. Use null for missing information. Do not invent or guess information.'
        const extractionContentWithAi = await extractContentWithAi(prompt,imageData)

        let parseData = null;
        try{
            const jsonMatch = extractionContentWithAi.match(/\{[\s\S]*\}/)
            const toParse = jsonMatch ? jsonMatch[0]: extractionContentWithAi;
            parseData = JSON.parse(toParse) 
        }catch(e){
            console.log("Error while parsing:",e.message)
            parseData = {rawContent: extractionContentWithAi}
        }

        const savedExtraction = await Extraction.create({
            data : parseData,
            rawContent : extractionContentWithAi,
            createdBy : req.user._id
        
        })

        return res.status(200).json({
            success: true,
            msg : "Extraction Success...",
            savedExtraction
        })

    }catch(e){
        console.log("Extraction Errors:",e)
        return res.status(500).json({
            success:false,
            msg: "Interal Server Error",
        })

            
        
    }
}