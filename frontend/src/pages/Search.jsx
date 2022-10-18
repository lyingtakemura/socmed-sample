import React, { useState, useEffect, useCallback } from "react";
import axios from "axios";
import { useSelector } from "react-redux";
import { FlexboxGrid, Panel, ButtonToolbar, Button, Row, Col } from "rsuite";
import { useNavigate } from "react-router-dom";

const Search = () => {
    let currentUser = useSelector((state) => state.users.currentUser);
    const [users, setUsers] = useState("");
    let navigate = useNavigate();

    const getUsers = useCallback(() => {
        //  useCallback is a React Hook that lets you cache a function definition between re-renders
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
    }, [currentUser]);

    useEffect(() => {
        getUsers();
    }, [getUsers]);

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

    const sendMessage = (event, id) => {
        console.log(id);
        axios
            .post(
                `http://127.0.0.1:8000/threads/`,
                {
                    // type: "personal",
                    users: [id, currentUser.id],
                },
                {
                    headers: {
                        Authorization: "Token " + currentUser.token,
                    },
                }
            )
            .then((response) => {
                console.log(response.data);
                navigate("/messenger");
            })
            .catch((error) => {
                console.log(error.response);
            });
    };

    return (
        <>
            <FlexboxGrid justify="center">
                <FlexboxGrid.Item colspan={22}>
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
                                        <ButtonToolbar>
                                            <Button
                                                appearance={
                                                    user.followers.includes(
                                                        currentUser.id
                                                    )
                                                        ? "default"
                                                        : "primary"
                                                }
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

                                            <Button
                                                appearance={"primary"}
                                                size="sm"
                                                onClick={(event) =>
                                                    sendMessage(event, user.id)
                                                }
                                            >
                                                Message
                                            </Button>
                                        </ButtonToolbar>
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
