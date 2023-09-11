import React, { useState, useEffect, useCallback } from "react";
import axios from "axios";
import { useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { updateAction } from "../redux/authenticatedSlice";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";

export function UserComponent() {
    const params = useParams();
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const authenticated = useSelector((state) => state.authenticated.user);
    const [user, setUser] = useState("");
    const [posts, setPosts] = useState("");

    const getUser = useCallback(() => {
        axios
            .get(
                `${window.location.protocol}//${window.location.hostname}:8000/users?search=${params.username}`,
                {
                    headers: {
                        Authorization: "Token " + authenticated.token,
                    },
                },
            )
            .then((response) => {
                if (response.data[0]) {
                    setUser(response.data[0]);
                    let id = response.data[0].id;
                    axios
                        .get(
                            `${window.location.protocol}//${window.location.hostname}:8000/posts/?user=${id}`,
                            {
                                headers: {
                                    Authorization: "Token " + authenticated.token,
                                },
                            },
                        )
                        .then((response) => {
                            if (response.data) {
                                setPosts(response.data);
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
        getUser();
    }, [getUser]);

    function sendMessage(event, id) {
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
                },
            )
            .then((response) => {
                navigate("/messenger");
            })
            .catch((error) => {
                console.log(error.response);
            });
    }

    // const delete_image = (e) => {
    //     axios
    //         .patch(
    //             `${window.location.protocol}//${window.location.hostname}:8000/users/${authenticated.id}/`,
    //             {
    //                 image: null,
    //             },
    //             {
    //                 headers: {
    //                     Authorization: "Token " + authenticated.token,
    //                     "Content-Type": "multipart/form-data",
    //                 },
    //             }
    //         )
    //         .then((response) => {
    //             dispatch(update(null));
    //         })
    //         .catch((error) => {
    //             console.log(error.response);
    //         });
    // };

    function updateImage(event) {
        event.preventDefault();
        axios
            .patch(
                `${window.location.protocol}//${window.location.hostname}:8000/users/${authenticated.id}/`,
                {
                    image: event.target.files[0],
                },
                {
                    headers: {
                        Authorization: "Token " + authenticated.token,
                        "Content-Type": "multipart/form-data",
                    },
                },
            )
            .then((response) => {
                dispatch(updateAction(response["image"]));
            })
            .catch((error) => {
                console.log(error.response);
            });
    }

    function follow(event, id) {
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
                },
            )
            .then((response) => {
                getUser(user.id);
            })
            .catch((error) => {
                console.log(error.response);
            });
    }

    function deletePost(event, id) {
        axios
            .delete(
                `${window.location.protocol}//${window.location.hostname}:8000/posts/${id}`,
                {
                    headers: {
                        Authorization: "Token " + authenticated.token,
                    },
                },
            )
            .then((response) => {
                console.log(response.data);
            })
            .catch((error) => {
                console.log(error);
            });
    }

    function formatPostDatetime(input) {
        const formatter = new Intl.DateTimeFormat("en-GB", {
            year: "2-digit",
            month: "2-digit",
            day: "2-digit",
            minute: "2-digit",
            hour: "2-digit",
        });
        return formatter.format(new Date(input));
    }

    return (
        <div className="mx-1 md:m-auto md:w-1/2 sm:w-full font-bold h-[calc(100%-10%)] overflow-y-scroll">
            <div className="max-h-screen">
                {user && (
                    <div
                        className="flex justify-between w-full p-2 bg-gray-300 rounded-lg
                        h-1/3 my-1 space-x-4 border-2 border-gray-400"
                    >
                        <div className="h-auto w-1/3">
                            <img
                                src={
                                    user.image
                                        ? user.image
                                        : "https://via.placeholder.com/400"
                                }
                                alt="?"
                                className="rounded-lg object-cover object-center border-2 border-gray-400"
                            />
                            {user.id === authenticated.id && (
                                <div>
                                    {/* <button
                                        size="sm"
                                        onClick={(e) => {
                                            delete_image(e);
                                        }}
                                        className="p-2 rounded-lg bg-green-500/20 text-xs w-full"
                                    >
                                        Delete
                                    </button> */}
                                    <input
                                        type="file"
                                        onChange={updateImage}
                                        accept="image/*"
                                        className="bg-green-500/20 p-2 rounded-lg file:hidden
                                                text-xs w-full mt-1 border-2 border-gray-400"
                                    />
                                </div>
                            )}
                        </div>

                        <div className="w-2/3 grid grid-cols-1 place-content-evenly">
                            <div className="text-center flex justify-left">
                                <div className="text-2xl mr-4">{user.username}</div>

                                {user.id !== authenticated.id && (
                                    <div className="space-x-1 flex">
                                        <button
                                            className="p-2 rounded-lg bg-green-500/20 text-xs border-2 border-gray-400"
                                            onClick={(event) =>
                                                sendMessage(event, user.id)
                                            }
                                        >
                                            Message
                                        </button>
                                        <button
                                            className="p-2 rounded-lg bg-green-500/20 text-xs border-2 border-gray-400"
                                            onClick={(event) => follow(event, user.id)}
                                        >
                                            {user.followers.includes(authenticated.id)
                                                ? "Following"
                                                : "Follow"}
                                        </button>
                                    </div>
                                )}
                            </div>
                            <div className="flex justify-evenly">
                                <div className="w-full">Posts: {posts.length}</div>
                                <div className="w-full">
                                    Followers: {user.followers.length}
                                </div>
                                <div className="w-full">
                                    Following: {user.following.length}
                                </div>
                            </div>
                            <div>
                                Lorem ipsum dolor sit, amet consectetur adipisicing
                                elit. Dicta tenetur rem a unde perferendis repellendus
                                earum qui quam animi quae est amet ad, voluptates illum,
                                reprehenderit fugit voluptatem aliquam debitis!
                            </div>
                        </div>
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
                                    <div className="flex justify-between text-xs text-black/50">
                                        <div className="text-center">
                                            {post.user.username} at:{" "}
                                            {formatPostDatetime(post.created_at)}
                                        </div>
                                        {authenticated.id === post.user.id && (
                                            <div
                                                className="hover:text-black"
                                                onClick={(event) =>
                                                    deletePost(event, post.id)
                                                }
                                            >
                                                delete
                                            </div>
                                        )}
                                    </div>
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
}
