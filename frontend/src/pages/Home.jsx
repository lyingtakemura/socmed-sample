import React, { useState, useEffect } from "react";
import axios from "axios";
import { useSelector } from "react-redux";

const Home = () => {
    let authenticated = useSelector((state) => state.users.currentUser);
    const [posts, set_posts] = useState("");
    const [input, set_input] = useState("");

    useEffect(() => {
        axios
            .get(
                `${window.location.protocol}//${window.location.hostname}:8000/posts/`,
                {
                    headers: {
                        Authorization: "Token " + authenticated.token,
                    },
                }
            )
            .then((response) => {
                set_posts(response.data);
            })
            .catch((error) => {
                console.log(error);
            });
    }, [authenticated]); // posts in useEffect dependency causes infinite axios request loop

    const format_timestamp = (input) => {
        const formatter = new Intl.DateTimeFormat("en-GB", {
            year: "2-digit",
            month: "2-digit",
            day: "2-digit",
            minute: "2-digit",
            hour: "2-digit",
        });
        const date = new Date(input);
        const result = formatter.format(date);
        return result;
    };

    const submit_post = (event) => {
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
                }
            )
            .then((response) => {
                console.log(response.data);
                let obj = response.data;
                let posts_temp = [obj, ...posts];
                set_posts(posts_temp);
            })
            .catch((error) => {
                console.log(error);
            });
        set_input("");
    };

    const delete_post = (event, id) => {
        console.log(id);
        axios
            .delete(
                `${window.location.protocol}//${window.location.hostname}:8000/posts/${id}`,
                {
                    headers: {
                        Authorization: "Token " + authenticated.token,
                    },
                }
            )
            .then((response) => {
                console.log(response.data);
                console.log(posts);
            })
            .catch((error) => {
                console.log(error);
            });
    };

    return (
        <div className="mx-1 md:m-auto md:w-1/2 sm:w-full font-bold h-[calc(100%-10%)] overflow-y-scroll">
            <div className="max-h-screen my-1">
                <form onSubmit={submit_post} className="mb-1 flex space-x-1">
                    <input
                        type="text"
                        value={input}
                        onChange={(event) => set_input(event.target.value)}
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
                                    {format_timestamp(post.created_at)}
                                </div>
                                {authenticated.id === post.user.id && (
                                    <div
                                        className="hover:text-black"
                                        onClick={(event) =>
                                            delete_post(event, post.id)
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
};

export default Home;
