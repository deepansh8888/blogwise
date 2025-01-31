import './App.css';
import {BrowserRouter, Routes, Route, Navigate, Outlet} from 'react-router-dom';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import ViewBlog from './pages/ViewBlog';
import ProtectedRoute from './components/ProtectedRoute';
import Drafts from './pages/Drafts';
import NavBar from './components/NavBar';
import { ToggleProvider } from './context/myContext';
import MyBlogs from './pages/MyBlogs';

const App = () =>{
  return (
    <ToggleProvider>
    <BrowserRouter>
    <Routes>
    <Route path="/login" element={<Login/>} />
    <Route path="/register" element={<Register/>} />
    <Route path="/" element={ <Login/>} />

      <Route element= {<ProtectedRoute/>} >
      <Route element={ <>  <NavBar />  <Outlet />   </> } >
      <Route path="/home" element={<Home/>} />
      <Route path="/viewblog" element={<ViewBlog/>} />
      <Route path="/drafts" element={<Drafts/>} />
      <Route path='/myblogs' element={<MyBlogs/>} />
      </Route>
      </Route>

      <Route path="*" element={ <Navigate to="/" /> } />
    </Routes>
    </BrowserRouter>
    </ToggleProvider>
  )
}

export default App;
