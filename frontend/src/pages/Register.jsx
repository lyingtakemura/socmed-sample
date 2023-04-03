import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const Register = () => {
    let [username, set_username] = useState("");
    let [email, set_email] = useState("");
    let [password, set_password] = useState("");
    let [re_password, set_re_password] = useState("");
    let [alert, set_alert] = useState("");
    let navigate = useNavigate();

    const submit = (event) => {
        event.preventDefault();
        axios
            .post(
                `${window.location.protocol}//${window.location.hostname}:8000/auth/users/`,
                {
                    email: email,
                    username: username,
                    password: password,
                    re_password: re_password,
                }
            )
            .then((response) => {
                console.log(response.data);
                set_email("");
                set_username("");
                set_password("");
                set_re_password("");
                set_alert({
                    type: "success",
                    body: "Registration complete! You'll be redirected to login page now.",
                });

                setTimeout(() => {
                    navigate("/login");
                }, 2000);
            })
            .catch((error) => {
                console.log(error.response);
                set_alert({
                    type: "error",
                    body: "Something wrong with provided data. Try again.",
                });
            });
    };

    return (
        <>
            {alert && (
                <div
                    onClick={(event) => set_alert("")}
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
                        onChange={(event) => set_username(event.target.value)}
                        required
                        placeholder="USERNAME"
                        className="p-2 rounded-lg w-full mb-1 bg-gray-300 focus:outline-none"
                    />
                    <input
                        type="email"
                        value={email}
                        onChange={(event) => set_email(event.target.value)}
                        required
                        placeholder="EMAIL"
                        className="p-2 rounded-lg w-full mb-1 bg-gray-300 focus:outline-none"
                    />
                    <input
                        type="password"
                        value={password}
                        autoComplete="off"
                        onChange={(event) => set_password(event.target.value)}
                        required
                        placeholder="PASSWORD"
                        className="p-2 rounded-lg w-full mb-1 bg-gray-300 focus:outline-none"
                    />
                    <input
                        type="password"
                        value={re_password}
                        autoComplete="off"
                        onChange={(event) =>
                            set_re_password(event.target.value)
                        }
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
};

export default Register;
