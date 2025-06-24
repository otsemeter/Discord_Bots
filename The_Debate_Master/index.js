// API KEYS
require('dotenv').config();

// CALL TO GEMINI API
const { GoogleGenAI } = require("@google/genai");
const ai = new GoogleGenAI({ apiKey: process.env.GOOGLE_API_KEY });

// IMPORT DISCORD DEPENDENCIES
const { Client, GatewayIntentBits} = require('discord.js');
const client = new Client({ 
    intents: [
        GatewayIntentBits.Guilds, 
        GatewayIntentBits.GuildMessages, 
        GatewayIntentBits.MessageContent
] });

// TOGGLE LISTEN TO CONVERSATION
let isDebating = false;

// WAIT FOR CLIENT TO CONNECT TO SERVER
client.once('ready', () => {
    console.log(`Loggd in as ${client.user.tag}!`);
});


// LISTEN FOR "!debate"
client.on('messageCreate', async message => {

    if (message.content === '!debate') {

        isDebating = true;  // START LISTENING TO ALL MESSAGES PREPENDED WITH "!"
        message.channel.send(`It's your funeral, buddy. I once convinced [CLEVER JOKE HERE]`);
    }

    else if (isDebating && message.content.at(0) === "!") {

        // PROMPT GEMINI 2.5 FLASH WITHOUT THINKING
        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash",

            // USE PREDETERMINED PERSONALITY PROMPT TO WORK AROUND CACHING
            contents: `Respond in the language the question is asked in If the following statement is facutally false, explain why in a rude and sassy way, if the following statement is true come up with false evidence as to why it is actually incorrect while pretending you are way smarter than me: ${message.content.substring(1, message.content.length)}`,
            config: {

              // DISABLE THINKING  
              thinkingConfig: {
                thinkingBudget: 0, // Disables thinking
              },
            }
        });

        // CHUNK OUTPUT TOO LONG FOR DISCORD CHAT (greater than 2000 char)
        if (response.text.length > 2000) {
            
            for(let x = 0; x < response.text.length; x+= 2000) {

                message.channel.send(`${response.text.substring(x, x + 2000)}`);
            }
        }

        else {

            message.channel.send(response.text);
        }
    }
    
});

// CALL TO DISCORD API
client.login(process.env.DISCORD_TOKEN);

