import React, { useState } from "react";
import axios from "axios";
import { useDispatch } from 'react-redux'
import { login } from '../redux/usersSlice'


const LoginPage = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const dispatch = useDispatch();

  const handleSubmit = (event) => {
    event.preventDefault();
    axios.post('http://127.0.0.1:8000/auth/token/login/',
      {
        "username": username,
        "password": password
      },
    )
    .then((response) => {
        dispatch(login(response.data["auth_token"]))
    })
    .catch((error) => {
      console.log(error)
    })
  }

  return (
    <>
    <form onSubmit={event => { handleSubmit(event) }}>
      <input type="text" name="username" value={username} onChange={event => setUsername(event.target.value)} />
      <input type="password" name="password" value={password} onChange={event => setPassword(event.target.value)} />
      <input type="submit" value="Submit" />
    </form>
    </>
  )
}

export default LoginPage;