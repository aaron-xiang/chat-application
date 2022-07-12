import React from 'react'
import { useEffect } from 'react'
import { useState } from 'react'
import ScrollToBottom from 'react-scroll-to-bottom'

function Chat({socket, username, room}) {
  const [currentMessage, setCurrentMessage] = useState("")
  const [messageList, setMessageList] = useState([])

  const sendMessage = async () => {
    if (currentMessage !== "") {
      const messageData = {
        room: room,
        sender: username,
        message: currentMessage,
        time: new Date(Date.now()).getHours() + ":" + 
              new Date(Date.now()).getMinutes()
      }

      await socket.emit("send_message", messageData)
      setMessageList((list) => [...list, messageData])
    }
  }

  useEffect(() => {
    socket.on("receive_message", (data) => {
      setMessageList((list) => [...list, data])
    })
  }, [socket])

  return (
    <div className='chat-window'>
      <div className="chat-header">
        <p>Live Chat</p>
      </div>
      <div className="chat-body">
        <ScrollToBottom className='message-container'>
          {messageList.map((messageContent) => {
            return (
              <div className='message' 
              id={username === messageContent.sender ? "you" : "other"}>
                <div>
                  <div className='message-content'>{messageContent.message}</div>
                  <div className='message-meta'>
                    <p id='time'>{messageContent.time}</p>
                    <p id='sender'>{messageContent.sender}</p>
                  </div>
                </div>
              </div>
            ) 
          })}
        </ScrollToBottom>
      </div>
      <div className="chat-footer">
        <input type="text" placeholder='Hey...'
          onChange={(event) => {
            setCurrentMessage(event.target.value)
          }}
          onKeyPress={(event) => {
            event.key === "Enter" && sendMessage() 
          }}
        />
        <button onClick={sendMessage}>&#9658;</button>
      </div>
      <button>Leave Chat</button>
    </div>
  )
}

export default Chat