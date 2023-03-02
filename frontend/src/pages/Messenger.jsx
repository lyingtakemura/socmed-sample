import React, { useState, useEffect } from "react";
import axios from "axios";
import { useSelector } from "react-redux";

const Messenger = (props) => {
    const [input, setInput] = useState("");
    const [threads, setThreads] = useState("");
    const [selectedThread, setSelectedThread] = useState("");

    let currentUser = useSelector((state) => state.users.currentUser);
    const ws = props.ws;

    ws.onmessage = (e) => {
        let ws_event = JSON.parse(e.data).message;
        if (ws_event.thread === selectedThread.id) {
            let temp_thread = { ...selectedThread };
            temp_thread.messages = [...temp_thread.messages, ws_event];
            setSelectedThread(temp_thread);
        }
    };

    const lastMessagePreview = (thread) => {
        if (thread.messages.length >= 1) {
            return thread.messages[thread.messages.length - 1].body.slice(
                0,
                30
            );
        } else {
            return "No Messages";
        }
    };

    const formatMessageTimestamp = (input) => {
        const formatter = new Intl.DateTimeFormat("en-GB", {
            minute: "2-digit",
            hour: "2-digit",
        });
        const date = new Date(input);
        const result = formatter.format(date);
        return result;
    };

    useEffect(() => {
        axios
            .get("http://127.0.0.1:8000/threads/", {
                headers: {
                    Authorization: "Token " + currentUser.token,
                },
            })
            .then((response) => {
                setThreads(response.data);
            })
            .catch((error) => {
                console.log(error);
            });
    }, [currentUser]); // useEffect will re-run whenever object in it's dependency array changes

    const sendMessage = (event) => {
        event.preventDefault();
        axios
            .post(
                "http://127.0.0.1:8000/messages/",
                {
                    body: input,
                    thread: selectedThread.id,
                },
                {
                    headers: {
                        Authorization: "Token " + currentUser.token,
                    },
                }
            )
            .then((response) => {
                ws.send(
                    JSON.stringify({
                        message: response.data,
                    })
                );
            })
            .catch((error) => {
                console.log(error);
            });
        setInput("");
    };

    const getThread = (event, thread) => {
        axios
            .get("http://127.0.0.1:8000/threads/" + thread.id, {
                headers: {
                    Authorization: "Token " + currentUser.token,
                },
            })
            .then((response) => {
                setSelectedThread(response.data);
            });
    };

    return (
        <div className="flex font-bold space-x-1 m-1 w-1/2 mx-auto min-h-screen max-h-screen overflow-hidden">
            <div className="w-1/3 bg-gray-300 rounded-lg p-2">
                {threads &&
                    threads.map((thread) => (
                        <div
                            key={thread.id}
                            onClick={(event) => getThread(event, thread)}
                            className="mb-2 p-2 rounded-lg hover:bg-green-500/20"
                        >
                            <div className="flex space-x-1">
                                <img
                                    className="w-12 rounded-lg"
                                    src={
                                        "http://localhost:8000" +
                                        thread.users.filter(
                                            (user) => user.id !== currentUser.id
                                        )[0].image
                                    }
                                    alt="..."
                                />
                                <div>
                                    {thread.type === "group" &&
                                        thread.type + ": "}
                                    {thread.users
                                        .filter(
                                            (user) => user.id !== currentUser.id
                                        )
                                        .map((user) => user.username)}
                                    <br />
                                    {lastMessagePreview(thread)}
                                </div>
                            </div>
                        </div>
                    ))}
            </div>
            <div className="w-2/3 bg-gray-300 rounded-lg p-2 overflow-y-scroll">
                <div className="text-center mb-2 p-2">
                    {selectedThread
                        ? selectedThread.users
                              .filter((user) => user.id !== currentUser.id)
                              .map((user) => user.username)
                        : "SELECT_THREAD"}
                </div>
                <div>
                    {selectedThread["messages"] &&
                        selectedThread["messages"].map((message) => (
                            <div
                                className={`flex ${
                                    message.sender === currentUser.id
                                        ? "flex-row-reverse"
                                        : ""
                                }`}
                                key={message.id}
                            >
                                <div
                                    className="p-2 mb-2 rounded-lg w-1/2 bg-green-500/20"
                                    key={message.id}
                                >
                                    <div>{message.body}</div>
                                    <div className="text-xs">
                                        {formatMessageTimestamp(
                                            message.created_at
                                        )}
                                    </div>
                                </div>
                            </div>
                        ))}
                </div>
                <div className="sticky bottom-0 bg-gray-300">
                    <form onSubmit={sendMessage}>
                        <input
                            className="p-2 rounded-lg bg-green-500/20 w-full mb-2 focus:outline-none"
                            value={input}
                            onChange={(event) => setInput(event.target.value)}
                            required
                        />
                        <button
                            type="submit"
                            className="p-2 rounded-lg w-full bg-green-500/20"
                        >
                            Send
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default Messenger;
