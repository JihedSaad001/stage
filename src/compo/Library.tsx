import React, { useState, useEffect } from "react";

// Mock backend functions
const mockBackend = {
  files: [], // No initial mock files
  async uploadFile(file, language) {
    // Simulate a network request
    return new Promise((resolve) => {
      setTimeout(() => {
        this.files.push({
          name: file.name,
          type: file.type,
          language,
          content: URL.createObjectURL(file),
        });
        resolve({ status: "success" });
      }, 1000);
    });
  },
  async getFiles() {
    // Simulate fetching files from a server
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(this.files);
      }, 1000);
    });
  },
};

const Library: React.FC = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [selectedLanguage, setSelectedLanguage] = useState<string>("eng");
  const [files, setFiles] = useState<
    { name: string; type: string; language: string; content: string }[]
  >([]);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [selectedFileToView, setSelectedFileToView] = useState<string | null>(
    null
  );
  const [selectedFileName, setSelectedFileName] = useState<string | null>(null);
  const [iframeWidth, setIframeWidth] = useState<string>("100%");
  const [iframeHeight, setIframeHeight] = useState<string>("700px");

  useEffect(() => {
    // Fetch files on mount
    mockBackend.getFiles().then(setFiles);
  }, []);

  const handleAddDocument = () => {
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedFile(null);
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

    try {
      // Prevent multiple uploads by disabling the button during upload
      setIsModalOpen(false); // Close modal to prevent re-triggering
      const response = await mockBackend.uploadFile(
        selectedFile,
        selectedLanguage
      );

      if (response.status === "success") {
        // Update state with the newly uploaded file
        setFiles([
          ...files,
          {
            name: selectedFile.name,
            type: selectedFile.type,
            language: selectedLanguage,
            content: URL.createObjectURL(selectedFile),
          },
        ]);

        // Reset selectedFile state to prevent multiple uploads
        setSelectedFile(null);
        setSelectedLanguage("eng"); // Reset language selection if needed
      }
    } catch (error) {
      console.error("Upload failed:", error);
    }
  };

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
  };

  const filteredFiles = files.filter((file) =>
    file.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleFileClick = (file: { name: string; content: string }) => {
    setSelectedFileToView(file.content);
    setSelectedFileName(file.name); // Track the selected file name
  };

  const handleCloseFileView = () => {
    setSelectedFileToView(null); // Close the file viewer
    setSelectedFileName(null); // Reset selected file name
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
        <input
          type="text"
          placeholder="Search..."
          value={searchTerm}
          onChange={handleSearchChange}
          className="mb-4 p-2 rounded"
        />
      </div>
      {/* Main Content */}
      <div className="flex-1 p-4 bg-gray-700">
        <h2 className="text-2xl text-white">Files</h2>
        <ul className="text-white">
          {filteredFiles.map((file, index) => (
            <li
              key={index}
              className="mb-2 cursor-pointer"
              onClick={() => handleFileClick(file)}
            >
              {file.name}
              {selectedFileName === file.name && (
                <div className="bg-gray-900 p-4 mt-4 rounded shadow-lg">
                  <iframe
                    src={selectedFileToView}
                    width={iframeWidth}
                    height={iframeHeight}
                    title="File Viewer"
                  ></iframe>
                  <div className="flex justify-between mt-2">
                    <button
                      className="bg-red-500 hover:bg-red-600 text-white py-2 px-4 rounded"
                      onClick={handleCloseFileView} // Close button handler
                    >
                      Close
                    </button>
                    <div>
                      <label className="mr-2 text-gray-500 font-bold text-lg">
                        Width:
                        <input
                          type="text"
                          value={iframeWidth}
                          onChange={(e) => setIframeWidth(e.target.value)}
                          className="ml-1 p-1 rounded"
                        />
                      </label>
                      <label className="text-gray-500 font-bold text-lg">
                        Height:
                        <input
                          type="text"
                          value={iframeHeight}
                          onChange={(e) => setIframeHeight(e.target.value)}
                          className="ml-1 p-1 rounded"
                        />
                      </label>
                    </div>
                  </div>
                </div>
              )}
            </li>
          ))}
        </ul>
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
