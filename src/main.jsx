import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import { GoogleOAuthProvider } from "@react-oauth/google";

// Replace this with your actual Google Client ID from Google Cloud Console
const GOOGLE_CLIENT_ID =
	"377636091587-hli3qmv774jdf1f14q38amo8bt5f36j2.apps.googleusercontent.com";

createRoot(document.getElementById("root")).render(
	<StrictMode>
		<GoogleOAuthProvider clientId={GOOGLE_CLIENT_ID}>
			<App />
		</GoogleOAuthProvider>
	</StrictMode>
);
