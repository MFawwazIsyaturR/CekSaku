import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { NuqsAdapter } from "nuqs/adapters/react";
import "./index.css";
import App from "./App.tsx";
import { Toaster } from "sonner";
import { Provider } from "react-redux";
import { store } from "./app/store.ts";
import { persistor } from "./app/store.ts";
import { PersistGate } from "redux-persist/integration/react";
import { GoogleOAuthProvider } from "@react-oauth/google";

// Pastikan Anda telah mengatur VITE_GOOGLE_CLIENT_ID di file .env Anda
const GOOGLE_CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID;

if (!GOOGLE_CLIENT_ID) {
  // Pesan ini akan muncul jika Anda lupa menambahkan Client ID ke file .env
  console.error("VITE_GOOGLE_CLIENT_ID is not defined in your .env file");
}

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <GoogleOAuthProvider clientId={GOOGLE_CLIENT_ID || ""}>
      <Provider store={store}>
        <PersistGate loading={null} persistor={persistor}>
          <NuqsAdapter>
            <App />
          </NuqsAdapter>
          <Toaster
            position="top-center"
            expand={true}
            duration={5000}
            richColors
            closeButton
          />
        </PersistGate>
      </Provider>
    </GoogleOAuthProvider>
  </StrictMode>
);

