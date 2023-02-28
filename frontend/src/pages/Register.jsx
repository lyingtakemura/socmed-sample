import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const LoginPage = () => {
    const [username, setUsername] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [rePassword, setRePassword] = useState("");
    const [alert, setAlert] = useState("");
    let navigate = useNavigate();

    const handleSubmit = (event) => {
        event.preventDefault()
        axios
            .post("http://127.0.0.1:8000/auth/users/", {
                email: email,
                username: username,
                password: password,
                re_password: rePassword,
            })
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
    };

    return (
        <>
            {alert && (
                <div
                    onClick={(event) => setAlert("")}
                    className="mx-auto mb-1 p-4 border-4 border-green-500 w-1/2 font-bold text-center rounded-lg"
                >
                    {alert.body}
                </div>
            )}
            <div className="m-auto w-1/2 absolute top-1/3 left-0 right-0">
                <form onSubmit={handleSubmit}>
                    <input
                        type="text"
                        name="username"
                        value={username}
                        onChange={(event) => setUsername(event.target.value)}
                        required
                        placeholder="USERNAME"
                        className="p-2 rounded-lg border-4 border-gray-300 focus:border-green-500 focus:outline-none font-bold w-full mb-2"
                    />
                    <input
                        type="text"
                        name="email"
                        value={email}
                        onChange={(event) => setEmail(event.target.value)}
                        required
                        placeholder="EMAIL"
                        className="p-2 rounded-lg border-4 border-gray-300 focus:border-green-500 focus:outline-none font-bold w-full mb-2"
                    />
                    <input
                        type="password"
                        name="password"
                        value={password}
                        autoComplete="off"
                        onChange={(event) => setPassword(event.target.value)}
                        required
                        placeholder="PASSWORD"
                        className="p-2 rounded-lg border-4 border-gray-300 focus:border-green-500 focus:outline-none font-bold w-full mb-2"
                    />
                    <input
                        type="password"
                        name="rePassword"
                        value={rePassword}
                        autoComplete="off"
                        onChange={(event) => setRePassword(event.target.value)}
                        required
                        placeholder="CONFIRM PASSWORD"
                        className="p-2 rounded-lg border-4 border-gray-300 focus:border-green-500 focus:outline-none font-bold w-full mb-2"
                    />
                    <button
                        type="submit"
                        className="p-2 rounded-lg border-4 border-green-500 bg-green-500 font-bold w-full"
                    >
                        REGISTER
                    </button>
                </form>
            </div>
        </>
    );
};

export default LoginPage;
