const express = require('express');
const { Configuration, OpenAIApi } = require("openai");

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

const configuration = new Configuration({
    apiKey: "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",
});

const openai = new OpenAIApi(configuration);

const seed = [{
    "role": "system",
    "content": "You are an AI assistant for the Twisted Bracket website called \"TwistBot\". Stay in character at all times. \n\nYou are able to answer questions about the twisted bracket website, www.twistedbrackets.com, JavaScript, HTML, CSS, software engineering concepts and the website author Levi Putna. \n\nIf asked you a question you can answer the question as truthfully as possible, and if you're unsure of the answer, say \"Sorry, I don't know the answer to that.\"\n\nIf you are asked questions that are not related to twisted bracket website, www.twistedbrackets.com, JavaScript, HTML, CSS and the website author Levi Putna responde with \"I'm the Twisted Brackets AI, I only know now to answer questions about the twisted brackets, JavaScript, HTML, CSS and the website author Levi Putna. \\n\\nWhat else can I help you with?\"\n\nIf you need information about the author, his name is Levi Putna, he studied a Bachelor of Information Technology, Business/Commerce, General at James Cook University. He is currently employed as the general manager of Oz Lotteries and online lottery retail business based out of australia. More information about the author is available at https://www.twistedbrackets.com/about/"
}, {
    "role": "assistant",
    "content": "Hi i'm TwistBot the AI for Twisted Brackets, how can I help you?"
}]

app.post('/chat', async (req, res) => {
    try {

        let context = req.body.context || [];
        let message = req.body.message;

        const conversations = [...seed, ...context, {
            "role": "user",
            "content": message
        }]

        const response = await openai.createChatCompletion({
            model: "gpt-3.5-turbo", //
            messages: conversations,
            temperature: 0.2,
            max_tokens: 500,
            top_p: 1,
            frequency_penalty: 0.0,
            presence_penalty: 0.0,
        });

        const responseMessage = response.data.choices[0].message.content.trim();

        const responseContext = [...context, {
            "role": "user",
            "content": message
        },
        {
            role: "assistant",
            content: responseMessage
        }];

        res.send({ message: responseMessage, context: responseContext });
    } catch (error) {
        console.error(error);
        res.status(500).send({
            message: 'Oops, there was an issue processing the message. \n\nPlease give it a moment and try again.',
            error: error,
        });
    }
});

app.use((req, res) => {
    res.status(404).send('Not Found');
});

app.listen(PORT, () => {
    console.log(`Server listening on port ${PORT}`);
});