import React from 'react';
import { Routes, Route } from "react-router-dom";
import Home from './views/main/home';
import AddTuition from './views/main/add-tuition';
import ViewUniversity from './views/main/view-university';
import LogIn from './views/auth/log-in';
import SignUp from './views/auth/sign-up';
import Error404 from './views/error/404';

function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/add-tuition" element={<AddTuition />} />
      <Route path="/university/view/:uni_id" element={<ViewUniversity />} />
      <Route path="/auth/log-in" element={<LogIn />} />
      <Route path="/auth/sign-up" element={<SignUp />} />
      <Route path="*" element={<Error404 />} />
    </Routes>
  );
}

export default App;
