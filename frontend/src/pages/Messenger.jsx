import React, { useState, useEffect } from "react";
import {
    FlexboxGrid,
    Panel,
    Input,
    InputGroup,
    Form,
    Container,
    Header,
    Content,
    Footer,
    Avatar,
    List,
} from "rsuite";
import SendIcon from "@rsuite/icons/Send";
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
                console.log(response.data);
            })
            .catch((error) => {
                console.log(error);
            });
    }, [currentUser]); // useEffect will re-run whenever object in it's dependency array changes

    const sendMessage = () => {
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
        <FlexboxGrid justify="center" style={{ margin: "0.5rem" }}>
            <FlexboxGrid.Item colspan={6}>
                <Container>
                    <Header>
                        <Panel
                            bordered
                            style={{
                                marginRight: "0.5rem",
                            }}
                        >
                            SEARCH_INPUT
                        </Panel>
                    </Header>
                    <Content>
                        <List
                            hover
                            bordered
                            style={{
                                height: "85vh",
                                marginTop: "0.5rem",
                                marginRight: "0.5rem",
                            }}
                        >
                            {threads &&
                                threads.map((thread) => (
                                    <List.Item
                                        key={thread.id}
                                        onClick={(event) =>
                                            getThread(event, thread)
                                        }
                                    >
                                        <FlexboxGrid>
                                            <FlexboxGrid align="middle">
                                                <FlexboxGrid.Item
                                                    style={{
                                                        marginRight: "0.5rem",
                                                    }}
                                                >
                                                    <Avatar
                                                        size="md"
                                                        src={
                                                            thread.users.filter(
                                                                (user) =>
                                                                    user.id !==
                                                                    currentUser.id
                                                            )[0].image
                                                        }
                                                        alt="?"
                                                    />
                                                </FlexboxGrid.Item>
                                                <FlexboxGrid.Item>
                                                    <FlexboxGrid.Item
                                                        colspan={24}
                                                    >
                                                        {thread.type ===
                                                            "group" &&
                                                            thread.type + ": "}
                                                        {thread.users
                                                            .filter(
                                                                (user) =>
                                                                    user.id !==
                                                                    currentUser.id
                                                            )
                                                            .map(
                                                                (user) =>
                                                                    user.username
                                                            )}
                                                        <br />
                                                        {lastMessagePreview(
                                                            thread
                                                        )}
                                                    </FlexboxGrid.Item>
                                                </FlexboxGrid.Item>
                                            </FlexboxGrid>
                                        </FlexboxGrid>
                                    </List.Item>
                                ))}
                        </List>
                    </Content>
                </Container>
            </FlexboxGrid.Item>
            <FlexboxGrid.Item colspan={12}>
                <Container>
                    <Header>
                        <Panel
                            bordered
                            style={{
                                marginRight: "0.5rem",
                            }}
                        >
                            {selectedThread
                                ? selectedThread.users
                                      .filter(
                                          (user) => user.id !== currentUser.id
                                      )
                                      .map((user) => user.username)
                                : "SELECT_THREAD"}
                        </Panel>
                    </Header>
                    <Content>
                        <Panel
                            bordered
                            style={{
                                height: "85vh",
                                overflowY: "auto",
                                marginTop: "0.5rem",
                                marginRight: "0.5rem",
                            }}
                        >
                            <Container>
                                <Container style={{ minHeight: "85vh" }}>
                                    {selectedThread["messages"] &&
                                        selectedThread["messages"].map(
                                            (message) => (
                                                <Panel
                                                    bordered
                                                    key={message.id}
                                                    style={{
                                                        marginBottom: "0.5rem",
                                                        padding: "1px",
                                                        width: "50%",
                                                        marginLeft:
                                                            message.sender ===
                                                                currentUser.id &&
                                                            "50%",
                                                        backgroundColor:
                                                            message.sender ===
                                                            currentUser.id
                                                                ? "#445764"
                                                                : "#30373D",
                                                    }}
                                                >
                                                    <FlexboxGrid
                                                        justify="space-between"
                                                        align="middle"
                                                    >
                                                        <FlexboxGrid.Item>
                                                            {message.body}
                                                        </FlexboxGrid.Item>
                                                        <FlexboxGrid.Item>
                                                            <small>
                                                                {formatMessageTimestamp(
                                                                    message.created_at
                                                                )}
                                                            </small>
                                                        </FlexboxGrid.Item>
                                                    </FlexboxGrid>
                                                </Panel>
                                            )
                                        )}
                                </Container>
                                {selectedThread && (
                                    <Footer
                                        style={{
                                            position: "sticky",
                                            bottom: "0",
                                        }}
                                    >
                                        <Form
                                            onSubmit={sendMessage}
                                            style={{ marginTop: "0.5rem" }}
                                        >
                                            <InputGroup size="lg">
                                                <Input
                                                    value={input}
                                                    onChange={(event) =>
                                                        setInput(event)
                                                    }
                                                    required
                                                />
                                                <InputGroup.Button type="submit">
                                                    <SendIcon />
                                                </InputGroup.Button>
                                            </InputGroup>
                                        </Form>
                                    </Footer>
                                )}
                            </Container>
                        </Panel>
                    </Content>
                </Container>
            </FlexboxGrid.Item>
            <FlexboxGrid.Item colspan={6}>
                <Container>
                    <Header>
                        <Panel bordered>CONVERSATION_DETAILS</Panel>
                    </Header>
                    <Content>
                        <Panel
                            bordered
                            style={{
                                height: "85vh",
                                overflowY: "auto",
                                marginTop: "0.5rem",
                            }}
                        ></Panel>
                    </Content>
                </Container>
            </FlexboxGrid.Item>
        </FlexboxGrid>
    );
};

export default Messenger;
