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
        'Authorization': 'Token ' + '38df272f7e163527f4cb3594f8f381b957547dd6' //currentUser.token
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

  const getMessages = (event, receiverId) => {
    console.log(receiverId)
    axios.get("http://127.0.0.1:8000/messages?receiver=" + receiverId,  { 
      headers: {
        'Authorization': 'Token ' + currentUser.token
      }
    })
    .then((response) => {
      console.log(response.data)
      setMessages(response.data)
    })
  }

  return (
  <> 
    <FlexboxGrid justify="center" style={{marginTop: "0.5rem"}}>
      <FlexboxGrid.Item colspan={6}>
        <Panel header="{CHATS_LIST}" bordered style={{ height: "80vh"}}>
          { contacts && contacts.map((contact) => 
              <Panel bordered style={{marginBottom: "0.5rem"}} key={contact.id} onClick={event => getMessages(event, contact.id)}>
                {contact.username}
              </Panel>
            )
          }
        </Panel>  
      </FlexboxGrid.Item>
      &nbsp;
      <FlexboxGrid.Item colspan={12}>
        <Panel header="{CURRENT_CHAT_NAME}" bordered style={{ height: "80vh"}}>
          {messages && messages.map((message) => 
            <Panel bordered key={message.id} style={{ marginBottom: "0.5rem" }}  align={message.sender === currentUser.id ? 'right' : ''}>
              {message.body} | {message.created_at}
            </Panel>
          )}


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