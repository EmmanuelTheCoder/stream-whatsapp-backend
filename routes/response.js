const express = require ("express");
const response = express.Router();
const { sendUserAMessage } = require("../utils")


response.post("/response", (req, res) => {
    const {chat, phoneNumber } = req.body;
    sendUserAMessage(chat, phoneNumber)

});

module.exports = response;