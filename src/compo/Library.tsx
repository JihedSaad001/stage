import React, { useState, useEffect } from "react";
import { readDir } from "@tauri-apps/api/fs";

interface LibraryProps {
  backendUrl: string;
}

const Library: React.FC<LibraryProps> = ({ backendUrl }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [selectedLanguage, setSelectedLanguage] = useState<string>("en");
  const [files, setFiles] = useState<string[]>([]);
  const [filteredFiles, setFilteredFiles] = useState<string[]>([]);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [isLoading, setIsLoading] = useState(false); // Loading indicator
  const [uploadStatus, setUploadStatus] = useState<string>("");
  const [selectedPdfUrl, setSelectedPdfUrl] = useState<string | null>(null); // State for selected PDF file URL

  useEffect(() => {
    fetchFiles();
  }, []);

  useEffect(() => {
    // Filter files based on search term
    if (searchTerm.trim() === "") {
      setFilteredFiles(files);
    } else {
      const filtered = files.filter((file) =>
        file.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredFiles(filtered);
    }
  }, [searchTerm, files]);

  const fetchFiles = async () => {
    try {
      const response = await fetch(`${backendUrl}/get_files`);
      if (!response.ok) {
        throw new Error("Failed to fetch files");
      }
      const data = await response.json();
      setFiles(data.files);
      setFilteredFiles(data.files);
    } catch (error) {
      console.error("Error fetching files:", error);
    }
  };

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
    formData.append("file", selectedFile);
    formData.append("file_type", selectedFile.type);
    formData.append("language", selectedLanguage);

    try {
      setIsLoading(true); // Set loading state to true during upload

      const response = await fetch(`${backendUrl}/add_file`, {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        throw new Error("Network response was not ok");
      }

      const data = await response.json();
      setUploadStatus(data.status); // Set upload status received from backend

      setSelectedFile(null);
      setSelectedLanguage("en");
      setIsModalOpen(false);
      fetchFiles(); // Refresh the file list
    } catch (error) {
      console.error("There was a problem with the fetch operation:", error);
      setUploadStatus(`File upload failed: ${error.message}`);
    } finally {
      setIsLoading(false); // Reset loading state after upload completes (or fails)
    }
  };

  // Function to handle click on a file name
  const handleFileClick = async (fileName: string) => {
    try {
      setIsLoading(true);
      const response = await fetch(`${backendUrl}/get_pdf/${fileName}`);
      if (!response.ok) {
        throw new Error("Failed to fetch PDF");
      }
      const pdfUrl = await response.text(); // Assuming the backend returns the PDF file URL as text
      setSelectedPdfUrl(pdfUrl);
    } catch (error) {
      console.error("Error fetching PDF:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex w-screen flex-1">
      {/* Sidebar for category filters on the left */}
      <div className="w-64 bg-gray-900 text-white p-4 flex flex-col">
        <h2 className="text-2xl mb-4">Categories</h2>
        <div className="mb-4">
          <input
            type="text"
            placeholder="Search files..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="bg-gray-800 text-white p-2 rounded outline-none w-full"
          />
        </div>
        <button
          className="bg-green-500 hover:bg-green-600 text-white py-2 px-4 rounded mb-4"
          onClick={handleAddDocument}
        >
          + Add Document
        </button>
      </div>
      {/* Main Content */}
      <div className="flex-1 p-4 bg-gray-700">
        <h2 className="text-2xl text-white">Content page</h2>
        <ul className="text-white mt-4">
          {filteredFiles.map((file, index) => (
            <li
              key={index}
              className="hover:underline cursor-pointer"
              onClick={() => handleFileClick(file)}
            >
              {file}
            </li>
          ))}
        </ul>
        {/* Render iframe if a PDF file is selected */}
        {selectedPdfUrl && (
          <div className="mt-4">
            <iframe
              src={selectedPdfUrl}
              title="Selected PDF File"
              className="w-full h-screen border-none"
            ></iframe>
          </div>
        )}
      </div>
      {/* Modal for adding a document */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-gray-800 bg-opacity-75 flex justify-center items-center">
          <div className="bg-white p-8 rounded shadow-lg">
            <h2 className="text-2xl mb-4">Add New Document</h2>
            <input
              type="file"
              accept=".csv,.docx,.pdf,.txt" // Limit file types to CSV, DOCX, PDF
              onChange={handleFileChange}
              className="mb-4"
            />
            <select
              value={selectedLanguage}
              onChange={handleLanguageChange}
              className="bg-gray-200 p-2 rounded"
            >
              <option value="en">English</option>
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
      {/* Loading overlay */}
      {isLoading && (
        <div className="fixed inset-0 bg-gray-800 bg-opacity-75 flex justify-center items-center">
          <div className="bg-white p-8 rounded shadow-lg">
            <h2 className="text-2xl">Loading...</h2>
          </div>
        </div>
      )}
      {/* Status popup */}
      {uploadStatus && (
        <div className="fixed inset-0 bg-gray-800 bg-opacity-75 flex justify-center items-center">
          <div className="bg-white p-8 rounded shadow-lg">
            <h2 className="text-2xl">{uploadStatus}</h2>
            <button
              className="bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded mt-4"
              onClick={() => setUploadStatus("")}
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Library;
