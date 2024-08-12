import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import './App.css';
import Login from './components/Login';
import ChatRoom from './components/ChatRoom';
import AuthProvider from './Context/AuthProvider';
import AppProvider from './Context/AppProvider';
import AddRoomModal from './components/Modals/AddRoomModal';
import InviteMemberModal from './components/Modals/InviteMemberModal';
import JoinRoomModal from './components/Modals/JoinRoomByIDModal';

function App() {
  return (
    <Router>
      <AuthProvider>
        <AppProvider>
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/" element={<ChatRoom />} />
          </Routes>
          <AddRoomModal />
          <InviteMemberModal />
          <JoinRoomModal />
        </AppProvider>
      </AuthProvider>
    </Router>
  );
}

export default App;
