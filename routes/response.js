const express = require ("express");
const cors = require ("cors")
const response = express.Router().use(cors());
const { sendUserAMessage } = require("../utils")


response.post("/response", (req, res) => {
    const {chat, phoneNumber } = req.body;
    console.log("chat", chat, "phone number", phoneNumber)
    sendUserAMessage(chat, phoneNumber)

});

module.exports = response;