import React from "react";
import axios from "axios";

class LoginPage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      username: '',
      password: ''
    };
  }

  handleChange(event) {
    this.setState({
      [event.target.name]: event.target.value
    })
    console.log(event.target.name)
    console.log(event.target.value)

  }

  handleSubmit(event) {
    event.preventDefault();
    axios.post('http://127.0.0.1:8000/auth/token/login/',
      {
        "username": this.state.username,
        "password": this.state.password
      },
    )
    .then((response) => {
      console.log(response)
      localStorage.setItem("auth_token", response.data["auth_token"])
      console.log("TOKEN:", localStorage.getItem("auth_token"))
    })
    .catch((error) => {
      console.log(error)
    })
  }

  render() {
    return (
      <form>
        <input type="text" name="username" value={this.state.username} onChange={this.handleChange.bind(this)} />
        <input type="password" name="password" value={this.state.password} onChange={this.handleChange.bind(this)} />
        <input type="submit" value="Submit" onClick={this.handleSubmit.bind(this)} />
      </form>
    )
  }
}

export default LoginPage;