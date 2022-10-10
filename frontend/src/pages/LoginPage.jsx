import React, { useState } from "react";
import axios from "axios";
import { useDispatch } from "react-redux";
import { login } from "../redux/usersSlice";
import { Form, ButtonToolbar, Button, FlexboxGrid, Message } from "rsuite";
import { useNavigate } from "react-router-dom";

const LoginPage = () => {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const dispatch = useDispatch();
    let navigate = useNavigate();

    const handleSubmit = () => {
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
                        };
                        dispatch(login(currentUser));
                        setUsername("");
                        setPassword("");
                        navigate("/");
                    });
            })
            .catch((error) => {
                // console.log(error.response);
                setError(error.response.data["non_field_errors"]);
            });
    };

    return (
        <>
            {error && (
                <FlexboxGrid
                    justify="center"
                    style={{ margin: "0.5rem", justify: "center" }}
                >
                    <FlexboxGrid.Item colspan={12}>
                        <Message
                            closable
                            showIcon
                            type="warning"
                            onClose={(event) => setError("")}
                        >
                            {error}
                        </Message>
                    </FlexboxGrid.Item>
                </FlexboxGrid>
            )}
            <FlexboxGrid
                justify="center"
                style={{
                    position: "absolute",
                    left: "0",
                    right: "0",
                    top: "50%",
                    bottom: "0",
                    margin: "auto",
                }}
            >
                <FlexboxGrid.Item colspan={10}>
                    <Form onSubmit={handleSubmit} fluid>
                        <Form.Group controlId="username">
                            {/* <Form.ControlLabel>Username</Form.ControlLabel> */}
                            <Form.Control
                                name="name"
                                value={username}
                                onChange={(event) => setUsername(event)}
                                required
                                placeholder="Username"
                            />
                        </Form.Group>
                        <Form.Group controlId="password">
                            {/* <Form.ControlLabel>Password</Form.ControlLabel> */}
                            <Form.Control
                                name="password"
                                value={password}
                                type="password"
                                autoComplete="off"
                                onChange={(event) => setPassword(event)}
                                required
                                placeholder="Password"
                            />
                        </Form.Group>
                        <Form.Group>
                            <ButtonToolbar>
                                <Button
                                    appearance="primary"
                                    color="green"
                                    type="submit"
                                    block
                                >
                                    Login
                                </Button>
                            </ButtonToolbar>
                        </Form.Group>
                    </Form>
                </FlexboxGrid.Item>
            </FlexboxGrid>
        </>
    );
};

export default LoginPage;
