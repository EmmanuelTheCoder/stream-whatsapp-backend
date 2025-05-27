const express = require("express");
const webhook = express
  .Router()
  .use(express.json(), express.urlencoded({ extended: false }));

const {StreamChat} = require("stream-chat")

const { sendUserAMessage, sendInteractiveProductMessage } = require("../utils")
const chatServer = StreamChat.getInstance(
  process.env.STREAM_KEY,
  process.env.STREAM_SECRET
)



 

const token = process.env.WHATSAPP_TOKEN;



webhook.post("/webhook", async (req, res) => {
  // Parse the request body from the POST
  let body = req.body;

  // Check the Incoming webhook message
  console.log(JSON.stringify(req.body, null, 2));


  if (req.body.object) {
    if (
      req.body.entry &&
      req.body.entry[0].changes &&
      req.body.entry[0].changes[0] &&
      req.body.entry[0].changes[0].value.messages &&
      req.body.entry[0].changes[0].value.messages[0]
    ) {
        let phone_number_id =
          req.body.entry[0].changes[0].value.metadata.phone_number_id;
        let from = req.body.entry[0].changes[0].value.messages[0].from; // extract the phone number from the webhook payload
        //let msg_body = req.body.entry[0].changes[0].value.messages[0].text.body; // extract the message text from the webhook payload
        const msg_type = req.body.entry[0].changes[0].value.messages[0].type;
      
      //create users
      await chatServer.upsertUsers([
        {id: from, name: "customer", role: "user"},
        {id:"businessowner", name: "business", role: "admin"}
      ])
      
      //create channel and users to the channel

      const channel = chatServer.channel("messaging", "order_tracking", {
        name: "Order Tracker",
        members: [from, "businessowner"],
        created_by_id: from,
      });
      await channel.create()
      
      

        const checkIsInteractive = (type) => {
          if (type === "interactive") {
            return true;
          } else return false;
        };

      const isInteractive = checkIsInteractive(msg_type);

      const assignMsgVal = (type) => {
        let msg_body;
        if (type === "text") {
          msg_body = req.body.entry[0].changes[0].value.messages[0].text.body;
        } else if (type === "interactive" && req.body.entry[0].changes[0].value.messages[0].interactive.type === "list_reply") {
          msg_body = `${req.body.entry[0].changes[0].value.messages[0].interactive.list_reply.title}\n${req.body.entry[0].changes[0].value.messages[0].interactive.list_reply.description}`
          sendUserAMessage(from, `Make payment for the following item\n${msg_body}\nclick https://test.payment.com to make your payment.`)
        }

        return msg_body;
      };

      let msg_body = assignMsgVal(msg_type);
      
    

    if(msg_body.toLowerCase().trim() === "#product"){
      
      sendInteractiveProductMessage(from)
    }
      


  const message = {
  text: msg_body,
  reply_number: from,
  user_id: from  
};

const response = await channel.sendMessage(message);
      
console.log("the message object", response)

    res.sendStatus(200);
  } else {
    // Return a '404 Not Found' if event is not from a WhatsApp API
    res.sendStatus(404);
  }
}
});

// Accepts GET requests at the /webhook endpoint. You need this URL to setup webhook initially.
// info on verification request payload: https://developers.facebook.com/docs/graph-api/webhooks/getting-started#verification-requests
webhook.get("/webhook", (req, res) => {
  /**
   * UPDATE YOUR VERIFY TOKEN
   *This will be the Verify Token value when you set up webhook
   **/
  const verify_token = process.env.VERIFY_TOKEN;

  // Parse params from the webhook verification request
  let mode = req.query["hub.mode"];
  let token = req.query["hub.verify_token"];
  let challenge = req.query["hub.challenge"];

  // Check if a token and mode were sent
  if (mode && token) {
    // Check the mode and token sent are correct
    if (mode === "subscribe" && token === verify_token) {
      // Respond with 200 OK and challenge token from the request
      //console.log("WEBHOOK_VERIFIED");
      res.status(200).send(challenge);
    } else {
      // Responds with '403 Forbidden' if verify tokens do not match
      res.sendStatus(403);
    }
  }
});

module.exports = webhook;
