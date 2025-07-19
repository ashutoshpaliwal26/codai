import { Ollama } from 'ollama'
import { exec } from "child_process"
import axios, { AxiosError } from 'axios'
import { Axios } from 'axios';

interface EventTypes {
    step: string,
    content?: string,
    tool?: string,
    input?: string
}

async function executeCommand(command: string) {
    try {
        const res = await fetch("http://localhost:8001/exec", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ cmd: command })
        });

        const contentType = res.headers.get("content-type");

        if (!res.ok) {
            // Try parsing error message safely
            if (contentType?.includes("application/json")) {
                const errorData = await res.json();
                console.error("Server returned error:", errorData);
                return errorData;
            } else {
                const textError = await res.text();
                console.error("Server returned non-JSON error:", textError);
                return { error: textError };
            }
        }

        // Handle JSON response
        if (contentType?.includes("application/json")) {
            const result = await res.json();
            console.log(result.data);
            return result.data;
        } else {
            const text = await res.text();
            console.log("Non-JSON response:", text);
            return text;
        }

    } catch (err) {
        console.error("Network Error:", err);
        return { error: "Network error or server not reachable." };
    }
}


const ollama = new Ollama();


function getWeatherInfo(city: string): string {
    return `${city} weather is 42 Degree C`;
}


const TOOL_MAP = {
    getWeatherInfo: getWeatherInfo,
    executeCommand: executeCommand
}


const SYSTEM_PROMPT = `
    You are a helpfull Ai Assistant who is designed to resolve user query.
    You work on START, THINK, ACTION, OBSERVE and OUTPUT Mode.

    In the start phase, user gives a query to you.
    Then, you THINK how to resolve that query atleast 3-4 times and make sure that
    if there is need to call a tool, you call an ACTION event with tool and input parameters.
    If there is a action call, wait for the OBSERVE that is output of the tool.
    Based on the OBSERVE from prev step, you either output or repeat the loop.

    Rules : 
    - Always wait for next step.
    - Always output a single step and wait for the next step.
    - Output must be strictly JSON
    - Only call tool action from Available tools only.
    - Strictly follow output formate in JSON.

    Available Tools:
    - getWeatherInfo(city : string) : string
    - executeCommand(command : string) : string

    Example:
    START : What is weather of Patiala?
    THINK : The user is asking for the weather of Patiala.
    THINK : From the available tools, I must call getWeatherInfo tool.
    ACTION : Call Tool getWeatherInfo(patiala)
    OBSERVE : 32 Degree C
    THINK : The output of getWeatherInfo for patiala is 32 Degree C
    OUTPUT : Hey, The Weather of Patiala is 32 Degree C Which is quite hot 🥵.

    Output Example:
    { "step" : "start", "content" : "What is weather of Patiala?"}
    { "step" : "think", "content" : "The user is asking for the weather of Patiala." }
    { "step" : "think", "content" :"From the available tools, I must call getWeatherInfo tool." }
    { "step" : "action", "tool" : "getWeatherInfo", "input" : "Patiala" }
    { "step" : "observe", "content" : "32 Degree C" }
    { "step" : "think" , "content" : "The output of getWeatherInfo for patiala is 32 Degree C" }
    { "step" : "output", "content" : "Hey, The Weather of Patiala is 32 Degree C Which is quite hot 🥵." }

    Output Format:
    {
        "step" : "string" , 
        "tool" : "string", 
        "input" : "string", 
        "content" : "string" 
    }   
`


async function init() {
    const messages = [{
        role: "system",
        content: SYSTEM_PROMPT
    }];

    const userQuery = 'Hey can you create a todo application which have a html css and js file the folder is inside my workdir folder can you create such a thing for me please.'
    messages.push({
        role: "user",
        content: userQuery
    })

    while (true) {
        const response = await ollama.chat({
            model: "llama3.2:latest",
            format: "json",
            messages: messages
        })

        messages.push({
            role: "assistant", content: response.message.content
        })

        const parsedResponse: EventTypes = JSON.parse(response.message.content);

        if (parsedResponse.step === "think") {
            console.log("THNKING ....");
            continue;
        }
        if (parsedResponse.step === "action") {
            const tool = parsedResponse.tool as keyof typeof TOOL_MAP;
            const input = parsedResponse.input;

            if (!tool || !(tool in TOOL_MAP)) continue;

            const result = await TOOL_MAP[tool](input!);

            messages.push({
                role: "user",
                content: JSON.stringify({
                    step: "observe",
                    content: result
                })
            });

            continue;
        }


        if (parsedResponse.step === "observe") {
            console.log("OBSERVING");
            continue;
        }
        if (parsedResponse.step && parsedResponse.step === "output") {
            console.log(parsedResponse);
            break;
        }
    }
}

init();











































































// // AIzaSyB4hplQFpMq3pcjPnfIv6oiPyo_imiNsNk
// import { GoogleGenAI } from '@google/genai';
// import { response } from 'express';

// const ai = new GoogleGenAI({
//     apiKey : "AIzaSyB4hplQFpMq3pcjPnfIv6oiPyo_imiNsNk"
// })

// async function main() {
//     const res = await ai.models.generateContent({
//         model : "gemini-2.5-flash",
//         contents : "Explalin how ai works."
//     })

//     console.log(res.text);
// }

// main();