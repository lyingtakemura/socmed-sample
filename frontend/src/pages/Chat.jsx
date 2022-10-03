import React, { useState, useEffect } from "react";
import { FlexboxGrid, Panel, Input, InputGroup, Form } from "rsuite";
import SendIcon from "@rsuite/icons/Send";
import axios from "axios";
import { useSelector } from "react-redux";

const Chat = (props) => {
    const [input, setInput] = useState("");
    const [messages, setMessages] = useState("");
    const [contacts, setContacts] = useState("");
    const [currentChat, setCurrentChat] = useState("");

    let currentUser = useSelector((state) => state.users.currentUser);
    const ws = props.ws;

    ws.onmessage = (e) => {
        let ws_event = JSON.parse(e.data).message;
        let messages_temp = [...messages];
        messages_temp.push(ws_event);
        setMessages(messages_temp);
    };

    useEffect(() => {
        axios
            .get("http://127.0.0.1:8000/contacts/", {
                headers: {
                    Authorization: "Token " + currentUser.token,
                },
            })
            .then((response) => {
                setContacts(response.data);
                // console.log(response.data);
            })
            .catch((error) => {
                console.log(error);
            });
    }, []); // without second param useEffect will stuck in update loop

    const sendMessage = () => {
        // console.log(ws);
        // console.log(input);
        axios
            .post(
                "http://127.0.0.1:8000/messages/",
                {
                    body: input,
                    receiver: currentChat,
                },
                {
                    headers: {
                        Authorization: "Token " + currentUser.token,
                    },
                }
            )
            .then((response) => {
                console.log(response.data);
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

    const getMessages = (event, receiverId) => {
        setCurrentChat(receiverId);
        // console.log(receiverId);
        axios
            .get("http://127.0.0.1:8000/messages?receiver=" + receiverId, {
                headers: {
                    Authorization: "Token " + currentUser.token,
                },
            })
            .then((response) => {
                console.log(response.data);
                setMessages(response.data);
            });
    };

    return (
        <>
            <FlexboxGrid justify="center" style={{ marginTop: "0.5rem" }}>
                <FlexboxGrid.Item colspan={6}>
                    <Panel
                        header="{CHATS_LIST}"
                        bordered
                        style={{ height: "80vh" }}
                    >
                        {contacts &&
                            contacts.map((contact) => (
                                <Panel
                                    bordered
                                    style={{ marginBottom: "0.5rem" }}
                                    key={contact.id}
                                    onClick={(event) =>
                                        getMessages(event, contact.id)
                                    }
                                >
                                    {contact.username}
                                </Panel>
                            ))}
                    </Panel>
                </FlexboxGrid.Item>
                &nbsp;
                <FlexboxGrid.Item colspan={12}>
                    <Panel
                        header="{CURRENT_CHAT_NAME}"
                        bordered
                        style={{ height: "80vh", overflowY: "scroll" }}
                    >
                        {messages &&
                            messages.map((message) => (
                                <Panel
                                    bordered
                                    key={message.id}
                                    style={{ marginBottom: "0.5rem" }}
                                    align={
                                        message.sender === currentUser.id
                                            ? "right"
                                            : ""
                                    }
                                >
                                    {message.body} | {message.created_at}
                                </Panel>
                            ))}

                        {/* <form onSubmit={event => sendMessage(event)}>
            <input placeholder='type message' value={input} onChange={event => setInput(event.target.value)} />
            <input type="submit" value="send" />
          </form> */}
                    </Panel>
                    <Form
                        onSubmit={sendMessage}
                        style={{ marginTop: "0.5rem" }}
                    >
                        <InputGroup size="lg">
                            <Input
                                value={input}
                                onChange={(event) => setInput(event)}
                                required
                            />
                            <InputGroup.Button type="submit">
                                <SendIcon />
                            </InputGroup.Button>
                        </InputGroup>
                    </Form>
                </FlexboxGrid.Item>
            </FlexboxGrid>
        </>
    );
};

export default Chat;
