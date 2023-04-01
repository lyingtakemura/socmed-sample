import React, { useState, useEffect } from "react";
import axios from "axios";
import { useSelector } from "react-redux";

const Home = () => {
    let currentUser = useSelector((state) => state.users.currentUser);
    const [posts, setPosts] = useState("");
    const [input, setInput] = useState("");

    useEffect(() => {
        axios
            .get("http://127.0.0.1:8000/posts/", {
                headers: {
                    Authorization: "Token " + currentUser.token,
                },
            })
            .then((response) => {
                setPosts(response.data);
            })
            .catch((error) => {
                console.log(error);
            });
    }, [currentUser]); // posts in useEffect dependency causes infinite axios request loop

    const formatPostTimestamp = (input) => {
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

    const sendPost = (event) => {
        event.preventDefault();
        axios
            .post(
                "http://127.0.0.1:8000/posts/",
                {
                    body: input,
                },
                {
                    headers: {
                        Authorization: "Token " + currentUser.token,
                    },
                }
            )
            .then((response) => {
                console.log(response.data);
                let obj = response.data;
                let posts_temp = [obj, ...posts];
                setPosts(posts_temp);
            })
            .catch((error) => {
                console.log(error);
            });
        setInput("");
    };

    return (
        <div className="mx-1 md:m-auto md:w-1/2 sm:w-full font-bold h-[calc(100%-10%)] overflow-y-scroll">
            <div className="max-h-screen my-1">
                <form onSubmit={sendPost} className="mb-1 flex space-x-1">
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
                            <div className="text-center">
                                {post.user.username} at:{" "}
                                {formatPostTimestamp(post.created_at)}
                            </div>
                        </div>
                    ))}
            </div>
        </div>
    );
};

export default Home;
