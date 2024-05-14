import { useEffect, useState } from "react";
import "./App.css";
import ChatPage from "./pages/ChatPage";
import LoginPage from "./pages/LoginPage";
import UserContext from "./Context/UserContext";

function App() {
  const [user, setUser] = useState(false);
  useEffect(() => {
    setUser(localStorage.getItem("user"));
  }, [user]);

  const addUser = (name) => {
    setUser(name);
    localStorage.setItem("user", name);
  };
  return (
    <>
      <UserContext.Provider value={addUser}>
        {user ? <ChatPage user={user} /> : <LoginPage  />}
      </UserContext.Provider>{" "}
    </>
  );
}

export default App;
