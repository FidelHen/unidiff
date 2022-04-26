import React, { useEffect, useState } from "react";
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
import { getAuth } from "firebase/auth";

function App() {
  const auth = getAuth();
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    auth.onAuthStateChanged((user) => {
      if (user) {
        console.log("user logged in");
        setIsAuthenticated(true);
      } else {
        console.log("user logged out");
        setIsAuthenticated(false);
      }
    });
  }, [auth]);

  return (
    <Routes>
      <Route element={<AppLayout isAuthenticated={isAuthenticated} />}>
        <Route path="/" element={<Home />} />
        <Route path="/add-tuition" element={<AddTuition />} />
        <Route path="/universities/view/:uni_id" element={<ViewUniversity />} />
      </Route>
      <Route element={<AuthLayout />}>
        <Route
          path="/auth/sign-in"
          element={<SignIn isAuthenticated={isAuthenticated} />}
        />
        <Route
          path="/auth/sign-up"
          element={<SignUp isAuthenticated={isAuthenticated} />}
        />
        <Route
          path="/auth/forgot-password"
          element={<ForgotPassword isAuthenticated={isAuthenticated} />}
        />
      </Route>
      <Route path="*" element={<Error404 />} />
    </Routes>
  );
}

export default App;
