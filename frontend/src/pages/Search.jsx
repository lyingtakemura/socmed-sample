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
                console.log(response.data);
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
        console.log(id);
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
        // console.log(id);
        axios
            .post(
                `http://127.0.0.1:8000/threads/`,
                {
                    // type: "personal",
                    users: [id, currentUser.id],
                },
                {
                    headers: {
                        Authorization: "Token " + currentUser.token,
                    },
                }
            )
            .then((response) => {
                // console.log(response.data);
                navigate("/messenger");
            })
            .catch((error) => {
                console.log(error.response);
            });
    };

    return (
        <>
            <div className="m-auto w-1/2 pb-1">
                {users &&
                    users.map((user) => (
                        <div
                            className="p-2 rounded-lg border-4 border-gray-300 mb-2 flex font-bold space-x-1"
                            key={user.id}
                        >
                            {/* <Avatar
                                size="lg"
                                src={
                                    user.image
                                        ? user.image
                                        : "https://via.placeholder.com/100"
                                }
                                alt="?"
                            /> */}
                            <img
                                className="w-12 rounded-lg"
                                src={
                                    user.image
                                        ? user.image
                                        : "https://via.placeholder.com/100"
                                }
                            />

                            <div className="flex-auto p-1">
                                <div
                                    className="hover:text-green-500"
                                    onClick={() =>
                                        navigate(`/${user.username}`)
                                    }
                                >
                                    {user.username}
                                </div>
                                <div>Followers: {user.followers.length}</div>
                            </div>
                            <button
                                className={`rounded-lg ${
                                    user.followers.includes(currentUser.id)
                                        ? "bg-green-500"
                                        : "bg-gray-300"
                                } p-1 text-sm border-4 border-gray-300 w-1/6`}
                                onClick={(event) =>
                                    toggleFollow(event, user.id)
                                }
                            >
                                {user.followers.includes(currentUser.id)
                                    ? "Following"
                                    : "Follow"}
                            </button>
                            <button
                                className="rounded-lg bg-green-500 p-1 text-sm border-4 border-gray-300 w-1/6"
                                onClick={(event) => sendMessage(event, user.id)}
                            >
                                Message
                            </button>
                        </div>
                    ))}
            </div>
        </>
    );
};

export default Search;
