import React, { useState, useEffect } from "react";
import axios from "axios";
import { useSelector } from "react-redux";
import { FlexboxGrid, Panel, Input, InputGroup, Form } from "rsuite";
import ExpandOutlineIcon from "@rsuite/icons/ExpandOutline";

const Home = () => {
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
    }, [currentUser]); // posts in useEffect dependency causes infinite axios request loop

    const formatDateTime = (input) => {
        let time = new Date(input);
        let result = `on ${time.getDate()}/${time.getMonth()}/${time.getFullYear()} at ${time.getHours()}:${time.getMinutes()}`;
        return result;
    };

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
                let posts_temp = [obj, ...posts];
                setPosts(posts_temp);
            })
            .catch((error) => {
                console.log(error);
            });
        setInput("");
    };

    return (
        <>
            <FlexboxGrid justify="center" style={{ margin: "0.5rem" }}>
                <FlexboxGrid.Item colspan={12} sm ={24}>
                    <Form
                        onSubmit={sendPost}
                        style={{
                            marginBottom: "0.5rem",
                            position: "sticky",
                            top: "0",
                        }}
                    >
                        <InputGroup size="lg">
                            <Input
                                value={input}
                                onChange={(event) => setInput(event)}
                                required
                            />
                            <InputGroup.Button type="submit">
                                <ExpandOutlineIcon />
                            </InputGroup.Button>
                        </InputGroup>
                    </Form>
                    {posts &&
                        posts.map(
                            (
                                post //check if posts array have been loaded from axios request to state before render
                            ) => (
                                <Panel
                                    header={`${
                                        post.user.username
                                    } ${formatDateTime(post.created_at)}:`}
                                    key={post.id}
                                    bordered
                                    style={{ marginBottom: "0.5rem" }}
                                >
                                    {post.body}
                                </Panel>
                            )
                        )}
                </FlexboxGrid.Item>
            </FlexboxGrid>
        </>
    );
};

export default Home;
