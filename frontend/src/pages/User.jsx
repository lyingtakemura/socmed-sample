import React, { useState, useEffect } from "react";
import axios from "axios";
import { useSelector } from "react-redux";
import { FlexboxGrid, Panel, Avatar } from "rsuite";
import { useParams } from "react-router-dom";

const User = () => {
    let currentUser = useSelector((state) => state.users.currentUser);
    let params = useParams();
    const [user, setUser] = useState("");

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
        let bodyFormData = new FormData();
        bodyFormData.append("image", image); 
        console.log(bodyFormData.get('image'));
        axios
            .patch(
                `http://127.0.0.1:8000/users/${currentUser.id}/`,
                {
                    image: bodyFormData.get("image"),
                },
                {
                    headers: {
                        Authorization: "Token " + currentUser.token,
                        "Content-Type": "multipart/form-data",
                    },
                }
            )
            .then((response) => {
                console.log(response.data);
            })
            .catch((error) => {
                console.log(error.response);
            });
    };

    return (
        <>
            {user && (
                <FlexboxGrid justify="center" align="middle">
                    <FlexboxGrid.Item colspan={12} md={24}>
                        <FlexboxGrid justify="space-between" align="middle">
                            <FlexboxGrid.Item colspan={24}>
                                <Panel
                                    bordered
                                    style={{
                                        marginTop: "0.5rem",
                                        marginBottom: "0.5rem",
                                    }}
                                >
                                    <FlexboxGrid
                                        justify="space-between"
                                        align="middle"
                                    >
                                        <FlexboxGrid.Item colspan={6} sm={24}>
                                            <Avatar
                                                size="lg"
                                                src={user.image}
                                                alt={user.username}
                                            />{" "}
                                            <input
                                                type="file"
                                                name="image_url"
                                                accept="image/jpeg,image/png,image/gif"
                                                onChange={(e) => {
                                                    handleImageChange(e);
                                                }}
                                            />
                                        </FlexboxGrid.Item>
                                        <FlexboxGrid.Item colspan={18} sm={24}>
                                            <FlexboxGrid justify="space-between">
                                                <FlexboxGrid.Item colspan={24}>
                                                    {user.username}
                                                </FlexboxGrid.Item>
                                                <FlexboxGrid.Item colspan={12}>
                                                    Followers:{" "}
                                                    {user.followers.length}
                                                </FlexboxGrid.Item>
                                                <FlexboxGrid.Item colspan={12}>
                                                    Following:{" "}
                                                    {user.following.length}
                                                </FlexboxGrid.Item>
                                            </FlexboxGrid>
                                        </FlexboxGrid.Item>
                                    </FlexboxGrid>
                                </Panel>
                            </FlexboxGrid.Item>
                            <FlexboxGrid.Item colspan={24}>
                                <Panel
                                    bordered
                                    style={{ marginBottom: "0.5rem" }}
                                >
                                    USER_POSTS
                                </Panel>
                            </FlexboxGrid.Item>
                        </FlexboxGrid>
                    </FlexboxGrid.Item>
                </FlexboxGrid>
            )}
            {!user && "NOT_FOUND"}
        </>
    );
};

export default User;
