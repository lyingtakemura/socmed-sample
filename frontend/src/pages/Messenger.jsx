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
        let temp_thread = { ...selectedThread };
        temp_thread.messages = [...temp_thread.messages, ws_event];
        setSelectedThread(temp_thread);
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
        <FlexboxGrid justify="center" style={{ marginTop: "0.5rem" }}>
            <FlexboxGrid.Item colspan={4}>
                <Container>
                    <Header>
                        <Panel bordered>SEARCH_INPUT</Panel>
                    </Header>
                    <Content>
                        <Panel
                            bordered
                            style={{ height: "75vh", marginTop: "0.5rem" }}
                        >
                            {threads &&
                                threads.map((thread) => (
                                    <Panel
                                        bordered
                                        style={{ marginBottom: "0.5rem" }}
                                        key={thread.id}
                                        onClick={(event) =>
                                            getThread(event, thread)
                                        }
                                    >
                                        {thread.type +
                                            " with: " +
                                            thread.users.length +
                                            " users"}
                                    </Panel>
                                ))}
                        </Panel>
                        <Footer>
                            <Panel bordered style={{ marginTop: "0.5rem" }}>
                                -
                            </Panel>
                        </Footer>
                    </Content>
                </Container>
            </FlexboxGrid.Item>
            &nbsp;
            <FlexboxGrid.Item colspan={10}>
                <Container>
                    <Header>
                        <Panel bordered>THREAD_NAME</Panel>
                    </Header>
                    <Content>
                        <Panel
                            bordered
                            style={{
                                height: "75vh",
                                overflowY: "scroll",
                                marginTop: "0.5rem",
                            }}
                        >
                            {selectedThread["messages"] &&
                                selectedThread["messages"].map((message) => (
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
                        </Panel>
                    </Content>
                    <Footer>
                        <Panel bordered style={{ marginTop: "0.5rem" }}>
                            <Form onSubmit={sendMessage}>
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
                        </Panel>
                    </Footer>
                </Container>
            </FlexboxGrid.Item>
        </FlexboxGrid>
    );
};

export default Messenger;
