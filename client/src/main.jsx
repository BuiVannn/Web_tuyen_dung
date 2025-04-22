// filepath: d:\Job_portal_website\client\src\main.jsx
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.jsx';
import './index.css';
import { BrowserRouter } from 'react-router-dom';
import { AppContextProvider } from './context/AppContext.jsx'; // Import provider
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Slide } from "react-toastify";

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <AppContextProvider> {/* Bọc toàn bộ ứng dụng */}
        <App />
        <ToastContainer
          position="top-right"
          autoClose={3000}
          hideProgressBar={false}
          newestOnTop={true}
          closeOnClick={true}
          rtl={false}
          pauseOnFocusLoss={false} // Đặt false để tránh toast không đóng khi focus vào trường khác
          draggable={true}
          pauseOnHover={true}
          theme="light"
          transition={Slide} // Sử dụng Slide transition
          limit={3} // Giới hạn số lượng toast
        />
      </AppContextProvider>
    </BrowserRouter>
  </React.StrictMode>,
);

// import React from 'react'
// import ReactDOM from 'react-dom/client'
// import { BrowserRouter } from 'react-router-dom'
// import App from './App.jsx'
// import { AppContextProvider } from './context/AppContext';
// import './index.css'

// ReactDOM.createRoot(document.getElementById('root')).render(
//   <React.StrictMode>
//     <BrowserRouter>
//       <App />
//     </BrowserRouter>
//   </React.StrictMode>
// )

// import { StrictMode } from 'react'
// import { createRoot } from 'react-dom/client'
// import './index.css'
// import App from './App.jsx'
// import { BrowserRouter } from 'react-router-dom'
// import { AppContextProvider } from './context/AppContext.jsx'
// import { ClerkProvider } from '@clerk/clerk-react'


// // Import your Publishable Key
// const PUBLISHABLE_KEY = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY

// if (!PUBLISHABLE_KEY) {
//   throw new Error("Missing Publishable Key")
// }

// createRoot(document.getElementById('root')).render(
//   <ClerkProvider publishableKey={PUBLISHABLE_KEY} afterSignOutUrl="/">
//     <BrowserRouter>
//       <AppContextProvider>
//         <App />
//       </AppContextProvider>
//     </BrowserRouter>
//   </ClerkProvider>,
// )
