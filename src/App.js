import { useState, useEffect } from "react";


function App() {
  const [value, setValue] = useState(null);
  const [message, setMessage] = useState(null);
  const [previousChat, setPreviousChats] = useState([]);
  const [currentTitle, setCurrentTitle] = useState(null);

  const createNewChat = () => {
    setMessage(null)
    setValue("")
    setCurrentTitle(null);
  }

  const handleClick = (uniqueTitle) => {
    setCurrentTitle(uniqueTitle);
    setMessage(null);
    setValue("");
  };

  const getMessages = async () => {
    const options = {
      method: 'POST',
      body: JSON.stringify({
        message: value,
      }),
      headers: {
        "Content-Type": "application/json"
      }
    }

    try {
      const response = await fetch('http://localhost:8000/completions', options)
      const data = await response.json();
      setMessage(data.choices[0].message);
    } catch (error) {
      console.error(error);
    }
  };


  useEffect(() => {
    console.log(currentTitle, value, message);
    if (!currentTitle && value && message) {
      setCurrentTitle(value);
    }
    if (currentTitle && value && message) {
      setPreviousChats(prevChats => (
        [...prevChats, {
          title: currentTitle,
          role: "user",
          content: value,
        }, {
          title: currentTitle,
          role: message.role,
          content: message.content,
        }]
      ));
    }
  }, [message, currentTitle]);

  console.log(previousChat);

  const currentChat = previousChat.filter(previousChats => previousChats.title === currentTitle)
  const uniqueTitles = Array.from(new Set(previousChat.map(previousChats => previousChats.title)))
  console.log(uniqueTitles)
  return (
    <div className="App">
      <section className="side-bar">
        <button onClick={createNewChat}> + New Chat</button>
        <ul className="history">
          {uniqueTitles?.map((uniqueTitle, index) => <li key={index} onClick={() => handleClick(uniqueTitle)}>{uniqueTitle}</li>)}
        </ul>
        <nav>Made by Yavuzhan</nav>
      </section>
      <section className="main">
        {!currentTitle && <h1>YoboGPT</h1>}
        <ul className="feed">
          {currentChat?.map((chatMessage, index) => <li key={index}>
            <p className="role">{chatMessage.role}</p>
            <p>{chatMessage.content}</p>
          </li>)}
        </ul>
        <div className="bottom-section">
          <div className="input-container">
            <input value={value} onChange={(e) => setValue(e.target.value)} />
            <div id="submit" onClick={getMessages}>
              ➢
            </div>
            <p className="info">
              Chat Gpt March 14 version .Free reserved Preview
              Your FeedBack will help us improve
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}

export default App;
