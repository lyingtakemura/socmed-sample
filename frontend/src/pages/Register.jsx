import React, { useState } from "react";
import axios from "axios";
import { Form, ButtonToolbar, Button, FlexboxGrid, Message } from "rsuite";
import { useNavigate } from "react-router-dom";

const LoginPage = () => {
    const [email, setEmail] = useState("");
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [rePassword, setRePassword] = useState("");
    const [alert, setAlert] = useState("");
    let navigate = useNavigate();

    const handleSubmit = () => {
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
                }, 3000);
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
                <FlexboxGrid
                    justify="center"
                    style={{ margin: "0.5rem", justify: "center" }}
                >
                    <FlexboxGrid.Item colspan={10}>
                        <Message
                            showIcon
                            type={alert.type}
                            onClose={(event) => setAlert("")}
                        >
                            {alert.body}
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
                        <Form.Group controlId="email">
                            {/* <Form.ControlLabel>Username</Form.ControlLabel> */}
                            <Form.Control
                                name="email"
                                value={email}
                                onChange={(event) => setEmail(event)}
                                required
                                placeholder="Username"
                            />
                        </Form.Group>
                        <Form.Group controlId="username">
                            {/* <Form.ControlLabel>Username</Form.ControlLabel> */}
                            <Form.Control
                                name="username"
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
                        <Form.Group controlId="rePassword">
                            {/* <Form.ControlLabel>Password</Form.ControlLabel> */}
                            <Form.Control
                                name="password"
                                value={rePassword}
                                type="password"
                                autoComplete="off"
                                onChange={(event) => setRePassword(event)}
                                required
                                placeholder="Password Confirmation"
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
                                    Register
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
