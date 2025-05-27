import { Route, Routes } from "react-router-dom";
import Layout from "./Layout";
import Home from "./Pages/Home/Home";
import LogWorkout from "./Pages/Secure/LogWorkout/LogWorkout";
import SecurityContext from "./Pages/Secure/SecurityContext";
import Login from "./Pages/Secure/Login/Login";

function App() {
  return (
    <SecurityContext>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Home />} />
          <Route path="log-workout" element={<LogWorkout />} />
          <Route path="login" element={<Login />} />
        </Route>
      </Routes>
    </SecurityContext>
  );
}

export default App;
