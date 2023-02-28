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
        <div className="m-auto w-1/2 pb-1">
            <form onSubmit={sendPost} className="mb-2">
                <input
                    type="text"
                    value={input}
                    onChange={(event) => setInput(event.target.value)}
                    required
                    className="p-2 rounded-lg border-4 border-gray-300 focus:border-green-500 focus:outline-none font-bold w-full mb-2"
                />
                <button
                    type="submit"
                    className="p-2 rounded-lg border-4 border-green-500 bg-green-500 font-bold w-full"
                >
                    SUBMIT
                </button>
            </form>
            {posts && // check if posts array have been loaded from axios request to state before render
                posts.map((post) => (
                    <div
                        className="p-2 rounded-lg border-4 border-gray-300 hover:border-green-500 font-bold w-full mb-2"
                        key={post.id}
                    >
                        {post.body}
                        <br />
                        {post.user.username} at:{" "}
                        {formatPostTimestamp(post.created_at)}
                    </div>
                ))}
        </div>
    );
};

export default Home;
