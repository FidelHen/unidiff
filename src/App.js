import React from "react";
import { Routes, Route } from "react-router-dom";
import Home from "./views/main/home";
import ViewUniversity from "./views/main/view-university";
import AddTuition from "./views/main/add-tuition";
import SignIn from "./views/auth/log-in";
import SignUp from "./views/auth/sign-up";
import ForgotPassword from "./views/auth/forgot-password";
import Error404 from "./views/error/404";
import AppLayout from "./layout/app-layout";
import AuthLayout from "./layout/auth-layout";

function App() {
  return (
    <Routes>
      <Route element={<AppLayout />}>
        <Route path="/" element={<Home />} />
        <Route path="/add-tuition" element={<AddTuition />} />
        <Route path="/universities/view/:uni_id" element={<ViewUniversity />} />
      </Route>
      <Route element={<AuthLayout />}>
        <Route path="/auth/sign-in" element={<SignIn />} />
        <Route path="/auth/sign-up" element={<SignUp />} />
        <Route path="/auth/forgot-password" element={<ForgotPassword />} />
      </Route>
      <Route path="*" element={<Error404 />} />
    </Routes>
  );
}

export default App;
