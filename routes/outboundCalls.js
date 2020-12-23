const express = require('express');
const router = express.Router();
// Download the helper library from https://www.twilio.com/docs/node/install
// Your Account Sid and Auth Token from twilio.com/console
// and set the environment variables. See http://twil.io/secure
const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const client = require('twilio')(accountSid, authToken);

// Call to phone
router.get('/', function (req, res) {
    const numberToCall = req.query.phoneNumber;
    const twilioNumber = '+12515511672';

    client.calls
        .create({
            //  url: 'http://demo.twilio.com/docs/voice.xml',
            to: numberToCall,
            from: twilioNumber,
            logLevel: 'debug',
            twiml: `
                <Response>
                    <Say>Ahoy there</Say><Say>Hello Alexander!</Say>
                </Response>`,
        })
        .then((call) => {
            console.log('call: //', call);
        }).catch((err) => {
            console.log('Error://:', err);
        });

    res.send(`calling to number = ${req.query.phoneNumber}`);
});

module.exports = router;
