import React, { useState } from "react";
import axios from "axios";
import { useDispatch } from 'react-redux'
import { login } from '../redux/usersSlice'
import { Form, ButtonToolbar, Button, FlexboxGrid } from 'rsuite';


const LoginPage = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const dispatch = useDispatch();

  const handleSubmit = () => {
      axios.post('http://127.0.0.1:8000/auth/token/login/',
      {
        "username": username,
        "password": password
      },
    )
    .then((response) => {
      const token = response.data["auth_token"]
      let details;

      axios.get('http://127.0.0.1:8000/auth/users/me/', {
        headers: {
          'Authorization': 'Token ' + token
        }
      })
      .then((response) => {
        details = response.data
        const currentUser = {
          id: details.id,
          token: token,
          username: details.username,
          email: details.email,
        }
        dispatch(login(currentUser))
        setUsername('')
        setPassword('')
      })
    })
    .catch((error) => {
      console.log(error)
    })
  }

  return (
    <>
      <h1 style={{textAlign: "center"}}>Login</h1>
      <FlexboxGrid justify="center">
        <FlexboxGrid.Item colspan={8}>
          <Form onSubmit={handleSubmit} fluid >
            <Form.Group controlId="username">
              <Form.ControlLabel>Username</Form.ControlLabel>
              <Form.Control name="name" value={username} onChange={event => setUsername(event)} required />
            </Form.Group>
            <Form.Group controlId="password">
              <Form.ControlLabel>Password</Form.ControlLabel>
              <Form.Control name="password" value={password} type="password" autoComplete="off" onChange={event => setPassword(event)} required />
            </Form.Group>
            <Form.Group>
              <ButtonToolbar>
                <Button appearance="primary" color="green" type="submit" block>Submit</Button>
              </ButtonToolbar>
            </Form.Group>
          </Form>
        </FlexboxGrid.Item>
      </FlexboxGrid>
    </>
  )
}

export default LoginPage;