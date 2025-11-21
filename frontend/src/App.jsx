import { BrowserRouter,Routes,Route} from "react-router-dom";
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { AuthProvider } from "./contexts/AuthContext";
import Home from "./pages/Home";
import SignUp from './pages/SignUp';
import CreateRoom from './pages/CreateRoom';
import Demo from './pages/Demo';
import SignIn  from "./pages/SignIn";
import Dashboard from "./pages/Dashboard";
import JoinMeeting from './pages/JoinMeeting';
import Settings from './pages/Settings';
import Schedule from "./pages/Schedule";
import Features from "./pages/Features";
import Pricing from "./pages/Pricing";
import Enterprise from "./pages/Enterprise";
import AdminLogin from "./pages/AdminLogin";
import AdminDashboard from "./pages/AdminDashboard";
import VideoRoom from "./pages/VideoRoom";


function App() {

  return (
     <AuthProvider>
    <BrowserRouter>
    <Routes>
        <Route element={<Home/>} path="/"/>
        <Route element={<SignUp/>} path="/signup"/>
        <Route element={<CreateRoom/>} path="/createroom"/>
        <Route element={<Demo/>} path="/demo"/>
        <Route element={<SignIn/>} path="/signin"/>
        <Route element={<Dashboard/>} path="/dashboard"/>
        <Route element={<JoinMeeting/>} path="/join"/>
        <Route element={<Settings/>} path="/settings"/>
        <Route element={<Schedule/>} path="/schedule"/>
        <Route element={<Features/>} path="/features"/>
        <Route element={<Pricing/>} path="/pricing"/>
        <Route element={<Enterprise/>} path="/enterprise"/>
        <Route element={<AdminLogin/>} path="/admin/login"/>
        <Route element={<AdminDashboard/>} path="/admin/dashboard"/>
        <Route element={<VideoRoom/>} path="/meeting/:meetingId"/>
    </Routes>
    <ToastContainer position="top-right" autoClose={3000} />
    </BrowserRouter>
    </AuthProvider>

  );
}

export default App;