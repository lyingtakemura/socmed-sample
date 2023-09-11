import React, { useState, useEffect, useCallback } from "react";
import axios from "axios";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

export function Users() {
    const navigate = useNavigate();
    const authenticated = useSelector((state) => state.authenticated.user);
    const [users, setUsers] = useState("");

    const getUsers = useCallback(() => {
        axios
            .get(
                `${window.location.protocol}//${window.location.hostname}:8000/users/`,
                {
                    headers: {
                        Authorization: "Token " + authenticated.token,
                    },
                },
            )
            .then((response) => {
                setUsers(response.data);
            })
            .catch((error) => {
                console.log(error);
            });
    }, [authenticated]); //  useCallback lets you cache a function definition between re-renders

    useEffect(() => {
        getUsers();
    }, [getUsers]);

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
                },
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
                                onClick={(event) => follow(event, user.id)}
                            >
                                {user.followers.includes(authenticated.id)
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
}
