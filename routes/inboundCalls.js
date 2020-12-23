const express = require('express');
const router = express.Router();
const VoiceResponse = require('twilio').twiml.VoiceResponse;

const { initDirectLine, sendMessageToBot, getBotMessage, generateUserId } = require('../services/botConnector/botDirectline.service');
const { getIntent } = require('../services/luis/luis.service');
const botDirectLine = initDirectLine();
const userId = '';

router.post('/voice', (req, res) => {
  const twiml = new VoiceResponse();
  // userId = generateUserId(); // TODO: add user id to sendMessageToBot method

  gather = twiml.gather({
    input: 'speech dtmf',
    timeout: 5,
    numDigits: 2,
    speechTimeout: 3,
    hints: 'Who is my doctor?',
    action: '/inbound-call/completed'
  });
  gather.say('Hello, what can I help you with today?. You can ask me questions like: Who is my Doctor, Order an ID Card, or what is my deductible.');

  res.send(twiml.toString());
});

router.post('/completed', async (req, res, next) => {
  const speechResult = req.body.SpeechResult;
  const digitsResult = req.body.Digits;
  let twiml = new VoiceResponse();
  let botMessage = '';

  try {
    if (speechResult) {
      await sendMessageToBot(botDirectLine, speechResult);
    } else if (digitsResult) {
      await sendMessageToBot(botDirectLine, digitsResult);
    }
  } catch (err) {
    console.log('sendMessageToBot error: //', err);
    return res.status(500).send();
  }

  try {
    botMessage = await getBotMessage(botDirectLine);
    console.log('botMessage: //', botMessage);
    twiml.say(botMessage);
  } catch (err) {
    console.log('getBotMessage error: //', err);
    return res.status(500).send();
  }

  twiml.gather({
    input: 'speech dtmf',
    numDigits: 2,
    timeout: 5,
    speechTimeout: 3,
    action: '/inbound-call/completed'
  });

  twiml.say('Goodby');

  res.type('text/xml');
  res.send(twiml.toString());
});

// Route for TESTS. Text messages to bot
router.get('/text', async function (req, res, next) {
  const messageToBot = req.query.message;
  let botMessage = '';

  try {
    await sendMessageToBot(botDirectLine, messageToBot);
  } catch (err) {
    console.log('sendMessageToBot error: //', err);
    return res.status(500).send();
  }

  try {
    botMessage = await getBotMessage(botDirectLine);
    console.log('botMessage: //', botMessage);
    return res.send('botMessage = ' + botMessage);
  } catch (err) {
    console.log('getBotMessage error: //', err);
    return res.status(500).send();
  }
});

// // Phone call with (MS LUIS) intent processing 
// router.post('/completed', async (req, res, next) => {
//   const speechResult = req.body.SpeechResult;
//   let twiml = new VoiceResponse();
//   let intentionResult = '';

//   intentionResult = await getIntent(speechResult);

//   switch(await intentionResult) {
//     case 'findMyDoc':
//       twiml.say('Your doctor is Gregory House.');
//       twiml.say('If you have other question, ask me');
//       break
//     case 'orderIdCard':
//       twiml.say('One minute please. Your insurance Card has been ordered');
//       twiml.say('If you have other question, ask me');
//       break
//     default:
//       twiml.say(`I didn't get that. What did you say?`);
//   }

//   twiml.gather({
//     input: 'speech',
//     timeout: 5,
//     speechTimeout: 3,
//     action: '/inbound-call/completed'
//   });

//   twiml.say('Goodby');

//   // Render the response as XML in reply to the webhook request
//   res.type('text/xml');
//   res.send(twiml.toString());
// });

module.exports = router;
