// App.tsx
import SideBar from "./compo/SideBar";
import Library from "./compo/Library";

import ChatBot from "./compo/ChatBot";
import Welcome from "./compo/Welcome";
import { Routes, Route } from "react-router-dom";

function App() {
  return (
    <div className="flex flex-col min-h-screen">
      <SideBar />
      <Routes>
        <Route path="/" element={<Welcome />} />
        <Route path="/compo/library" element={<Library />} />
        <Route path="/compo/chatbot" element={<ChatBot />} />
      </Routes>
    </div>
  );
}

export default App;
