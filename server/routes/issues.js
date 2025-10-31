import { Router } from "express";
import Issue from "../models/Issue.js";
import multer from "multer";
import path from "path";
import fs from "fs";

const router = Router();

// Ensure uploads directory exists
const uploadDir = path.resolve(process.cwd(), "uploads");
if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir, { recursive: true });

const storage = multer.diskStorage({
  destination: (_req, _file, cb) => cb(null, uploadDir),
  filename: (_req, file, cb) => {
    const unique = Date.now() + "-" + Math.round(Math.random() * 1e9);
    const ext = path.extname(file.originalname || "");
    cb(null, `${unique}${ext}`);
  },
});
const upload = multer({ storage });

router.get("/", async (_req, res) => {
  try {
    const issues = await Issue.find().sort({ createdAt: -1 });
    res.json(issues);
  } catch (err) {
    res.status(500).json({ error: "Failed to list issues" });
  }
});

router.post("/", upload.array("photos", 6), async (req, res) => {
  try {
    const { title, category, description, location, userId, coordinates, lat, lng } = req.body || {};
    let coordObj = coordinates;
    if (!coordObj && lat && lng) {
      const latNum = parseFloat(lat);
      const lngNum = parseFloat(lng);
      if (!Number.isNaN(latNum) && !Number.isNaN(lngNum)) coordObj = { lat: latNum, lng: lngNum };
    }
    const photos = (req.files || []).map((f) => `/uploads/${path.basename(f.path)}`);
    const issue = await Issue.create({ title, category, description, location, userId, coordinates: coordObj, photos });
    res.status(201).json(issue);
  } catch (err) {
    res.status(400).json({ error: "Failed to create issue" });
  }
});

// Update issue status or fields
router.patch("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const allowed = ["title", "category", "description", "location", "status", "coordinates"];
    const update = Object.fromEntries(
      Object.entries(req.body || {}).filter(([k]) => allowed.includes(k))
    );
    const updated = await Issue.findByIdAndUpdate(id, update, { new: true });
    if (!updated) return res.status(404).json({ error: "Issue not found" });
    res.json(updated);
  } catch (err) {
    res.status(400).json({ error: "Failed to update issue" });
  }
});

export default router;
