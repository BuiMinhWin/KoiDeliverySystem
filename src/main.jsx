import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App.jsx";
import "./index.css";
import "bootstrap/dist/css/bootstrap.min.css";
import { GoogleOAuthProvider } from "@react-oauth/google";
import { SnackbarProvider } from "notistack";

createRoot(document.getElementById("root")).render(
  <GoogleOAuthProvider clientId="168634669859-34entdccui9d411p4438g664kim5ft64.apps.googleusercontent.com">
    <StrictMode>
      <SnackbarProvider
        maxSnack={3}
        anchorOrigin={{
          vertical: "top",
          horizontal: "right",
        
        }}
        autoHideDuration={1000}
      >
        <App />
      </SnackbarProvider>
    </StrictMode>
  </GoogleOAuthProvider>
);
