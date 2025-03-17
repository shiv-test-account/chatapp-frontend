import React, { useContext, useRef, useState, useEffect } from "react";
import { Row, Col, Button } from "react-bootstrap";
import "./MessageForm.css";
import { useSelector } from "react-redux";
import { AppContext } from "../context/appContext";

function MessageForm() {
  const [message, setMessage] = useState("");

  const user = useSelector((state) => state.userReducer);
  const { socket, currentRoom, setMessages, messages, privateMemberMsg } =
    useContext(AppContext);
  const messageEndRef = useRef(null);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  function getFormattedDate() {
    const date = new Date();
    const year = date.getFullYear();
    let month = (1 + date.getMonth()).toString();

    month = month.length > 1 ? month : "0" + month;
    let day = date.getDate().toString();

    day = day.length > 1 ? day : "0" + day;

    return month + "/" + day + "/" + year;
  }
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!message) return;
    const today = new Date();
    const minutes =
      today.getMinutes() < 10 ? "0" + today.getMinutes() : today.getMinutes();
    const time = today.getHours() + ":" + minutes;
    const roomId = currentRoom;
    socket.emit("message-room", roomId, message, user, time, todayDate);
    setMessage("");
  };

  function scrollToBottom() {
    messageEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }

  const todayDate = getFormattedDate();

  socket.off("room-messages").on("room-messages", (roomMessages) => {
    console.log("Room Messages:", roomMessages);
    setMessages(roomMessages);
  });

  // console.log("Messages Main", messages[0].messagesByDate[0].content);
  return (
    <>
      <div className="messages-output">
        {user.isLoggedIn && !privateMemberMsg?._id && (
          <div className="alert alert-info">
            You are in the {currentRoom} room
          </div>
        )}
        {user.isLoggedIn && privateMemberMsg?._id && (
          <>
            <div className="alert alert-info conversation-info">
              <div>
                Your conversation with {privateMemberMsg.name}{" "}
                <img
                  src={privateMemberMsg.picture}
                  className="conversation-profile-pic"
                />
              </div>
            </div>
          </>
        )}
        {!user.isLoggedIn && (
          <div className="alert alert-danger">Please Login</div>
        )}

        {user.isLoggedIn &&
          messages.map(({ _id: date, messagesByDate }, idx) => (
            <div key={idx}>
              <p className="alert alert-info text-center message-date-indicator">
                {date}
              </p>
              {messagesByDate?.map(
                ({ content, time, from: sender }, msgIdx) => (
                  <div
                    className={
                      sender?.username == user?.username
                        ? "message"
                        : "incoming-message"
                    }
                    key={msgIdx}
                  >
                    <div className="message-inner">
                      <div className="d-flex align-items-center mb-3">
                        <img
                          src={sender.picture}
                          style={{
                            width: 35,
                            height: 35,
                            objectFit: "cover",
                            borderRadius: "50%",
                            marginRight: 10,
                          }}
                        />
                        <p className="message-sender">
                          {sender._id == user?._id ? "You" : sender.name}
                        </p>
                      </div>
                      <p className="message-content">{content}</p>
                      <p className="message-timestamp-left">{time}</p>
                    </div>
                  </div>
                )
              )}
            </div>
          ))}
        <div ref={messageEndRef} />
      </div>
      <form onSubmit={handleSubmit}>
        <Row>
          <Col md={11}>
            <input
              type="text"
              placeholder="Your message"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              disabled={!user.isLoggedIn}
              style={{padding: 10, margin: 5, borderRadius: 50, width: "80vh"}}
            />
          </Col>
          <Col md={1}>
            <Button
              variant="primary"
              type="submit"
              style={{ width: "100%", backgroundColor: "orange", margin: 5 }}
              disabled={!user.isLoggedIn}
            >
              <i className="fas fa-paper-plane"></i>
            </Button>
          </Col>
        </Row>
      </form>
    </>
  );
}

export default MessageForm;
