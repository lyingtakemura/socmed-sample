import React, { useState, useEffect, useCallback } from "react";
import axios from "axios";
import { useSelector } from "react-redux";
import { FlexboxGrid, ButtonToolbar, Button, List, Avatar } from "rsuite";
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
                console.log(response.data);
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
                getUsers();
            })
            .catch((error) => {
                console.log(error.response);
            });
    };

    const sendMessage = (event, id) => {
        // console.log(id);
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
                // console.log(response.data);
                navigate("/messenger");
            })
            .catch((error) => {
                console.log(error.response);
            });
    };

    return (
        <FlexboxGrid justify="center" align="middle">
            <FlexboxGrid.Item colspan={12} sm={24}>
                <List hover bordered style={{ margin: "0.5rem" }}>
                    {users &&
                        users.map((user) => (
                            <List.Item key={user.id}>
                                <FlexboxGrid
                                    justify="space-between"
                                    align="middle"
                                >
                                    <FlexboxGrid.Item
                                        style={{
                                            marginRight: "0.5rem",
                                        }}
                                        onClick={() =>
                                            navigate(`/${user.username}`)
                                        }
                                    >
                                        <Avatar
                                            size="lg"
                                            src={
                                                user.image
                                                    ? user.image
                                                    : "https://via.placeholder.com/100"
                                            }
                                            alt="?"
                                        />
                                    </FlexboxGrid.Item>
                                    <FlexboxGrid.Item
                                        style={{
                                            marginRight: "0.5rem",
                                        }}
                                        onClick={() =>
                                            navigate(`/${user.username}`)
                                        }
                                    >
                                        {user.username}
                                    </FlexboxGrid.Item>
                                    <FlexboxGrid.Item
                                        style={{
                                            marginRight: "0.5rem",
                                        }}
                                    >
                                        Followers: {user.followers.length}
                                    </FlexboxGrid.Item>
                                    <FlexboxGrid.Item
                                        style={{
                                            marginRight: "0.5rem",
                                        }}
                                    >
                                        <FlexboxGrid.Item colspan={24}>
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
                                                        toggleFollow(
                                                            event,
                                                            user.id
                                                        )
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
                                                        sendMessage(
                                                            event,
                                                            user.id
                                                        )
                                                    }
                                                >
                                                    Message
                                                </Button>
                                            </ButtonToolbar>
                                        </FlexboxGrid.Item>
                                    </FlexboxGrid.Item>
                                </FlexboxGrid>
                            </List.Item>
                        ))}
                </List>
            </FlexboxGrid.Item>
        </FlexboxGrid>
    );
};

export default Search;
