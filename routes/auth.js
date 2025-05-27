const express = require('express');
const auth = express.Router();


const chatServer = StreamChat.getInstance(
    process.env.STREAM_KEY,
    process.env.STREAM_SECRET
  )

auth.post("/auth", async (req, res) => {
    const { businessId } = await req.body;

    try {
        const token = chatServer.createToken(businessId);
        res.json({ token })
    } catch (error) {
        res.status(500).json({error: error})
    }

});

module.exports = auth;