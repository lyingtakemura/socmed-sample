import axios from "axios";
import React, { useCallback, useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

export function UsersComponent() {
    const navigate = useNavigate();
    const authenticated = useSelector((state) => state.authenticated.user);
    const [users, setUsers] = useState("");
    const [input, setInput] = useState("");

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
                getUsers();
            })
            .catch((error) => {
                console.log(error.response);
            });
    }

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

    return (
        <div className="full-h-scrollable scrollbar-hide">
            <div className="max-h-screen my-1">
                <input
                    type="text"
                    value={input}
                    onChange={(event) => setInput(event.target.value)}
                    required
                    className="input"
                    placeholder="SEARCH"
                />
                {users &&
                    users
                        .filter((user) => input === "" || user.username.includes(input))
                        .map((user) => (
                            <div className="container flex space-x-2" key={user.id}>
                                <img
                                    className="w-12 rounded-lg"
                                    src={
                                        user.image
                                            ? user.image
                                            : "https://placehold.co/100x100"
                                    }
                                    alt="..."
                                />

                                <div className="flex-auto m-auto">
                                    <div
                                        className="link"
                                        onClick={() => navigate(`/${user.username}`)}
                                    >
                                        {user.username}
                                    </div>
                                </div>
                                <div className="flex space-x-2 text-xs">
                                    <button
                                        className={`button`}
                                        onClick={(event) => follow(event, user.id)}
                                    >
                                        {user.followers.includes(authenticated.id)
                                            ? "FOLLOWING"
                                            : "FOLLOW"}
                                    </button>
                                    <button
                                        className="button"
                                        onClick={(event) => sendMessage(event, user.id)}
                                    >
                                        MESSAGE
                                    </button>
                                </div>
                            </div>
                        ))}
            </div>
        </div>
    );
}
