import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./contexts/AuthContext";
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import Home from "./pages/Home";
import SignUp from './pages/SignUp';
import CreateRoom from './pages/CreateRoom';
import Demo from './pages/Demo';
import SignIn from "./pages/SignIn";
import Dashboard from "./pages/Dashboard";
import JoinMeeting from './pages/JoinMeeting';
import VideoMeeting from './pages/VideoMeeting';
import Settings from './pages/Settings';
import Schedule from "./pages/Schedule";
import Features from "./pages/Features";
import Pricing from "./pages/Pricing";
import Enterprise from "./pages/Enterprise";

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route element={<Home />} path="/" />
          <Route element={<SignUp />} path="/signup" />
          <Route element={<CreateRoom />} path="/createroom" />
          <Route element={<Demo />} path="/demo" />
          <Route element={<SignIn />} path="/signin" />
          <Route element={<Dashboard />} path="/dashboard" />
          <Route element={<JoinMeeting />} path="/join" />
          <Route element={<VideoMeeting />} path="/meeting/:roomId" />
          <Route element={<Settings />} path="/settings" />
          <Route element={<Schedule />} path="/schedule" />
          <Route element={<Features />} path="/features" />
          <Route element={<Pricing />} path="/pricing" />
          <Route element={<Enterprise />} path="/enterprise" />
        </Routes>
      </BrowserRouter>
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="dark"
      />
    </AuthProvider>
  );
}

export default App;