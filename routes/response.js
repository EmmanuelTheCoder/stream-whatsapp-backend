const express = require ("express");
const cors = require ("cors")
const response = express.Router().use(cors());
const { sendUserAMessage } = require("../utils")


response.post("/response", (req, res) => {
    const {chat, phoneNumber } = req.body;
    sendUserAMessage(chat, phoneNumber)

});

module.exports = response;