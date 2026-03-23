import express from "express";
import { chatWithGroq } from "../controllers/chatController.js";

const router = express.Router();

/**
 * @route POST /api/v1/chat
 * @desc Interact with the Groq chatbot
 * @access Public
 */
router.post("/", chatWithGroq);

export default router;
