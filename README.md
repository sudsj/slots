# Test
Run using node app.js

# Verifying : 

Try : curl -X GET "localhost:1337/webhook?hub.verify_token=iKCjToP5gL&hub.challenge=CHALLENGE_ACCEPTED&hub.mode=subscribe"

https://fbslots.herokuapp.com/

curl -X GET "https://fbslots.herokuapp.com/webhook?hub.verify_token=iKCjToP5gL&hub.challenge=CHALLENGE_ACCEPTED&hub.mode=subscribe"


# Sending a message  : 


Make a POST request on localhost:1337/webhook. 
With this application/json content  :

{
  "object":"page",
  "entry":[
    {
      "id":"page12345",
      "time":1458692752478,
      "messaging":[
        {
          "sender":{
            "id":"sender5432"
          },
          "recipient":{
            "id":"page12345"
          },
		  "message":{
			    "mid":"m_1457764197618:41d102a3e1ae206a38",
			    "text":"hello, world!",
			    "reply_to": {
			      "mid":"m_1fTq8oLumEyIp3Q2MR-aY7IfLZDamVrALniheU"
			    }
			  }
	      }
      ]
    }
  ]
}

