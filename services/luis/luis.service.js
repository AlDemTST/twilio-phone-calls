const axios = require('axios');
const intentionRequestUrl = 'https://eastus.api.cognitive.microsoft.com/luis/prediction/v3.0/apps/105962c5-1771-479a-ba83-1e09ddcfd25b/slots/staging/predict?subscription-key=d5e85de8e7934d09af78be430ebfb33c&verbose=true&show-all-intents=true&log=true';

const getIntent = function (speechResult) {
    let intentionPromise = new Promise((resolve, reject) => {
        axios.get(`${intentionRequestUrl}&query=${speechResult}`)
        .then(response => {
            let intentionResult = response.data.prediction.topIntent;
            console.log('intention response: //', intentionResult);
            resolve(intentionResult);
        })
        .catch(error => {
            console.log('intention request error: //', error);
        });
    });

    return intentionPromise;
}

module.exports.getIntent = getIntent;