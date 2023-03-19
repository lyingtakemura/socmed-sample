import React, { useState, useEffect, useCallback } from "react";
import axios from "axios";
import { useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { update } from "../redux/usersSlice";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";

const User = () => {
    let currentUser = useSelector((state) => state.users.currentUser);
    let params = useParams();
    const [user, setUser] = useState("");
    const [posts, setPosts] = useState("");
    const dispatch = useDispatch();
    let navigate = useNavigate();

    const getUser = useCallback(() => {
        axios
            .get(`http://127.0.0.1:8000/users?search=${params.username}`, {
                headers: {
                    Authorization: "Token " + currentUser.token,
                },
            })
            .then((response) => {
                if (response.data[0]) {
                    setUser(response.data[0]);
                    // console.log(response.data[0].id);
                    let id = response.data[0].id;
                    axios
                        .get(`http://127.0.0.1:8000/posts/?user=${id}`, {
                            headers: {
                                Authorization: "Token " + currentUser.token,
                            },
                        })
                        .then((response) => {
                            if (response.data) {
                                setPosts(response.data);
                                // console.log(response.data);
                            }
                        })
                        .catch((error) => {
                            console.log(error);
                        });
                }
            })
            .catch((error) => {
                console.log(error);
            });
    }, [currentUser, params]);

    useEffect(() => {
        getUser();
    }, [getUser]);

    const sendMessage = (event, id) => {
        axios
            .post(
                `http://127.0.0.1:8000/threads/`,
                {
                    users: [id, currentUser.id],
                },
                {
                    headers: {
                        Authorization: "Token " + currentUser.token,
                    },
                }
            )
            .then((response) => {
                navigate("/messenger");
            })
            .catch((error) => {
                console.log(error.response);
            });
    };

    const onImageDelete = (e) => {
        axios
            .patch(
                `http://127.0.0.1:8000/users/${currentUser.id}/`,
                {
                    image: null,
                },
                {
                    headers: {
                        Authorization: "Token " + currentUser.token,
                        "Content-Type": "multipart/form-data",
                    },
                }
            )
            .then((response) => {
                dispatch(update(null));
            })
            .catch((error) => {
                console.log(error.response);
            });
    };

    const onImageChange = (e) => {
        e.preventDefault();
        // console.log(e.target.files[0]);
        axios
            .patch(
                `http://127.0.0.1:8000/users/${currentUser.id}/`,
                {
                    image: e.target.files[0],
                },
                {
                    headers: {
                        Authorization: "Token " + currentUser.token,
                        "Content-Type": "multipart/form-data",
                    },
                }
            )
            .then((response) => {
                dispatch(update(response["image"]));
            })
            .catch((error) => {
                console.log(error.response);
            });
    };

    const toggleFollow = (event, id) => {
        // console.log(id);
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
                getUser(user.id);
            })
            .catch((error) => {
                console.log(error.response);
            });
    };

    return (
        <>
            <div className="w-1/2 m-auto font-bold pb-1">
                {user && (
                    <div className="flex justify-between w-full p-2 bg-gray-300 rounded-lg h-1/3 mb-1 space-x-4">
                        <img
                            src={
                                user.image
                                    ? user.image
                                    : "https://via.placeholder.com/400"
                            }
                            alt="?"
                            className="h-auto rounded-lg w-1/3 object-cover object-center"
                        />
                        <div className="w-2/3 grid grid-cols-1 place-content-evenly">
                            <div className="w-auto flex justify-between">
                                <div className="text-2xl">{user.username}</div>
                                <div className="w-auto">
                                    {user.id === currentUser.id && (
                                        <div className="overflow-x-hidden space-x-1">
                                            <button
                                                size="sm"
                                                onClick={(e) => {
                                                    onImageDelete(e);
                                                }}
                                                className="p-2 rounded-lg bg-green-500/20 text-xs"
                                            >
                                                Delete Image
                                            </button>
                                            <input
                                                type="file"
                                                onChange={onImageChange}
                                                accept="image/*"
                                                className="file:p-2 file:rounded-lg file:bg-green-500/20 file:text-xs file:border-0"
                                            />
                                        </div>
                                    )}
                                    {user.id !== currentUser.id && (
                                        <div className="space-x-1">
                                            <button
                                                className="p-2 rounded-lg bg-green-500/20 text-xs"
                                                onClick={(event) =>
                                                    toggleFollow(event, user.id)
                                                }
                                            >
                                                {user.followers.includes(
                                                    currentUser.id
                                                )
                                                    ? "Following"
                                                    : "Follow"}
                                            </button>
                                            <button
                                                className="p-2 rounded-lg bg-green-500/20 text-xs"
                                                onClick={(event) =>
                                                    sendMessage(event, user.id)
                                                }
                                            >
                                                Message
                                            </button>
                                        </div>
                                    )}
                                </div>
                            </div>
                            <div className="w-auto flex justify-between">
                                <div>Posts: {posts.length}</div>
                                <div>Followers: {user.followers.length}</div>
                                <div>Following: {user.following.length}</div>
                            </div>
                        </div>
                        <div></div>
                    </div>
                )}
                {!user && "NOT_FOUND"}
                {posts && (
                    <div className="w-auto space-y-1">
                        {posts &&
                            posts.map((post) => (
                                <div
                                    className=" p-2 bg-gray-300 rounded-lg"
                                    key={post.id}
                                >
                                    {post.body}
                                </div>
                            ))}
                    </div>
                )}
                {posts.length < 1 && (
                    <div className=" p-2 bg-gray-300 rounded-lg">
                        User hasn't posted anything yet
                    </div>
                )}
            </div>
        </>
    );
};

export default User;
