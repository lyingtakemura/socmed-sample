import React, { useState, useEffect } from "react";


const Feed = () => {
  // const [posts, setPosts] = useState()
  const [input, setInput] = useState("")

  useEffect(() => {

  }, []) // without second param useEffect will stuck in update loop  


  const handleSendMessage = e => {
    e.preventDefault()
    console.log(input)
    // ws.send(input)
  }

  return (
  <> 
    <h1>CHAT</h1>
    <form onSubmit={event => handleSendMessage(event)}>
      <input placeholder='type message' value={input} onChange={event => setInput(event.target.value)} />
      <input type="submit" value="send" />
    </form>
  </>
  );
}

export default Feed;