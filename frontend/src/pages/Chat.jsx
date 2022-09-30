import React, { useState, useEffect } from "react";
import { FlexboxGrid, Panel, Input, InputGroup, Form, } from 'rsuite';
import SendIcon from '@rsuite/icons/Send';
import axios from "axios"
import { useSelector } from 'react-redux'

const Feed = (props) => {
  const [input, setInput] = useState("")
  const [messages, setMessages] = useState("")
  const [contacts, setContacts] = useState("")
  let currentUser = useSelector((state) => state.users.currentUser)
  const ws = props.ws

  useEffect(() => {
    axios.get("http://127.0.0.1:8000/contacts/", { 
      headers: {
        'Authorization': 'Token ' + currentUser.token
      }
    })
    .then((response) => {
      setContacts(response.data)
      console.log(response.data)
    }).catch((error) => {
      console.log(error)
    })
  }, []) // without second param useEffect will stuck in update loop  


  const sendMessage = () => {
    console.log(input)
    ws.send(JSON.stringify({
      'message': input
    }))
    setInput("")
  }

  return (
  <> 
    <FlexboxGrid justify="center" style={{marginTop: "0.5rem"}}>
      <FlexboxGrid.Item colspan={6}>
        <Panel header="{CHATS_LIST}" bordered style={{ height: "80vh"}}>
          { contacts && contacts.map((contact) => 
              <Panel bordered style={{marginBottom: "0.5rem"}} key={contact.id} >
                {contact.username}
              </Panel>
            )
          }
        </Panel>  
      </FlexboxGrid.Item>
      &nbsp;
      <FlexboxGrid.Item colspan={12}>
        <Panel header="{CURRENT_CHAT_NAME}" bordered style={{ height: "80vh"}}>
          <Panel bordered>
            {messages}
          </Panel>

          {/* <form onSubmit={event => sendMessage(event)}>
            <input placeholder='type message' value={input} onChange={event => setInput(event.target.value)} />
            <input type="submit" value="send" />
          </form> */}

          <Form onSubmit={sendMessage} style={{marginTop: "1rem"}}>
            <InputGroup size="lg">
              <Input value={input} onChange={event => setInput(event)} />
              <InputGroup.Button type="submit">
                <SendIcon  />
              </InputGroup.Button>
            </InputGroup>
          </Form>

        </Panel>  
      </FlexboxGrid.Item>
    </FlexboxGrid>
  </>
  );
}

export default Feed;