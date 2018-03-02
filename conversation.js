'use strict';

// new instance of Conversation
const middleware = require('botkit-middleware-watson')({
  username: process.env.CONVERSATION_USERNAME,
  password: process.env.CONVERSATION_PASSWORD,
  workspace_id: process.env.WORKSPACE_ID,
  url: process.env.CONVERSATION_URL || 'https://gateway.watsonplatform.net/conversation/api',
  version_date: '2017-05-26'
});
/**
 * Call to Conversation API: send message
 * 
 * @param {string} text 
 * @param {object} context 
 * @returns {promise}
 */
exports.sendMessage = (text, context) => {
  const payload = {
    workspace_id: process.env.WORKSPACE_ID,
    input: {
      text: text
    },
    context: context
  };
  return new Promise((resolve, reject) => watsonMiddleware.message(payload, function(err, data) {
    if (err) {
      reject(err);
    } else {
      resolve(data);
    }
  }));
};

