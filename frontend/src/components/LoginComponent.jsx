import React, { useState } from "react";
import axios from "axios";
import { useDispatch } from "react-redux";
import { loginAction } from "../redux/authenticatedSlice";
import { useNavigate } from "react-router-dom";

export function LoginComponent() {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [alert, setAlert] = useState("");
    const dispatch = useDispatch();
    const navigate = useNavigate();

    function submit(event) {
        event.preventDefault();
        axios
            .post(
                `${window.location.protocol}//${window.location.hostname}:8000/auth/token/login/`,
                {
                    username: username,
                    password: password,
                },
            )
            .then((response) => {
                const token = response.data["auth_token"];

                axios
                    .get(
                        `${window.location.protocol}//${window.location.hostname}:8000/auth/users/me/`,
                        {
                            headers: {
                                Authorization: "Token " + token,
                            },
                        },
                    )
                    .then((response) => {
                        dispatch(
                            loginAction({
                                id: response.data.id,
                                token: token,
                                username: response.data.username,
                                email: response.data.email,
                                image: response.data.image,
                            }),
                        );
                        setUsername("");
                        setPassword("");
                        navigate("/");
                    });
            })
            .catch((error) => {
                console.log(error.response);
                setAlert({
                    type: "error",
                    body: error.response.data["non_field_errors"],
                });
            });
    }

    return (
        <>
            {alert && (
                <div
                    onClick={(event) => setAlert("")}
                    className="mx-auto mb-1 p-2 w-1/2 font-bold text-center rounded-lg bg-gray-300"
                >
                    {alert.body}
                </div>
            )}
            <div className="m-auto w-1/2 absolute top-1/3 left-0 right-0 font-bold">
                <form onSubmit={submit}>
                    <input
                        type="text"
                        name="name"
                        value={username}
                        onChange={(event) => setUsername(event.target.value)}
                        required
                        placeholder="USERNAME"
                        className="p-2 rounded-lg bg-gray-300 w-full mb-1 focus:outline-none"
                    />
                    <input
                        type="password"
                        name="password"
                        value={password}
                        autoComplete="off"
                        onChange={(event) => setPassword(event.target.value)}
                        required
                        placeholder="PASSWORD"
                        className="p-2 rounded-lg bg-gray-300 w-full mb-1 focus:outline-none"
                    />
                    <button
                        type="submit"
                        className="p-2 rounded-lg w-full bg-green-500/20"
                    >
                        LOGIN
                    </button>
                </form>
            </div>
        </>
    );
}
