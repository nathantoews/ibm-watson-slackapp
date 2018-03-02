'use strict';
const Botkit       = require('botkit');
const request      = require('superagent');
const slack_token  = process.env.SLACK_TOKEN;
const slack_oauth  = process.env.SLACK_OAUTH;


var middleware = require('botkit-middleware-watson')({
  username: process.env.CONVERSATION_USERNAME,
  password: process.env.CONVERSATION_PASSWORD,
  workspace_id: process.env.WORKSPACE_ID,
  url: process.env.CONVERSATION_URL || 'https://gateway.watsonplatform.net/conversation/api',
  version_date: '2017-05-26'
});

exports.fn = {

	/**
	 * Starts Slack-Bot
	 *
	 * @returns {*}
	 */
	slackBot() {

		// initialisation

		const slackController = Botkit.slackbot({
		});
		const slackBot = slackController.spawn({
			token: slack_token
		});

		let bot_name = '';
		
		// create rtm connection

		slackBot.startRTM((err, bot, payload) => {
			if (err) {
				throw new Error('Could not connect to Slack');
			}
			bot_name = payload.self.name;
			// post a message to #general when bot is loaded
			slackController.log('Sending initial salutation...');
			bot.reply({channel: '#watsonchannel'},
				`Howdy! \n I am glad to be part of the ${payload.team.name} team! \n My name is *${bot_name}* and I am here to help you.`)
		});

		// event listeners that handle incoming messages

		slackController.hears(['.*'], ['direct_message', 'direct_mention', 'mention'], function(bot, message) {
		  slackController.log('Slack message received');
		  middleware.interpret(bot, message, function() {
		  	console.log(message);
		    if (message.watsonError) {
		      console.log(message.watsonError);
		      bot.reply(message, "I'm sorry, but for technical reasons I can't respond to your message");
		    } else {
		      bot.reply(message, message.watsonData.output.text.join('\n'));
		    }
		  });
		});

	}
};
