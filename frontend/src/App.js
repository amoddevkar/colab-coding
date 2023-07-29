import React, { useState, useEffect, useContext } from 'react';
import Editor from './components/editor';
import { SocketContext } from './Context';

function App() {

  const { call, socket, setCalling, callUser, myVideo, callAccepted, userVideo, leaveCall, answerCall, calling } = useContext(SocketContext)


  const [html, setHtml] = useState('')
  const [css, setCss] = useState('')
  const [js, setJs] = useState('')
  const [srcDoc, setSrcDoc] = useState('')
  const [userToCall, setUserToCall] = useState("")



  useEffect(() => {
    const timeout = setTimeout(() => {
      setSrcDoc(`
        <html>
          <body>${html}</body>
          <style>${css}</style>
          <script>${js}</script>
        </html>
      `)
      if (call) socket.emit("codeChange", { html, css, js, from: call.from })
    }, 250)
    return () => clearTimeout(timeout)
  }, [html, css, js])

  useEffect(() => {
    socket.on("codeChange", ({ html, css, js }) => {
      setHtml(html);
      setCss(css);
      setJs(js);
    })
  }, [])

  const handleClick = () => {
    setCalling(true)
    callUser(userToCall)
  }

  return (<>
    < div style={{ display: "flex", flexDirection: "column" }
    }>
      <div className="pane top-pane">
        <Editor
          language="html"
          displayName="HTML"
          value={html}
          onChange={setHtml}
        />
        <Editor
          language="css"
          displayName="CSS"
          value={css}
          onChange={setCss}
        />
        <Editor
          language="javascript"
          displayName="JS"
          value={js}
          onChange={setJs}
        />
      </div>
      <div className="pane">
        <iframe
          srcDoc={srcDoc}
          title="output"
          sandbox="allow-scripts"
          frameBorder="0"
          width="100%"
          height="100%"
        />
      </div>
    </div >
    <div style={{
      minHeight: "200px",
      minWidth: "200px",
      position: "fixed",
      bottom: 10,
      left: 10,
      borderRadius: 20
    }}>
      <video
        autoPlay
        playsInline
        muted
        style={{ width: "200px" }}
        ref={myVideo}
      ></video>
    </div>

    <div style={{
      minHeight: "200px",
      minWidth: "200px",
      position: "fixed",
      bottom: 10,
      right: 10,
      borderRadius: 20
    }}>
      {callAccepted ? (<><video
        autoPlay
        playsInline
        muted
        style={{ width: "200px" }}
        ref={userVideo}
      ></video><button onClick={() => {
        leaveCall(call.from)
        console.log(call.from);
      }}>End Call</button></>) :
        (
          call ? (<button onClick={answerCall}>answer call from {call.from}</button>) :
            (<><input type='text' onChange={(e) => { setUserToCall(e.target.value) }} />
              <button onClick={handleClick}>call</button>
              {calling && (<p>Calling to {userToCall}</p>)}
            </>)
        )}
    </div>
  </>)

}

export default App;