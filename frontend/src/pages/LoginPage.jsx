import React, { useState } from "react";
import axios from "axios";
import { useDispatch } from "react-redux";
import { login } from "../redux/usersSlice";
import { useNavigate } from "react-router-dom";

const LoginPage = () => {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [alert, setAlert] = useState("");
    const dispatch = useDispatch();
    let navigate = useNavigate();

    const handleSubmit = (event) => {
        event.preventDefault();
        axios
            .post("http://127.0.0.1:8000/auth/token/login/", {
                username: username,
                password: password,
            })
            .then((response) => {
                const token = response.data["auth_token"];
                let details;

                axios
                    .get("http://127.0.0.1:8000/auth/users/me/", {
                        headers: {
                            Authorization: "Token " + token,
                        },
                    })
                    .then((response) => {
                        details = response.data;
                        const currentUser = {
                            id: details.id,
                            token: token,
                            username: details.username,
                            email: details.email,
                            image: details.image,
                        };
                        dispatch(login(currentUser));
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
                        name="name"
                        value={username}
                        onChange={(event) => setUsername(event.target.value)}
                        required
                        placeholder="USERNAME"
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
                    <button
                        type="submit"
                        className="p-2 rounded-lg border-4 border-green-500 bg-green-500 font-bold w-full"
                    >
                        LOGIN
                    </button>
                </form>
            </div>
        </>
    );
};

export default LoginPage;
