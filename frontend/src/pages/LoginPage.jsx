import React from "react";
import {
    Content,
    Form,
    ButtonToolbar,
    Button,
    Panel,
    FlexboxGrid
  } from 'rsuite';

class LoginPage extends React.Component {
    render() {
        return (
            <Content>
            <FlexboxGrid justify="center">
              <FlexboxGrid.Item colspan={12}>
                <Panel header={<h3>Login</h3>} bordered>
                  <Form fluid>
                    <Form.Group>
                      <Form.ControlLabel>Username or email address</Form.ControlLabel>
                      <Form.Control name="name" />
                    </Form.Group>
                    <Form.Group>
                      <Form.ControlLabel>Password</Form.ControlLabel>
                      <Form.Control name="password" type="password" autoComplete="off" />
                    </Form.Group>
                    <Form.Group>
                      <ButtonToolbar>
                        <Button appearance="primary">Sign in</Button>
                        <Button appearance="link">Forgot password?</Button>
                      </ButtonToolbar>
                    </Form.Group>
                  </Form>
                </Panel>
              </FlexboxGrid.Item>
            </FlexboxGrid>
          </Content>
        )
    }
}

export default LoginPage;