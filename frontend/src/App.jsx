import React from "react"
import 'bootstrap/dist/css/bootstrap.min.css'
import "../src/App.css"
import {Routes, Route} from 'react-router-dom'
import Login from "./components/authorization/Login"
import 'react-toastify/dist/ReactToastify.css';
import { ToastContainer } from "react-toastify"
import ChatPage from "./components/chatapp/ChatPage"
import ServicePage from "./components/payment/ServicePage"
import CheckoutSuccess from "./components/payment/CheckoutSuccess"
import NotFound from "./components/payment/NotFound"


const App = () => {
  

  return (
    <>
        <Routes>
          <Route path="/" element={<Login/>}/>
          <Route path="/chats" element={<ChatPage/>}/>
          <Route path='/service' element={<ServicePage/>}/>
          <Route path='/checkout-success' element={<CheckoutSuccess />} />
          <Route path='*' element={<NotFound />} />
        </Routes>
        <ToastContainer/>
    </>
  )
}

export default App