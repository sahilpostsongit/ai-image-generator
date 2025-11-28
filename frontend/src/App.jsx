import React, { useState } from "react";

function App() {
  const [prompt, setPrompt] = useState("");
  const [loading, setLoading] = useState(false);
  const [images, setImages] = useState([]);

  const generateImage = async () => {
    if (!prompt.trim()) {
      alert("Enter a prompt!");
      return;
    }

    setLoading(true);

    try {
      const res = await fetch("http://127.0.0.1:5000/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt }),
      });

      const data = await res.json();

      if (data.error) {
        alert("Error: " + data.error);
      } else {
        setImages(data.images);
      }
    } catch (err) {
      alert("Network Error: " + err.message);
    }

    setLoading(false);
  };

  return (
    <div className="glass-card">
      <h1 className="text-4xl font-bold text-center mb-6">
        AI Image Generator
      </h1>

      <input
        type="text"
        className="text-input"
        placeholder="Enter your prompt..."
        value={prompt}
        onChange={(e) => setPrompt(e.target.value)}
      />

      <button className="primary-btn" onClick={generateImage}>
        {loading ? "Generating..." : "Generate Image"}
      </button>

      {/* OUTPUT */}
      <div className="mt-6 flex flex-col items-center">
        {images.length === 0 && (
          <p className="text-gray-600">No images yet. Generate one!</p>
        )}

        {images.map((img, i) => (
          <img
            key={i}
            src={img}
            alt="Generated"
            className="mt-4 rounded-xl shadow-lg max-w-full"
          />
        ))}
      </div>
    </div>
  );
}

export default App;
