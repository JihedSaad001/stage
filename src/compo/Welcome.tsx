import React from "react";

const Welcome: React.FC = () => {
  return (
    <div className="flex-1 bg-gray-700 p-4 flex flex-col items-center justify-center h-full">
      <h2 className="text-2xl text-white mb-4">Hello User :D </h2>
      <p className="text-white text-lg">
        This is the welcome page. Use the NavBar to navigate through the app.
      </p>
    </div>
  );
};

export default Welcome;
