import React, { useState, useEffect, useCallback } from "react";
import axios from "axios";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

const Search = () => {
    let currentUser = useSelector((state) => state.users.currentUser);
    const [users, setUsers] = useState("");
    let navigate = useNavigate();

    const getUsers = useCallback(() => {
        //  useCallback is a React Hook that lets you cache a function definition between re-renders
        axios
            .get("http://127.0.0.1:8000/users/", {
                headers: {
                    Authorization: "Token " + currentUser.token,
                },
            })
            .then((response) => {
                // console.log(response.data);
                setUsers(response.data);
            })
            .catch((error) => {
                console.log(error);
            });
    }, [currentUser]);

    useEffect(() => {
        getUsers();
    }, [getUsers]);

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
                getUsers();
            })
            .catch((error) => {
                console.log(error.response);
            });
    };

    const sendMessage = (event, id) => {
        axios
            .post(
                window.location.protocol +
                    "//" +
                    window.location.hostname +
                    ":8000/rooms/",
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

    return (
        <div className="m-auto md:w-1/2 sm:w-full grid md:grid-cols-2 sm:grid-cols-1">
            {users &&
                users.map((user) => (
                    <div
                        className="p-2 bg-gray-300 rounded-lg m-1 flex font-bold border-2 border-gray-400"
                        key={user.id}
                    >
                        <img
                            className="w-12 rounded-lg"
                            src={
                                user.image
                                    ? user.image
                                    : "https://via.placeholder.com/100"
                            }
                            alt="..."
                        />

                        <div className="flex-auto p-1">
                            <div
                                className="hover:text-green-500/20"
                                onClick={() => navigate(`/${user.username}`)}
                            >
                                {user.username}
                            </div>
                            <div>Followers: {user.followers.length}</div>
                        </div>
                        <div className="grid grid-cols-1 space-y-1 text-xs">
                            <button
                                className={`rounded-lg bg-gray-300 w-full border-2 border-gray-400 p-1`}
                                onClick={(event) =>
                                    toggleFollow(event, user.id)
                                }
                            >
                                {user.followers.includes(currentUser.id)
                                    ? "Following"
                                    : "Follow"}
                            </button>
                            <button
                                className="rounded-lg bg-green-500/20 w-full border-2 border-gray-400 p-1"
                                onClick={(event) => sendMessage(event, user.id)}
                            >
                                Message
                            </button>
                        </div>
                    </div>
                ))}
        </div>
    );
};

export default Search;
