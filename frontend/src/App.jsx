import { useState } from "react";
import Login from "./components/Login";
import Register from "./components/Register";

function App() {
  const [count, setCount] = useState(0);

  return (
    <>
      <Register />
      <Login />
    </>
  );
}

export default App;
