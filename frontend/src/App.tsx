import { Route, Routes } from "react-router-dom";
import Layout from "./Layout";
import Home from "./Pages/Home/Home";
import LogWorkout from "./Pages/Secure/LogWorkout/LogWorkout";
import SecurityContext from "./Pages/Secure/SecurityContext";
import Login from "./Pages/Login/Login";
import ProtectedWrapper from "./Pages/Secure/ProtectedWrapper";

function App() {
  return (
    <SecurityContext>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Home />} />
          <Route path="login" element={<Login />} />
          <Route path="" element={<ProtectedWrapper />}>
            <Route path="log-workout" element={<LogWorkout />} />
          </Route>
        </Route>
      </Routes>
    </SecurityContext>
  );
}

export default App;
