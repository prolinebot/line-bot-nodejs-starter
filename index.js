'use strict';

const line = require('@line/bot-sdk');
const express = require('express');
const config = require('./config.json');

// create LINE SDK client
const client = new line.Client(config);

const app = express();

// webhook callback
app.post('/webhook', line.middleware(config), (req, res) => {
  // req.body.events should be an array of events
  if (!Array.isArray(req.body.events)) {
    return res.status(500).end();
  }
  // handle events separately
  Promise.all(req.body.events.map(event => {
    console.log('event', event);
    // check verify webhook event
    if (event.replyToken === '00000000000000000000000000000000' ||
      event.replyToken === 'ffffffffffffffffffffffffffffffff') {
      return;
    }
    return handleEvent(event);
  }))
    .then(() => res.end())
    .catch((err) => {
      console.error(err);
      res.status(500).end();
    });
});

// simple reply function
const replyText = (token, texts) => {
  texts = Array.isArray(texts) ? texts : [texts];
  return client.replyMessage(
    token,
    texts.map((text) => ({ type: 'text', text }))
  );
};

// callback function to handle a single event
function handleEvent(event) {
  switch (event.type) {
    case 'message':
      const message = event.message;
      switch (message.type) {
        case 'text':
          return handleText(message, event.replyToken);
        case 'image':
          return handleImage(message, event.replyToken);
        case 'video':
          return handleVideo(message, event.replyToken);
        case 'audio':
          return handleAudio(message, event.replyToken);
        case 'location':
          return handleLocation(message, event.replyToken);
        case 'sticker':
          return handleSticker(message, event.replyToken);
        default:
          throw new Error(`Unknown message: ${JSON.stringify(message)}`);
      }

    case 'follow':
      return replyText(event.replyToken, 'Got followed event');

    case 'unfollow':
      return console.log(`Unfollowed this bot: ${JSON.stringify(event)}`);

    case 'join':
      return replyText(event.replyToken, `Joined ${event.source.type}`);

    case 'leave':
      return console.log(`Left: ${JSON.stringify(event)}`);

    case 'postback':
      let data = event.postback.data;
      return replyText(event.replyToken, `Got postback: ${data}`);

    case 'beacon':
      const dm = `${Buffer.from(event.beacon.dm || '', 'hex').toString('utf8')}`;
      return replyText(event.replyToken, `${event.beacon.type} beacon hwid : ${event.beacon.hwid} with device message = ${dm}`);

    default:
      throw new Error(`Unknown event: ${JSON.stringify(event)}`);
  }
}

function handleText(message, replyToken) {
  return replyText(replyToken, message.text);
}

function handleImage(message, replyToken) {
  return replyText(replyToken, 'Got Image');
}

function handleVideo(message, replyToken) {
  return replyText(replyToken, 'Got Video');
}

function handleAudio(message, replyToken) {
  return replyText(replyToken, 'Got Audio');
}

function handleLocation(message, replyToken) {
  return replyText(replyToken, 'Got Location');
}

function handleSticker(message, replyToken) {
  return replyText(replyToken, 'Got Sticker');
}

const port = config.port;
app.listen(port, () => {
  console.log(`listening on ${port}`);
});

const functions = require('firebase-functions')
const request = require('request-promise')

const LINE_MESSAGING_API = 'https://api.line.me/v2/bot/message'
const LINE_HEADER = {
  'Content-Type': 'application/json',
  Authorization: `Bearer {
const functions = require('firebase-functions')
const request = require('request-promise')

const LINE_MESSAGING_API = 'https://api.line.me/v2/bot/message'
const LINE_HEADER = {
  'Content-Type': 'application/json',
  Authorization: `Bearer {Authen Key Line}` //// ----> LINE Authentication Key (Channel access token)
}

let node_ssh = require('node-ssh')
let ssh = new node_ssh()

exports.LineBot = functions.https.onRequest((req, res) => {
  reply(req.body)
})

const reply = bodyResponse => {
  const command = bodyResponse.events[0].message.text
  ssh
    .connect({
      host: 'ec2.compute.amazonaws.com', //// ----> host ของเครื่องที่เราจะเข้าไปใช้งาน
      username: 'ec2-user',
      privateKey: 'privatekey.pem'  //// ----> ที่อยู่ของ privatekey.pem ไว้ที่ /functions/privatekey.pem
    })
    .then((result, error) => {
      ssh
        .execCommand(command, { cwd: '/var/www' })
        .then(function(result) {
          request({
            method: `POST`,
            uri: `${LINE_MESSAGING_API}/reply`,
            headers: LINE_HEADER,
            body: JSON.stringify({
              replyToken: bodyResponse.events[0].replyToken,
              messages: [
                {
                  type: `text`,
                  text: result.stdout
                }
              ]
            })
          })
            .then(() => {
              return res.status(200).send(`Done`)
            })
            .catch(error => {
              return Promise.reject(error)
            })
        })
        .catch(error => {
          return Promise.reject(error)
        })
    })
    .catch(error => {
      return Promise.reject(error)
    })
}
view rawsshlinebot.js hosted with ❤ by GitHub}` //// ----> LINE Authentication Key (Channel access token)
}

let node_ssh = require('node-ssh')
let ssh = new node_ssh()

exports.LineBot = functions.https.onRequest((req, res) => {
  reply(req.body)
})

const reply = bodyResponse => {
  const command = bodyResponse.events[0].message.text
  ssh
    .connect({
      host: 'ec2.compute.amazonaws.com', //// ----> host ของเครื่องที่เราจะเข้าไปใช้งาน
      username: 'ec2-user',
      privateKey: 'privatekey.pem'  //// ----> ที่อยู่ของ privatekey.pem ไว้ที่ /functions/privatekey.pem
    })
    .then((result, error) => {
      ssh
        .execCommand(command, { cwd: '/var/www' })
        .then(function(result) {
          request({
            method: `POST`,
            uri: `${LINE_MESSAGING_API}/reply`,
            headers: LINE_HEADER,
            body: JSON.stringify({
              replyToken: bodyResponse.events[0].replyToken,
              messages: [
                {
                  type: `text`,
                  text: result.stdout
                }
              ]
            })
          })
            .then(() => {
              return res.status(200).send(`Done`)
            })
            .catch(error => {
              return Promise.reject(error)
            })
        })
        .catch(error => {
          return Promise.reject(error)
        })
    })
    .catch(error => {
      return Promise.reject(error)
    })
}
view rawsshlinebot.js hosted with ❤ by GitHub
