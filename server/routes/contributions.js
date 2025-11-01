import { Router } from "express";
import multer from "multer";
import path from "path";
import fs from "fs";
import { fileURLToPath } from "url";
import { GoogleGenerativeAI } from "@google/generative-ai";

const router = Router();
const __dirname = path.dirname(fileURLToPath(import.meta.url));

// Configure multer for image uploads
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const uploadDir = path.join(__dirname, "../uploads/contributions");
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    cb(null, uploadDir);
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  },
});

const upload = multer({
  storage: storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
  fileFilter: (req, file, cb) => {
    const filetypes = /jpeg|jpg|png|gif/;
    const mimetype = filetypes.test(file.mimetype);
    const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
    
    if (mimetype && extname) {
      return cb(null, true);
    }
    cb(new Error("Only image files are allowed"));
  },
});

// Initialize Gemini API
// Note: In production, use environment variables for API keys
const API_KEY = process.env.GEMINI_API_KEY || "YOUR_GEMINI_API_KEY"; 
const genAI = new GoogleGenerativeAI(API_KEY);

// Helper function to analyze image with Gemini (simulation for now)
const analyzeImageWithGemini = async (imagePath, description) => {
  // In a real implementation, this would use the Gemini API
  // For now, we'll simulate the analysis based on the description
  
  // This is where you would call the actual Gemini API in production:
  /*
  const imageData = fs.readFileSync(imagePath);
  const base64Image = imageData.toString("base64");
  const model = genAI.getGenerativeModel({ model: "gemini-pro-vision" });
  
  const prompt = `Analyze this image and determine if it shows a civic contribution like community cleanup, 
  tree planting, recycling, or other environmental/community work. 
  User description: "${description}"
  
  If it is a valid civic contribution, respond with:
  VALID: true
  CATEGORY: [category name]
  POINTS: [10-100]
  MESSAGE: [appreciation message]
  
  If it is NOT a valid civic contribution, respond with:
  VALID: false
  REASON: [reason why it's not valid]`;
  
  const result = await model.generateContent([
    prompt,
    { inlineData: { data: base64Image, mimeType: "image/jpeg" } },
  ]);
  
  const response = await result.response;
  const text = response.text();
  
  // Parse the response
  const valid = text.includes("VALID: true");
  const category = valid ? text.match(/CATEGORY: (.*)/)[1].trim() : "";
  const points = valid ? parseInt(text.match(/POINTS: (.*)/)[1].trim()) : 0;
  const message = valid ? text.match(/MESSAGE: (.*)/)[1].trim() : "";
  const reason = !valid ? text.match(/REASON: (.*)/)[1].trim() : "";
  
  return {
    valid,
    category,
    points,
    message,
    reason
  };
  */
  
  // For demo purposes, we'll use the description to determine validity
  const civicKeywords = ["cleanup", "volunteer", "community", "environment", "recycling", 
                         "planting", "donation", "charity", "helping", "civic"];
  
  const containsCivicKeywords = civicKeywords.some(keyword => 
    description.toLowerCase().includes(keyword)
  );
  
  // Image size check (simulating image content analysis)
  const imageSize = fs.statSync(imagePath).size;
  const isReasonableSize = imageSize > 50000; // Basic check for non-empty images
  
  return {
    valid: isReasonableSize && (description === "" || containsCivicKeywords),
    category: determineCategory(description),
    points: determinePoints(description),
    message: determineMessage(description),
    reason: !isReasonableSize ? "Image is too small or empty" : 
            !containsCivicKeywords && description !== "" ? "Description doesn't indicate a civic contribution" : ""
  };
};

// Helper functions for category, points, and message determination
const determineCategory = (description) => {
  const desc = description.toLowerCase();
  if (desc.includes("cleanup") || desc.includes("clean up") || desc.includes("litter")) return "cleanup";
  if (desc.includes("plant") || desc.includes("tree") || desc.includes("garden")) return "tree-planting";
  if (desc.includes("recycl") || desc.includes("waste") || desc.includes("plastic")) return "recycling";
  if (desc.includes("community") || desc.includes("volunteer") || desc.includes("event")) return "community-event";
  if (desc.includes("repair") || desc.includes("build") || desc.includes("infrastructure")) return "infrastructure";
  
  // Default to a random category if no keywords match
  const categories = ["cleanup", "tree-planting", "recycling", "community-event", "infrastructure"];
  return categories[Math.floor(Math.random() * categories.length)];
};

const determinePoints = (category) => {
  const pointsMap = {
    "cleanup": 50,
    "tree-planting": 70,
    "recycling": 40,
    "community-event": 60,
    "infrastructure": 55
  };
  
  return pointsMap[category] || 45; // Default to 45 points
};

const determineMessage = (category) => {
  const messages = {
    "cleanup": "Thank you for helping clean up your community!",
    "tree-planting": "Your contribution to urban forestry is appreciated!",
    "recycling": "Great job promoting sustainable waste management!",
    "community-event": "Your participation in community events makes a difference!",
    "infrastructure": "Thanks for helping improve local infrastructure!"
  };
  
  return messages[category] || "Thank you for your civic contribution!";
};

// Analyze contribution image and award points
router.post("/analyze-contribution", upload.single("image"), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: "No image uploaded" });
    }

    // Get image description from request body
    const description = req.body.description || "";
    
    // Analyze the image using our helper function
    const analysisResult = await analyzeImageWithGemini(req.file.path, description);
    
    // If the image is not valid, delete it and return error
    if (!analysisResult.valid) {
      // Delete the invalid image
      fs.unlinkSync(req.file.path);
      
      return res.status(400).json({
        error: analysisResult.reason || "Invalid contribution image. Please upload an actual civic contribution photo.",
        valid: false
      });
    }
    
    // Simulate processing delay
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    // Return the analysis result for valid images
    return res.status(200).json({
      points: analysisResult.points,
      category: analysisResult.category,
      message: analysisResult.message,
      valid: true,
      imagePath: req.file.path
    });
    
  } catch (error) {
    console.error("Error analyzing contribution:", error);
    return res.status(500).json({ error: "Failed to analyze contribution" });
  }
});

export default router;