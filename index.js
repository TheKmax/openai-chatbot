const express = require('express')
const app = express()
const bodyParser = require('body-parser')
const path = require('path')
const OpenAI = require('openai-api')

const port = 3000;

const config = require('./config.json')

const OPENAI_API_KEY = config.openai_api_key;

const openai = new OpenAI(OPENAI_API_KEY);

app.use( bodyParser.json());
app.use(bodyParser.urlencoded({
  extended: true
})); 

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname+'/view.html'));
})

app.post('/', async (req, res) => {
    let prompt = 'Answer questions from a a user:\n###\n';
    prompt += req.body.prompt

    const response = await openai.complete({
        engine: "text-davinci-003",
        prompt,
        temperature: 0.7,
        maxTokens: 256,
        topP: 1,
        frequencyPenalty: 0,
        presencePenalty: 0,

        stop: ['###', "<endoftext>"]
    });

    res.send(response.data.choices[0].text);
});

app.listen(port, () => {
  console.log(`App listening on port ${port}`)
})