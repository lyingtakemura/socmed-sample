import React, { useState, useEffect } from "react";
import axios from "axios";
import { useSelector } from "react-redux";
import { FlexboxGrid, Panel, Button, Uploader } from "rsuite";
import { useParams } from "react-router-dom";
import { update } from "../redux/usersSlice";
import { useDispatch } from "react-redux";

const User = () => {
    let currentUser = useSelector((state) => state.users.currentUser);
    let params = useParams();
    const [user, setUser] = useState("");
    const dispatch = useDispatch();

    useEffect(() => {
        axios
            .get(`http://127.0.0.1:8000/users?search=${params.username}`, {
                headers: {
                    Authorization: "Token " + currentUser.token,
                },
            })
            .then((response) => {
                if (response.data[0]) {
                    setUser(response.data[0]);
                    console.log(response.data[0]);
                }
            })
            .catch((error) => {
                console.log(error);
            });
    }, [currentUser, params]);

    const deleteImage = (e) => {
        axios
            .patch(
                `http://127.0.0.1:8000/users/${currentUser.id}/`,
                {
                    image: "",
                },
                {
                    headers: {
                        Authorization: "Token " + currentUser.token,
                        "Content-Type": "multipart/form-data",
                    },
                }
            )
            .then((response) => {
                dispatch(update(""));
            })
            .catch((error) => {
                console.log(error.response);
            });
    };

    return (
        <>
            {user && (
                <FlexboxGrid justify="center" align="top">
                    <FlexboxGrid.Item>
                        <Panel
                            bordered
                            bodyFill
                            style={{
                                display: "inline-block",
                                width: 400,
                                marginTop: "0.5rem",
                                marginRight: "0.5rem",
                                backgroundColor: "#30373D",
                            }}
                        >
                            <img
                                src={
                                    user.image
                                        ? user.image
                                        : "https://via.placeholder.com/400"
                                }
                                height="400px"
                                width="400px"
                                alt="?"
                                style={{
                                    objectFit: "cover",
                                    verticalAlign: "center",
                                }}
                            />

                            {user.id === currentUser.id && (
                                <Panel>
                                    <Button
                                        block
                                        size="sm"
                                        appearance="primary"
                                        style={{ marginBottom: "0.5rem" }}
                                        onClick={(e) => {
                                            deleteImage(e);
                                        }}
                                    >
                                        Delete Image
                                    </Button>
                                    <Uploader
                                        block
                                        size="sm"
                                        appearance="primary"
                                        action={`http://127.0.0.1:8000/users/${currentUser.id}/`}
                                        method="PATCH"
                                        headers={{
                                            Authorization:
                                                "Token " + currentUser.token,
                                        }}
                                        name="image"
                                        fileListVisible={false}
                                        onSuccess={(response) => {
                                            dispatch(update(response["image"]));
                                        }}
                                    />
                                </Panel>
                            )}
                            {user.id !== currentUser.id && (
                                <Panel>
                                    <Button
                                        block
                                        size="sm"
                                        appearance="primary"
                                        style={{ marginBottom: "0.5rem" }}
                                    >
                                        SEND_MESSAGE_PLACEHOLDER
                                    </Button>
                                    <Button
                                        block
                                        size="sm"
                                        appearance="primary"
                                        style={{ marginBottom: "0.5rem" }}
                                    >
                                        FOLLOW_PLACEHOLDER
                                    </Button>
                                </Panel>
                            )}
                        </Panel>
                    </FlexboxGrid.Item>
                    <FlexboxGrid.Item colspan={12}>
                        <Panel
                            bordered
                            style={{
                                marginBottom: "0.5rem",
                                marginTop: "0.5rem",
                                backgroundColor: "#30373D",
                            }}
                        >
                            <FlexboxGrid justify="space-between" align="middle">
                                <FlexboxGrid.Item>
                                    {user.username}
                                </FlexboxGrid.Item>
                                <FlexboxGrid.Item>
                                    Followers: {user.followers.length}
                                    <br />
                                    Following: {user.following.length}
                                </FlexboxGrid.Item>
                            </FlexboxGrid>
                        </Panel>
                        <Panel
                            bordered
                            style={{
                                marginBottom: "0.5rem",
                                marginTop: "0.5rem",
                                backgroundColor: "#30373D",
                            }}
                        >
                            USER_POSTS
                        </Panel>
                    </FlexboxGrid.Item>
                </FlexboxGrid>
            )}
            {!user && "NOT_FOUND"}
        </>
    );
};

export default User;
