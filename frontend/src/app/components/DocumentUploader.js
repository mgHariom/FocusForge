import { useState } from "react";

export default function DocumentUploader({ onUpload }) {
  const [file, setFile] = useState(null);
  const [query, setQuery] = useState("");
  const [searchResults, setSearchResults] = useState(null);

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);

    handleUpload(e.target.files[0]);
  };

  const handleUpload = async (selectedFile) => {
    const fileToUpload = selectedFile || file;
    if (!fileToUpload) return;

    const formData = new FormData();
    formData.append("document", fileToUpload);

    const res = await fetch("/api/v0/documents/upload", {
      method: "POST",
      body: formData,
    });

    const data = await res.json();
    if (onUpload && typeof onUpload === "function") {
      onUpload(data.summary);
    }
  };

  // New: handle search
  const handleSearch = async () => {
    if (!query) return;
    const res = await fetch("/api/v0/summary/search-summary", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ query }),
    });
    const data = await res.json();
    setSearchResults(data.summary); // Assuming data.summary is an array
  };

  return (
    <div className=" space-y-4 p-4 bg-gray-800 rounded shadow-md w-full max-w-md">
      {/* Search results section */}
      <div className="bg-gray-700 rounded p-3 min-h-[40px] text-white">
        {searchResults ? (
          <pre className="whitespace-pre-wrap break-words">
            {JSON.stringify(searchResults, null, 2)}
          </pre>
        ) : (
          "No search results yet."
        )}
      </div>

      {/* Search input and button */}
      <div className="flex space-x-2 items-center">
        {/* File upload button and file name */}
        <div>
          <label className="inline-flex items-center cursor-pointer bg-blue-700 hover:bg-blue-800 text-white px-3 py-2 rounded-full transition">
            <svg
              className="w-5 h-5 mr-1"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M12 4v16m8-8H4"
              />
            </svg>
            <span className="text-sm">Upload</span>
            <input type="file" onChange={handleFileChange} className="hidden" />
          </label>
          {file && (
            <span className="ml-2 text-xs text-gray-300 truncate max-w-[140px] block">
              {file.name}
            </span>
          )}
        </div>
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Enter search query"
          className="flex-1 px-3 py-2 rounded border focus:outline-none text-black"
        />
        <button
          className="bg-blue-700 text-white px-4 py-2 rounded hover:bg-blue-800"
          onClick={handleSearch}
        >
          Search
        </button>
      </div>
    </div>
  );
}
