import axios from "axios";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

export function RegisterComponent() {
    const navigate = useNavigate();
    const [username, setUsername] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [rePassword, setRePassword] = useState("");
    const [alert, setAlert] = useState("");

    function submit(event) {
        event.preventDefault();
        axios
            .post(
                `${window.location.protocol}//${window.location.hostname}:8000/auth/users/`,
                {
                    email: email,
                    username: username,
                    password: password,
                    rePassword: rePassword,
                },
            )
            .then((response) => {
                console.log(response.data);
                setEmail("");
                setUsername("");
                setPassword("");
                setRePassword("");
                setAlert({
                    type: "success",
                    body: "Registration complete! You'll be redirected to login page now.",
                });

                setTimeout(() => {
                    navigate("/login");
                }, 2000);
            })
            .catch((error) => {
                console.log(error.response);
                setAlert({
                    type: "error",
                    body: "Something wrong with provided data. Try again.",
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
                        value={username}
                        onChange={(event) => setUsername(event.target.value)}
                        required
                        placeholder="USERNAME"
                        className="input"
                    />
                    <input
                        type="email"
                        value={email}
                        onChange={(event) => setEmail(event.target.value)}
                        required
                        placeholder="EMAIL"
                        className="input"
                    />
                    <input
                        type="password"
                        value={password}
                        autoComplete="off"
                        onChange={(event) => setPassword(event.target.value)}
                        required
                        placeholder="PASSWORD"
                        className="input"
                    />
                    <input
                        type="password"
                        value={rePassword}
                        autoComplete="off"
                        onChange={(event) => setRePassword(event.target.value)}
                        required
                        placeholder="CONFIRM PASSWORD"
                        className="input"
                    />
                    <button type="submit" className="button">
                        REGISTER
                    </button>
                </form>
            </div>
        </>
    );
}
