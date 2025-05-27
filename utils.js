const axios = require("axios");

const whatsappToken = process.env.WHATSAPP_TOKEN;
const business_phone_id = process.env.WHATSAPP_PHONE_ID;

const sendUserAMessage = (phone, message) => {
      axios ({
        method: "POST",
        url: `https://graph.facebook.com/v22.0/${business_phone_id}/messages?access_token=${whatsappToken}`,
        data: {
          messaging_product: "whatsapp",
          to: phone,
          text: {body: `${message}`}
      },
      
        headers: {"Content-Type": "application/json"}
        
      });
        
}

const sendInteractiveProductMessage = (phone) => {
  
    axios ({
        method: "POST",
        url: `https://graph.facebook.com/v22.0/${business_phone_id}/messages?access_token=${whatsappToken}`,
        data: {
          messaging_product: "whatsapp",
          to: phone,
          type: "interactive",
          interactive: {
            type: "list",
            header: {
              type: "text",
              text: "Select a Product to Purchase"
            },
            body: {
              text: "What would you like to shop from us today?"
            },
            footer: {
              text: "Discount: 6% discount on all our products today. Shop now!™"
            },
            action: {
              button: "Shop Now!",
              sections: [
                {
                  title: "Shirts",
                  rows: [
                    {
                      id: "t-shirt-0001",
                      title: "Plain T-Shirt",
                      description: "Size: Large"
                    },
                    {
                      id: "sleeveless-001",
                      title: "Sleeveless",
                      description: "Size: Medium"
                    }
                  ]
                },
                {
                 title: "Caps",
                  rows: [
                    {
                      id: "base-cap-xl",
                      title: "Baseball Cap",
                      description: "Unisex cap (delivery in 2 days)"
                    },
                    {
                      id: "br-xxl",
                      title: "Beret",
                      description: "Unisex"
                    }
                  ]
                }
              ]
            }
  }
  },

    headers: {"Content-Type": "application/json"}

  });
  
}

const sendAddressMessage = (phone) => {
   axios
     ({
        method: "POST",
        url: `https://graph.facebook.com/v22.0/${business_phone_id}/messages?access_token=${whatsappToken}`,
        data: {
          messaging_product: "whatsapp",
          recipient_type: "individual",
          to: `${phone}`,
          type: "interactive",
          interactive: {
            type: "address_message",
            body: {
              text: "Thanks for your order! Tell us what address you'd like this order delivered to"
            },
            action: {
              name: "address_message",
              parameters: {
                country: "IN"
              }
            }
          }
        }
     
   })
  
  
}


 


module.exports = { sendUserAMessage, sendInteractiveProductMessage, sendAddressMessage }
                 

