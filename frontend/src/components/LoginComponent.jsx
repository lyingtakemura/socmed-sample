import axios from "axios";
import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { loginAction } from "../redux/authenticatedSlice";

export function LoginComponent() {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [alert, setAlert] = useState("");

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
                <div onClick={(event) => setAlert("")} className="alert">
                    {alert.body}
                </div>
            )}
            <div className="container-auth">
                <form onSubmit={submit}>
                    <input
                        type="text"
                        name="name"
                        value={username}
                        onChange={(event) => setUsername(event.target.value)}
                        required
                        placeholder="USERNAME"
                        className="input"
                    />
                    <input
                        type="password"
                        name="password"
                        value={password}
                        autoComplete="off"
                        onChange={(event) => setPassword(event.target.value)}
                        required
                        placeholder="PASSWORD"
                        className="input"
                    />
                    <button type="submit" className="button">
                        LOGIN
                    </button>
                </form>
            </div>
        </>
    );
}
