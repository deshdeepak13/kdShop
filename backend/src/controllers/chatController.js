import axios from "axios";

/**
 * Handles chat interactions with the Groq API.
 *
 * @async
 * @function chatWithGroq
 * @param {Object} req - Express request object
 * @param {Object} req.body - Request body
 * @param {Array<Object>} req.body.messages - Array of message objects for the chat context
 * @param {Object} res - Express response object
 * @returns {Promise<void>} Sends a JSON response with the chatbot's reply chunks or an error message.
 */
export const chatWithGroq = async (req, res) => {
  const { messages } = req.body;
  // console.log(req.body);

  if (!messages || !Array.isArray(messages)) {
    return res.status(400).json({ error: "Invalid or missing messages array" });
  }

  try {
    const response = await axios.post(
      "https://api.groq.com/openai/v1/chat/completions",
      {
        model: "llama-3.1-8b-instant",
        messages: [
          {
            role: "system",
            content: `
You are a helpful, energetic, joyful e-commerce assistant and advisor chatbot on platform named "ddShop". Respond in **Markdown** with emojis. Use:
- **bold** for important points
- *italics* for side notes or tips
- 🎯 Emojis to start bullet points
- Use short lines, each one on its own
- Avoid paragraphs
- Use emojis to make it fun and engaging
- Split response into multiple short messages, like you're chatting in real-time.
- Start headings with 👉 or 🎉
Avoid long paragraphs. Style responses like exciting text messages!
        `.trim(),
          },
          ...messages, // ✅ Pass full conversation
        ],
      },
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${process.env.GROQ_API_KEY}`,
        },
      }
    );

    const fullReply = response.data.choices[0].message.content;

    const replyChunks = fullReply
      .split(/\n{2,}/)
      .map((line) => line.trim())
      .filter((line) => line.length > 0);

    res.json({ replyChunks });
  } catch (error) {
    // console.log(error);
    console.error("Groq API Error:", error.response?.data || error.message);
    res.status(500).json({ error: "Chatbot failed to respond" });
  }
};
