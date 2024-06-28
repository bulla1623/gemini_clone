import { createContext, useState } from "react";
import runChat from "../config/Gemini";

export const Context = createContext();

const ContextProvider = (props) => {
    const [input, setInput] = useState("");
    const [recentPrompt, setRecentPrompt] = useState("");
    const [prevPrompts, setPrevPrompts] = useState([]);
    const [showResults, setShowResults] = useState(false);
    const [loading, setLoading] = useState(false);
    const [resultData, setResultData] = useState("");

    const delayPara = (index, nextWord) => {
        setTimeout(function () {
            setResultData((prev) => prev + nextWord);
        }, 75 * index);
    };

    const onSent = async (prompt) => {
        setResultData("");
        setLoading(true);
        setShowResults(true);

        let response;
        if (prompt !== undefined) {
            response = await runChat(prompt);
            setRecentPrompt(input);
        }
        else {
            setPrevPrompts(prev => [...prev, input]);
            setRecentPrompt(input);
            response = await runChat(input);
        }

        let responseArray = response.split("**");
        let newResponse = " ";
        for (let i = 0; i <responseArray.length; i++) {
            if (i === 0 || i % 2 !== 1) {
                newResponse += responseArray[i];
            } else {
                newResponse += "<b>" + responseArray[i] + "</b>";
            }
        }
        let newResponseWithLineBreak = newResponse.split("*").join("</br>");
        let newResponseArray = newResponseWithLineBreak.split(" ");
        // if there is space, it means there is new word
    
        // let newResponse2 = newResponse.split("*").join("</br>");
        // let newResponseArray = newResponse2.split(" ");
        for (let i = 0; i < newResponseArray.length; i++) {
            const nextWord = newResponseArray[i];
            delayPara(i, nextWord + " ");
        }
        setLoading(false);
        setInput("");
    };

    const contextValue = {
        prevPrompts,
        setPrevPrompts,
        onSent,
        setRecentPrompt,
        recentPrompt,
        input,
        setInput,
        showResults,
        loading,
        resultData,
    };
    return (
        <Context.Provider value={contextValue}>{props.children}</Context.Provider>
    );
};
export default ContextProvider;
