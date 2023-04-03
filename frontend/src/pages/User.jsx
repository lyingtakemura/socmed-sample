import React, { useState, useEffect, useCallback } from "react";
import axios from "axios";
import { useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { update } from "../redux/usersSlice";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";

const User = () => {
    let params = useParams();
    let dispatch = useDispatch();
    let navigate = useNavigate();
    let authenticated = useSelector((state) => state.users.currentUser);
    let [user, set_user] = useState("");
    let [posts, set_posts] = useState("");

    const get_user = useCallback(() => {
        axios
            .get(
                `${window.location.protocol}//${window.location.hostname}:8000/users?search=${params.username}`,
                {
                    headers: {
                        Authorization: "Token " + authenticated.token,
                    },
                }
            )
            .then((response) => {
                if (response.data[0]) {
                    set_user(response.data[0]);
                    let id = response.data[0].id;
                    axios
                        .get(
                            `${window.location.protocol}//${window.location.hostname}:8000/posts/?user=${id}`,
                            {
                                headers: {
                                    Authorization:
                                        "Token " + authenticated.token,
                                },
                            }
                        )
                        .then((response) => {
                            if (response.data) {
                                set_posts(response.data);
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
    }, [authenticated, params]);

    useEffect(() => {
        get_user();
    }, [get_user]);

    const send_message = (event, id) => {
        axios
            .post(
                `${window.location.protocol}//${window.location.hostname}:8000/rooms/`,
                {
                    user: id,
                },
                {
                    headers: {
                        Authorization: "Token " + authenticated.token,
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

    const delete_image = (e) => {
        axios
            .patch(
                `${window.location.protocol}//${window.location.hostname}:8000/users/${authenticated.id}/`,
                {
                    image: null,
                },
                {
                    headers: {
                        Authorization: "Token " + authenticated.token,
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

    const change_image = (e) => {
        e.preventDefault();
        axios
            .patch(
                `${window.location.protocol}//${window.location.hostname}:8000/users/${authenticated.id}/`,
                {
                    image: e.target.files[0],
                },
                {
                    headers: {
                        Authorization: "Token " + authenticated.token,
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

    const follow = (event, id) => {
        axios
            .patch(
                `${window.location.protocol}//${window.location.hostname}:8000/users/${authenticated.id}/`,
                {
                    follow: id,
                },
                {
                    headers: {
                        Authorization: "Token " + authenticated.token,
                    },
                }
            )
            .then((response) => {
                get_user(user.id);
            })
            .catch((error) => {
                console.log(error.response);
            });
    };

    return (
        <div className="mx-1 md:m-auto md:w-1/2 sm:w-full font-bold h-[calc(100%-10%)] overflow-y-scroll">
            <div className="max-h-screen">
                {user && (
                    <div
                        className="flex justify-between w-full p-2 bg-gray-300 rounded-lg
                        h-1/3 my-1 space-x-4 border-2 border-gray-400"
                    >
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
                                    {user.id === authenticated.id && (
                                        <div className="overflow-x-hidden space-x-1">
                                            <button
                                                size="sm"
                                                onClick={(e) => {
                                                    delete_image(e);
                                                }}
                                                className="p-2 rounded-lg bg-green-500/20 text-xs"
                                            >
                                                Delete
                                            </button>
                                            <input
                                                type="file"
                                                onChange={change_image}
                                                accept="image/*"
                                                className="file:p-2 file:rounded-lg file:bg-green-500/20
                                                 file:text-xs file:border-0"
                                            />
                                        </div>
                                    )}
                                    {user.id !== authenticated.id && (
                                        <div className="space-x-1">
                                            <button
                                                className="p-2 rounded-lg bg-green-500/20 text-xs"
                                                onClick={(event) =>
                                                    follow(event, user.id)
                                                }
                                            >
                                                {user.followers.includes(
                                                    authenticated.id
                                                )
                                                    ? "Following"
                                                    : "Follow"}
                                            </button>
                                            <button
                                                className="p-2 rounded-lg bg-green-500/20 text-xs"
                                                onClick={(event) =>
                                                    send_message(event, user.id)
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
                                    className="p-2 bg-gray-300 rounded-lg border-2 border-gray-400"
                                    key={post.id}
                                >
                                    {post.body}
                                </div>
                            ))}
                    </div>
                )}
                {posts.length < 1 && (
                    <div className=" p-2 bg-gray-300 rounded-lg border-2 border-gray-400">
                        User hasn't posted anything yet
                    </div>
                )}
            </div>
        </div>
    );
};

export default User;
