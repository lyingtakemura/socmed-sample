import React, { useState, useEffect, useCallback } from "react";
import { useSelector } from "react-redux";
import axios from "axios";

export function Home() {
    const authenticated = useSelector((state) => state.authenticated.user);
    const [posts, setPosts] = useState("");
    const [input, setInput] = useState("");

    const getPosts = useCallback(() => {
        axios
            .get(
                `${window.location.protocol}//${window.location.hostname}:8000/posts/`,
                {
                    headers: {
                        Authorization: "Token " + authenticated.token,
                    },
                },
            )
            .then((response) => {
                setPosts(response.data);
            })
            .catch((error) => {
                console.log(error);
            });
    }, [authenticated]);

    useEffect(() => {
        getPosts();
    }, [getPosts]);

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

    function submitPost(event) {
        event.preventDefault();
        axios
            .post(
                `${window.location.protocol}//${window.location.hostname}:8000/posts/`,
                {
                    body: input,
                },
                {
                    headers: {
                        Authorization: "Token " + authenticated.token,
                    },
                },
            )
            .then((response) => {
                getPosts();
            })
            .catch((error) => {
                console.log(error);
            });
        setInput("");
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
                getPosts();
            })
            .catch((error) => {
                console.log(error);
            });
    }

    return (
        <div className="mx-1 md:m-auto md:w-1/2 sm:w-full font-bold h-[calc(100%-10%)] overflow-y-scroll">
            <div className="max-h-screen my-1">
                <form onSubmit={submitPost} className="mb-1 flex space-x-1">
                    <input
                        type="text"
                        value={input}
                        onChange={(event) => setInput(event.target.value)}
                        required
                        className="p-2 rounded-lg bg-gray-300 border-2 border-gray-400
                         focus:border-green-500/20 focus:outline-none w-full"
                    />
                    <button
                        type="submit"
                        className="p-2 rounded-lg bg-green-500/20 w-1/6 border-2 border-gray-400"
                    >
                        Add
                    </button>
                </form>
                {posts && // check if posts array have been loaded from axios request to state before render
                    posts.map((post) => (
                        <div
                            className="p-2 rounded-lg bg-gray-300 w-full mb-1 border-2 border-gray-400"
                            key={post.id}
                        >
                            <div>{post.body}</div>
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
        </div>
    );
}
