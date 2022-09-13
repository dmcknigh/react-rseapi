import React, { useState, useRef, useEffect, useContext } from "react";
import Card from "../Layout/Card";
import { fetchContent, putContent } from "../../util/common-properties-service";
import AuthContext from "../../store/auth-context";
import classes from "./Team.module.css";
import Table from "rc-table";

const NAMESPACE = "messages";
const JPATH = "/messages";

const TeamView = (props) => {
  const columns = [
    {
      title: "User",
      dataIndex: "user",
      key: "user",
      width: 50,
    },
    {
      title: "Message",
      dataIndex: "message",
      key: "message",
      width: 800,
    },
    /*
    {
      title: "Time",
      dataIndex: "time(ms)",
      key: "time(ms)",
      width: 100,
    },
    */
  ];

  const [messages, setMessages] = useState("");
  const authCtx = useContext(AuthContext);
  const userMessageRef = useRef();

  useEffect(() => {
    const callFetchMessages = async () => {
      const response = await fetchContent(NAMESPACE, JPATH, authCtx);
      const data = await response.json();
      setMessages(data);
    };

    callFetchMessages();
  }, [authCtx]);

  const onSendMessage = (event) => {
    const msg = userMessageRef.current.value;
    const t = new Date().getTime();

    const msgJSON = { user: authCtx.userId, message: msg, "time(ms)": t };
    const newMessages = [...messages, msgJSON];
    setMessages(newMessages);

    const msgContainer = { messages: newMessages };

    // call send API
    putContent(NAMESPACE, "/", msgContainer, authCtx);

    userMessageRef.current.value = "";
  };

  const layoutStyle = { display: "grid", gridTemplateRows: "2fr 0.1fr" };
  const inputStyle = { display: "grid", gridTemplateColumns: "4fr 1fr" };
  const tableStyle = {}; // { display: "grid", height: 200, width: "100%" };

  return (
    <Card>
      <div className={classes.control}>
        <div style={layoutStyle}>
          <div className={classes.containers}>
            <Table
              columns={columns}
              data={messages}
              tableLayout="auto"
              useFixedHeader={false}
              scroll={{ x: false, y: 500 }}
            />
          </div>
          <div style={inputStyle}>
            <input
              className={classes.input}
              type="text"
              id="text"
              required
              ref={userMessageRef}
            />
            <button onClick={onSendMessage}>Send Message</button>
          </div>
        </div>
      </div>
    </Card>
  );
};

export default TeamView;
