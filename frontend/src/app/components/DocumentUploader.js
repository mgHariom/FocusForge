import { useState } from "react";

export default function DocumentUploader({ onUpload }) {
  const [file, setFile] = useState(null);

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleUpload = async () => {
    if (!file) return;

    const formData = new FormData();
    formData.append("document", file);

    const res = await fetch("/api/v0/documents/upload", {
      method: "POST",
      body: formData,
    });

    const data = await res.json();
    if (onUpload && typeof onUpload === "function") {
      onUpload(data.summary); 
    }
  };

  return (
    <div className="space-y-4 p-4 bg-gray-800 rounded shadow-md w-full max-w-md">
      <input type="file" onChange={handleFileChange} />
      <button
        className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        onClick={handleUpload}
      >
        Upload & Summarize
      </button>
    </div>
  );
}
