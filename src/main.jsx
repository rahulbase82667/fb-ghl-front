import React from "react";
import ReactDOM from "react-dom/client";
import { Provider } from "react-redux";
import { BrowserRouter } from "react-router-dom";
import store from "./redux/store";
import App from "./App";
import "./index.css"; // Tailwind

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <Provider store={store}>
    <BrowserRouter >
    {/* <BrowserRouter basename="http://localhost:5173"> */}
      <App />
    </BrowserRouter> 
  </Provider> 
);
