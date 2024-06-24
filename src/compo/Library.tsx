import React, { useState, useEffect } from "react";

const Library: React.FC = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [selectedLanguage, setSelectedLanguage] = useState<string>("eng");
  const [backendUrl, setBackendUrl] = useState<string>("");

  useEffect(() => {
    // Load configuration file or set backend URL
    fetch("/config.json")
      .then((response) => response.json())
      .then((data) => setBackendUrl(data.backendUrl))
      .catch((error) => console.error("Error loading config:", error));
  }, []);

  const handleAddDocument = () => {
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedFile(null); // Reset selected file when modal closes
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setSelectedFile(file);
    }
  };

  const handleLanguageChange = (
    event: React.ChangeEvent<HTMLSelectElement>
  ) => {
    setSelectedLanguage(event.target.value);
  };

  const handleUpload = async () => {
    if (!selectedFile) {
      console.error("No file selected");
      return;
    }

    const formData = new FormData();
    formData.append("file_type", selectedFile.type); // File type
    console.log(selectedFile.type);
    formData.append("language", selectedLanguage); // Language
    console.log(selectedLanguage);
    formData.append("file", selectedFile); // File object

    console.log(formData);

    try {
      const response = await fetch(`${backendUrl}/add_file`, {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        throw new Error("Network response was not ok");
      }

      const data = await response.json();
      console.log("File upload status:", data.status);

      // Reset state and close modal after successful upload
      setSelectedFile(null);
      setSelectedLanguage("eng");
      setIsModalOpen(false);
    } catch (error) {
      console.error("There was a problem with the fetch operation:", error);
      // Handle error state as needed
    }
  };

  return (
    <div className="flex w-screen flex-1">
      {/* Sidebar for category filters on the left */}
      <div className="w-64 bg-gray-900 text-white p-4 flex flex-col">
        <h2 className="text-2xl mb-4">Categories</h2>
        <button
          className="bg-green-500 hover:bg-green-600 text-white py-2 px-4 rounded mb-4"
          onClick={handleAddDocument}
        >
          + Add Document
        </button>
        <ul className="flex flex-col gap-2">
          {[
            "Category 1",
            "Category 2",
            "Category 3",
            "Category 4",
            "Category 5",
          ].map((category, index) => (
            <li key={index} className="group relative">
              <div className="hover:bg-green-500 hover:text-white p-2 rounded cursor-pointer relative">
                {category}
                <ul className="absolute left-full top-0 mt-2 ml-0.5 bg-gray-700 rounded shadow-lg w-48 hidden group-hover:block">
                  <li className="hover:bg-gray-600 p-2 rounded">Option 1</li>
                  <li className="hover:bg-gray-600 p-2 rounded">Option 2</li>
                  <li className="hover:bg-gray-600 p-2 rounded">Option 3</li>
                </ul>
              </div>
            </li>
          ))}
        </ul>
      </div>
      {/* Main Content */}
      <div className="flex-1 p-4 bg-gray-700">
        <h2 className="text-2xl text-white">Content page</h2>
        <p className="text-white">This is the content page</p>
      </div>
      {/* Modal for adding a document */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-gray-800 bg-opacity-75 flex justify-center items-center">
          <div className="bg-white p-8 rounded shadow-lg">
            <h2 className="text-2xl mb-4">Add New Document</h2>
            <input
              type="file"
              accept=".csv,.docx,.pdf" // Limit file types to CSV, DOCX, PDF
              onChange={handleFileChange}
              className="mb-4"
            />
            <select
              value={selectedLanguage}
              onChange={handleLanguageChange}
              className="bg-gray-200 p-2 rounded"
            >
              <option value="eng">English</option>
              <option value="arabic">Arabic</option>
            </select>
            <div className="flex justify-end mt-4">
              <button
                className="bg-red-500 hover:bg-red-600 text-white py-2 px-4 rounded mr-2"
                onClick={handleCloseModal}
              >
                Cancel
              </button>
              <button
                className="bg-green-500 hover:bg-green-600 text-white py-2 px-4 rounded"
                onClick={handleUpload}
                disabled={!selectedFile} // Disable upload button if no file selected
              >
                Upload
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Library;