import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css'; 
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import App from './App.jsx';
import '../public/css/sb-admin-2.min.css'; 
import 'bootstrap/dist/css/bootstrap.min.css'; 
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";


const queryClient = new QueryClient();

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <App />
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
      />
    </QueryClientProvider>
  </StrictMode>
);