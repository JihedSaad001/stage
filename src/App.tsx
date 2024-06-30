// App.tsx
import { Routes, Route } from "react-router-dom";
import SideBar from "./compo/SideBar";
import Library from "./compo/Library";
import ChatBot from "./compo/ChatBot";
import Welcome from "./compo/Welcome";

const backendUrl = "http://192.168.1.107:8000";

function App() {
  return (
    <div className="flex flex-col min-h-screen">
      <SideBar />
      <Routes>
        <Route path="/" element={<Welcome />} />
        <Route path="/compo/library" element={<Library backendUrl={backendUrl} />} />
        <Route
          path="/compo/chatbot"
          element={<ChatBot backendUrl={backendUrl} />}
        />
      </Routes>
    </div>
  );
}

export default App;
