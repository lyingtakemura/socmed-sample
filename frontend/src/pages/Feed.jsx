import React, { useState, useEffect } from "react";
import axios from "axios";
import { useSelector } from "react-redux";
import {
    FlexboxGrid,
    Panel,
    Input,
    InputGroup,
    Form,
    PanelGroup,
} from "rsuite";
import SendIcon from "@rsuite/icons/Send";

const Feed = () => {
    let currentUser = useSelector((state) => state.users.currentUser);
    const [posts, setPosts] = useState("");
    const [input, setInput] = useState("");

    useEffect(() => {
        axios
            .get("http://127.0.0.1:8000/posts/", {
                headers: {
                    Authorization: "Token " + currentUser.token,
                },
            })
            .then((response) => {
                setPosts(response.data);
            })
            .catch((error) => {
                console.log(error);
            });
    }, []); // posts in useEffect dependency causes infinite axios request loop

    const sendPost = () => {
        axios
            .post(
                "http://127.0.0.1:8000/posts/",
                {
                    body: input,
                },
                {
                    headers: {
                        Authorization: "Token " + currentUser.token,
                    },
                }
            )
            .then((response) => {
                console.log(response.data);
                let obj = response.data;
                let posts_temp = [...posts, obj];
                setPosts(posts_temp);
            })
            .catch((error) => {
                console.log(error);
            });
        setInput("");
    };

    return (
        <>
            <FlexboxGrid justify="center">
                <FlexboxGrid.Item colspan={22}>
                    <Panel bordered style={{ marginTop: "0.5rem" }}>
                        <Form onSubmit={sendPost}>
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

                    <PanelGroup>
                        {posts &&
                            posts.map(
                                (
                                    post //check if posts array have been loaded from axios request to state before render
                                ) => (
                                    <Panel
                                        header={`${post.user.username} at ${post.created_at}:`}
                                        key={post.id}
                                    >
                                        {post.body}
                                    </Panel>
                                )
                            )}
                    </PanelGroup>
                </FlexboxGrid.Item>
            </FlexboxGrid>
        </>
    );
};

export default Feed;
