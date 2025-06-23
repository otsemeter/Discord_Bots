require('dotenv').config();
const { GoogleGenAI } = require("@google/genai");
const ai = new GoogleGenAI({ apiKey: process.env.GOOGLE_API_KEY });
const { Client, GatewayIntentBits} = require('discord.js');
const client = new Client({ 
    intents: [
        GatewayIntentBits.Guilds, 
        GatewayIntentBits.GuildMessages, 
        GatewayIntentBits.MessageContent
] });

let isDebating = false;

client.once('ready', () => {
    console.log(`Loggd in as ${client.user.tag}!`);
});

client.on('messageCreate', async message => {
    if (message.content === '!debate') {
        isDebating = true;
        message.channel.send(`It's your funeral, buddy. I once convinced [CLEVER JOKE HERE]`);
    }
    else if (isDebating && message.content.at(0) === "!")
    {
        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: `Respond in the language the question is asked in If the following statement is facutally false, explain why in a rude and sassy way, if the following statement is true come up with false evidence as to why it is actually incorrect while pretending you are way smarter than me: ${message.content.substring(1, message.content.length)}`,
            config: {
              thinkingConfig: {
                thinkingBudget: 0, // Disables thinking
              },
            }
        });
        if (response.text.length > 2000)
        {
            for(let x = 0; x < response.text.length; x+= 2000)
            {
                message.channel.send(`${response.text.substring(x, x + 2000)}`);
            }
        }
        else
            message.channel.send(response.text);      
    }
});

client.login(process.env.DISCORD_TOKEN);

