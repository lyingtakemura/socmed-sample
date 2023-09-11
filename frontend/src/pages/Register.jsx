import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export function Register() {
    const [username, setUsername] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [rePassword, setRePassword] = useState("");
    const [alert, setAlert] = useState("");
    const navigate = useNavigate();

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
                <div
                    onClick={(event) => setAlert("")}
                    className="mx-auto mb-1 p-2 bg-gray-300 w-1/2 font-bold text-center rounded-lg"
                >
                    {alert.body}
                </div>
            )}
            <div className="m-auto w-1/2 absolute top-1/3 left-0 right-0 font-bold">
                <form onSubmit={submit}>
                    <input
                        type="text"
                        value={username}
                        onChange={(event) => setUsername(event.target.value)}
                        required
                        placeholder="USERNAME"
                        className="p-2 rounded-lg w-full mb-1 bg-gray-300 focus:outline-none"
                    />
                    <input
                        type="email"
                        value={email}
                        onChange={(event) => setEmail(event.target.value)}
                        required
                        placeholder="EMAIL"
                        className="p-2 rounded-lg w-full mb-1 bg-gray-300 focus:outline-none"
                    />
                    <input
                        type="password"
                        value={password}
                        autoComplete="off"
                        onChange={(event) => setPassword(event.target.value)}
                        required
                        placeholder="PASSWORD"
                        className="p-2 rounded-lg w-full mb-1 bg-gray-300 focus:outline-none"
                    />
                    <input
                        type="password"
                        value={rePassword}
                        autoComplete="off"
                        onChange={(event) => setRePassword(event.target.value)}
                        required
                        placeholder="CONFIRM PASSWORD"
                        className="p-2 rounded-lg w-full mb-1 bg-gray-300 focus:outline-none"
                    />
                    <button
                        type="submit"
                        className="p-2 rounded-lg bg-green-500/20 font-bold w-full"
                    >
                        REGISTER
                    </button>
                </form>
            </div>
        </>
    );
}
