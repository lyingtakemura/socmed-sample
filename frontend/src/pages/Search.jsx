import React, { useState, useEffect } from "react";
import axios from "axios";
import { useSelector } from "react-redux";
import {
    FlexboxGrid,
    Panel,
    Input,
    InputGroup,
    Form,
    Button,
    Row,
    Col,
} from "rsuite";
import SendIcon from "@rsuite/icons/Send";

const Search = () => {
    let currentUser = useSelector((state) => state.users.currentUser);
    const [users, setUsers] = useState("");
    const [input, setInput] = useState("");

    const getUsers = () => {
        axios
            .get("http://127.0.0.1:8000/users/", {
                headers: {
                    Authorization: "Token " + currentUser.token,
                },
            })
            .then((response) => {
                // console.log(response.data);
                setUsers(response.data);
            })
            .catch((error) => {
                console.log(error);
            });
    };

    useEffect(() => {
        getUsers();
    }, []);

    const toggleFollow = (event, id) => {
        console.log(id);
        axios
            .patch(
                `http://127.0.0.1:8000/users/${currentUser.id}/`,
                {
                    follow: id,
                },
                {
                    headers: {
                        Authorization: "Token " + currentUser.token,
                    },
                }
            )
            .then((response) => {
                // TODO: take user object from response and replace itself in state array,
                // instead of making new request to server
                console.log(response.data);
                getUsers();
            })
            .catch((error) => {
                console.log(error.response);
            });
    };

    return (
        <>
            <FlexboxGrid justify="center">
                <FlexboxGrid.Item colspan={22}>
                    {/* <Panel bordered style={{ marginTop: "0.5rem" }}>
                        <Form onSubmit={() => console.log("search")}>
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
                    </Panel> */}

                    <Row>
                        {users &&
                            users.map((user) => (
                                <Col
                                    md={6}
                                    sm={24}
                                    style={{ marginTop: "0.5rem" }}
                                    key={user.id}
                                >
                                    <Panel bordered>
                                        <FlexboxGrid justify="space-between">
                                            <FlexboxGrid.Item colspan={5}>
                                                {user.username}
                                            </FlexboxGrid.Item>
                                            <FlexboxGrid.Item colspan={5}>
                                                Followers:{" "}
                                                {user.followers.length}
                                            </FlexboxGrid.Item>
                                        </FlexboxGrid>
                                        <hr />
                                        <Button
                                            appearance={
                                                user.followers.includes(
                                                    currentUser.id
                                                )
                                                    ? "default"
                                                    : "primary"
                                            }
                                            block
                                            size="sm"
                                            onClick={(event) =>
                                                toggleFollow(event, user.id)
                                            }
                                        >
                                            {user.followers.includes(
                                                currentUser.id
                                            )
                                                ? "Following"
                                                : "Follow"}
                                        </Button>
                                    </Panel>
                                </Col>
                            ))}
                    </Row>
                </FlexboxGrid.Item>
            </FlexboxGrid>
        </>
    );
};

export default Search;
