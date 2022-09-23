import React, { useState, useEffect } from "react";
import axios from "axios";
import { Panel, PanelGroup } from 'rsuite';

const Feed = () => {
  const [posts, setPosts] = useState()

  useEffect(() => {
    axios.get(
      'http://127.0.0.1:8000/posts/'
    ).then(response => {
      setPosts(response.data)
      console.log(response)
    }).catch((error) => {
      console.log(error)
    })
  }, []) // without second param useEffect will stuck in update loop

  return (
  <> 
    <PanelGroup>
      {posts && posts.map((post) => ( //check if posts array have been loaded from axios request to state before render
        <Panel header={`USER: ${post.user} POSTED AT ${post.created_at}`} key={post.id}>
          {post.body}
        </Panel>
      ))}
    </PanelGroup>
  </>
  );
}

export default Feed;