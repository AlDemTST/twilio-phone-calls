const { DirectLine, ConnectionStatus } = require('botframework-directlinejs');
const { v4: generateUID } = require('uuid');
const secretKey = process.env.BOTFRAMEWORK_SECRET_KEY;
const botName = process.env.BOT_NAME;

const initDirectLine = function () {
    const directLine = new DirectLine({
        secret: secretKey /* put your Direct Line secret here */,
        // token: /* or put your Direct Line token here (supply secret OR token, not both) */, 
        // domain: 'http://127.0.0.1:3978/api/messages', /* optional: if you are not using the default Direct Line endpoint, e.g. if you are using a region-specific endpoint, put its full URL here */
        // webSocket: false, /* optional: false if you want to use polling GET to receive messages. Defaults to true (use WebSocket). */
        // pollingInterval: /* optional: set polling interval in milliseconds. Defaults to 1000 */,
        // timeout: /* optional: a timeout in milliseconds for requests to the bot. Defaults to 20000 */,
        // conversationStartProperties: { /* optional: properties to send to the bot on conversation start */
        //     locale: 'en-US'
        // }
    });
    connectionStatus(directLine);

    return directLine;
}

function connectionStatus(botDirectLine) {
    botDirectLine.connectionStatus$
        .subscribe(connectionStatus => {
            switch(connectionStatus) {
                case ConnectionStatus.Uninitialized:    // the status when the DirectLine object is first created/constructed
                    console.log('directLine.connectionStatus$: Uninitialized');
                break;
                case ConnectionStatus.Connecting:       // currently trying to connect to the conversation
                    console.log('directLine.connectionStatus$: Connecting');
                break;
                case ConnectionStatus.Online:           // successfully connected to the converstaion. Connection is healthy so far as we know.
                    console.log('directLine.connectionStatus$: Online');
                break;
                case ConnectionStatus.ExpiredToken:     // last operation errored out with an expired token. Your app should supply a new one.
                    console.log('directLine.connectionStatus$: ExpiredToken');
                break;
                case ConnectionStatus.FailedToConnect:  // the initial attempt to connect to the conversation failed. No recovery possible.
                    console.log('directLine.connectionStatus$: FailedToConnect');
                break;
                case ConnectionStatus.Ended:            // the bot ended the conversation
                    console.log('directLine.connectionStatus$: Ended');
                break;
            }
        });
}

const sendMessageToBot = function (directLine, messageText) { // TODO: add param - generated userId
    userId = 'voiceCallUserID'; // TODO: change to generateUserId() method

    directLine.postActivity({
        from: { id: userId, name: 'voiceCallUserName' },
        name: 'data_transfer/phone_voice_dialog',
        type: 'message',
        text: messageText
    }).subscribe(
        id => console.log('Posted activity, assigned ID ', id),
        error => console.log('Error posting activity: //', error)
    );
}

const getBotMessage = function (directLine) {
    const messagePromise = new Promise((resolve, reject) => {
        directLine.activity$
            .filter(activity => activity.type === 'message' && activity.from.id === botName)
            .subscribe(
                message => resolve(message.text),
                error => console.log('getBotMessage error: //', error)
            );
    });
    return messagePromise;
}

const generateUserId = function () {
    try {
        return generateUID();
    } catch(err) {
        console.log('generateUserId() error: //', err);
    }
}

module.exports.initDirectLine = initDirectLine;
module.exports.sendMessageToBot = sendMessageToBot;
module.exports.getBotMessage = getBotMessage;
module.exports.generateUserId = generateUserId;