import React, { useState, useEffect } from "react";
import axios from "axios";
import { useSelector } from "react-redux";
import { FlexboxGrid, Panel, Button } from "rsuite";
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

    const handleImageChange = (e) => {
        let image = e.target.files[0];
        let input = new FormData();
        input.append("image", image);
        axios
            .patch(
                `http://127.0.0.1:8000/users/${currentUser.id}/`,
                {
                    image: input.get("image"),
                },
                {
                    headers: {
                        Authorization: "Token " + currentUser.token,
                        "Content-Type": "multipart/form-data",
                    },
                }
            )
            .then((response) => {
                dispatch(update(response.data["image"]));
            })
            .catch((error) => {
                console.log(error.response);
            });
    };

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
                            shaded
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
                                src={user.image}
                                height="400px"
                                width="400px"
                                alt="?"
                                style={{
                                    objectFit: "cover",
                                    verticalAlign: "center",
                                }}
                            />
                            <Button
                                onClick={(e) => {
                                    deleteImage(e);
                                }}
                            >
                                Delete Image
                            </Button>
                            <Panel header={user.username}>
                                {user.id === currentUser.id && (
                                    <input
                                        type="file"
                                        name="image_url"
                                        accept="image/jpeg,image/png"
                                        onChange={(e) => {
                                            handleImageChange(e);
                                        }}
                                    />
                                )}
                                <p>Followers: {user.followers.length}</p>
                                <p>Following: {user.following.length}</p>
                            </Panel>
                        </Panel>
                    </FlexboxGrid.Item>
                    <FlexboxGrid.Item colspan={12}>
                        <Panel
                            bordered
                            style={{
                                marginBottom: "0.5rem",
                                marginTop: "0.5rem",
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
