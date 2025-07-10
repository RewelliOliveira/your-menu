import "./App.css";
import { Router } from "./router/router";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export function App() {
  return (
    <>
      <Router />
      <ToastContainer />
    </>
  );
}