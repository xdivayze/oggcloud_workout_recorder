import { Route, Routes } from "react-router-dom";
import Layout from "./Layout";
import Home from "./Pages/Home/Home";
import LogWorkout from "./Pages/Secure/LogWorkout/LogWorkout";
import SecurityContext from "./Pages/Secure/SecurityContext";
import Login from "./Pages/Login/Login";
import ProtectedWrapper from "./Pages/Secure/ProtectedWrapper";
import SignOut from "./Pages/Secure/SignOut";
import Progress from "./Pages/Secure/Progress/Progress";

function App() {
  return (
    <SecurityContext>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Home />} />
          <Route path="login" element={<Login />} />
          <Route path="" element={<ProtectedWrapper />}>
            <Route path="log-workout" element={<LogWorkout />} />
            <Route path="sign-out" element={<SignOut />} />
            <Route path="progress" element={<Progress />} />
          </Route>
        </Route>
      </Routes>
    </SecurityContext>
  );
}

export default App;
