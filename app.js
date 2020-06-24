'use strict';
const PAGE_ACCESS_TOKEN = process.env.PAGE_ACCESS_TOKEN;
const GOOGLE_GEOCODING_API = 'https://maps.googleapis.com/maps/api/geocode/json?address=';
const GOOGLE_GEOCODING_API_KEY = process.env.GOOGLE_GEOCODING_API_KEY;
// Imports dependencies and set up http server
const 
  request = require('request'),
  express = require('express'),
  body_parser = require('body-parser'),
  app = express().use(body_parser.json()); // creates express http server

// Using sequelize 
const db = require('./models/index.js');
const users = require('./models/users.js');

  // Sets server port and logs message on success
app.listen(process.env.PORT || 1337, () => console.log('webhook is listening'));

// Accepts POST requests at /webhook endpoint
app.post('/webhook', (req, res) => {  

  // Parse the request body from the POST
  let body = req.body;

  // Check the webhook event is from a Page subscription
  if (body.object === 'page') {

    body.entry.forEach(function(entry) {

      // Gets the body of the webhook event
      let webhook_event = entry.messaging[0];
      console.log(webhook_event);


      // Get the sender PSID
      let sender_psid = webhook_event.sender.id;
      console.log('Sender ID: ' + sender_psid);

      // Check if the event is a message or postback and
      // pass the event to the appropriate handler function
      if (webhook_event.message) {
        handleMessage(sender_psid, webhook_event.message);        
      } else if (webhook_event.postback) {
        
        handlePostback(sender_psid, webhook_event.postback);
      }
      
    });
    // Return a '200 OK' response to all events
    res.status(200).send('EVENT_RECEIVED');

  } else {
    // Return a '404 Not Found' if event is not from a page subscription
    res.sendStatus(404);
  }

});

// Accepts GET requests at the /webhook endpoint
app.get('/webhook', (req, res) => {
  
  /** UPDATE YOUR VERIFY TOKEN **/
  const VERIFY_TOKEN = "iKCjToP5gL";
  
  // Parse params from the webhook verification request
  let mode = req.query['hub.mode'];
  let token = req.query['hub.verify_token'];
  let challenge = req.query['hub.challenge'];
    
  // Check if a token and mode were sent
  if (mode && token) {
  
    // Check the mode and token sent are correct
    if (mode === 'subscribe' && token === VERIFY_TOKEN) {
      
      // Respond with 200 OK and challenge token from the request
      console.log('WEBHOOK_VERIFIED');
      res.status(200).send(challenge);
    
    } else {
      // Responds with '403 Forbidden' if verify tokens do not match
      res.sendStatus(403);      
    }
  }
});
var fmor = 0, faft = 0, amor = 0, aaft = 0;
function userFlow(sender_psid, received_message) {
  // handles the async db call to check if user exists and replies accordingly.
  console.log(received_message)
  db.Users.findOne({ where: {fbid: sender_psid} }).then(user => {
    // console.log(user.fbid);
    // console.log(received_message);
    let response;
    if(user){
      console.log('existing user');
      var msgtxt = received_message.text.trim();
      var qpay = "not there";
      if(received_message.quick_reply){
        if(received_message.quick_reply.payload){
          qpay = received_message.quick_reply.payload;
        }
      }
      if(msgtxt === 'location'){
        // call location handler
        console.log('location handler is called');
        locationHandler(sender_psid, received_message);
      }else if(qpay === 'flower'){
        showFlower(sender_psid);
      }else if(qpay === 'art'){
        showArt(sender_psid);
      }else if(qpay === 'fmor'){
        fmor += 1;
        response = {
          "text": `Thank you for choosing the morning slot at the Flower Shop. We expect ${fmor} visitors for that slot. Stay Safe!".`
        }
        // Send the response message
        console.log(response);
        callSendAPI(sender_psid, response);
      }else if(qpay === 'faft'){
        faft += 1;
        response = {
          "text": `Thank you for choosing the afternoon slot at the Flower Shop. We expect ${faft} visitors for that slot. Stay Safe!".`
        }
        // Send the response message
        console.log(response);
        callSendAPI(sender_psid, response);
      }else if(qpay === 'amor'){
        amor += 1;
        response = {
          "text": `Thank you for choosing the morning slot at the Art Shop. We expect ${amor} visitors for that slot. Stay Safe!".`
        }
        // Send the response message
        console.log(response);
        callSendAPI(sender_psid, response);
      }else if(qpay === 'aaft'){
        aaft += 1;
        response = {
          "text": `Thank you for choosing the afternoon slot at the Art Shop. We expect ${aaft} visitors for that slot. Stay Safe!".`
        }
        // Send the response message
        console.log(response);
        callSendAPI(sender_psid, response);
      }else{
        // response = {
        //   "text": `Welcome again ${user.name} from ${user.location}, this is your message: "${received_message.text}".`
        // }
        // // Send the response message
        // console.log(response);
        // callSendAPI(sender_psid, response);
        shopDisplay(sender_psid);
      }
      
    }else{
      console.log('new user');
      response = {
        "text": `Welcome new user, We help you reserve a slot to visit your favourite shops. We show expected visitor counts so you can make an informed decision and stay safe while ensuring Social Distancing.`
      }
      // Insert user registeration functions/logic here
      createUser(sender_psid, 'user'+ sender_psid, 'Earth');
      // Send the response message
      console.log(response);
      callSendAPI(sender_psid, response);
    }
    // console.log(response);
    // // Send the response message
    // callSendAPI(sender_psid, response);
  })
}

function showFlower(sender_psid){
  let response = {
    "text": "Select a Slot",
    "quick_replies":[
      {
        "content_type":"text",
        "title":"Morning, vis = " + fmor.toString(),
        "payload":"fmor"
      },{
        "content_type":"text",
        "title":"Afternoon, vis = " + faft.toString(),
        "payload":"faft"
      }
    ]
  }
  console.log(response);
  callSendAPI(sender_psid, response);
}
function showArt(sender_psid){
  let response = {
    "text": "Select a Slot",
    "quick_replies":[
      {
        "content_type":"text",
        "title":"Morning, vis = " + amor.toString(),
        "payload":"amor"
      },{
        "content_type":"text",
        "title":"Afternoon, vis = " + aaft.toString(),
        "payload":"aaft"
      }
    ]
  }
  console.log(response);
  callSendAPI(sender_psid, response);
}
function shopDisplay(sender_psid){
  let response = {
    "text": "Select a Shop",
    "quick_replies":[
      {
        "content_type":"text",
        "title":"Flower Shop",
        "payload":"flower"
      },{
        "content_type":"text",
        "title":"Arts Shop",
        "payload":"art"
      }
    ]
  }
  console.log(response);
  callSendAPI(sender_psid, response);
}
function getLocation(){
  // Iterate over each entry - there may be multiple if batched
  data.entry.forEach(function(entry) {
    var pageID = entry.id;
    var timeOfEvent = entry.time;

    // Iterate over each messaging event
    entry.messaging.forEach(function(event) {
        if (event.message) {
        receivedMessage(event);
        } else {
        console.log("Webhook received unknown event: ", event);
        }
    });
    });

    res.sendStatus(200);
}

function createUser(sender_psid, userName, userLocation) {
  // creates a new user entry in the DB, Users Table
  console.log('Create User is executed')
  db.Users.create({ name: userName, fbid: sender_psid, location : userLocation })
}

function handleMessage(sender_psid, received_message) {
  let response;
  userFlow(sender_psid, received_message);
}

function handlePostback(sender_psid, received_postback) {
  console.log('ok')
   let response;
  // Get the payload for the postback
  let payload = received_postback.payload;

  // Set the response based on the postback payload
  if (payload === 'yes') {
    response = { "text": "Thanks!" }
  } else if (payload === 'no') {
    response = { "text": "Oops, try sending another image." }
  }
  // Send the message to acknowledge the postback
  callSendAPI(sender_psid, response);
}

function callSendAPI(sender_psid, response) {
  // Construct the message body
  let request_body = {
    "recipient": {
      "id": sender_psid
    },
    "message": response
  }
  // logging
  console.log(response);
  // Send the HTTP request to the Messenger Platform
  request({
    "uri": "https://graph.facebook.com/v2.6/me/messages",
    "qs": { "access_token": PAGE_ACCESS_TOKEN },
    "method": "POST",
    "json": request_body
  }, (err, res, body) => {
    if (!err) {
      console.log('message sent!')
    } else {
      console.error("Unable to send message:" + err);
    }
  }); 
}

function sendTextMessage(sender_psid, msg){
  let response = { "text": msg };
  // Send the message
  console.log(response);
  callSendAPI(sender_psid, response);
}


function locationHandler(sender_psid){
  const askForLocationPayload = {
    "text": "Where about do you live?",
    "quick_replies":[
      {
        "content_type":"location"
      }
    ]
  };
  callSendAPI(sender_psid, askForLocationPayload);
}

 function callGeocodingApi(address, sender_psid, callback){
  console.log('before calling geocoding api with address:', address);
  request({
    "url": `${GOOGLE_GEOCODING_API}${address}&key=${GOOGLE_GEOCODING_API_KEY}`,
    "method": "GET"
  }, (err, res, body) => {
    console.log('after calling geocoding api with result:', body);
    if (err) {
      console.error("Unable to retrieve location from Google API:", err);
    } else {
      const bodyObj = JSON.parse(body);
      if (bodyObj.status === 'OK'){
        if (bodyObj.results && bodyObj.results[0] && bodyObj.results[0].geometry && bodyObj.results[0].geometry.location){
          callback(sender_psid, bodyObj.results[0].geometry.location, bodyObj.results[0].formatted_address);
        }
      } else{
        console.error("Unable to retrieve location (status non-OK):", bodyObj);
      }
    }
  });
}
