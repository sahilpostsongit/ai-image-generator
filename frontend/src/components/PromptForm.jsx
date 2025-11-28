<form className="mb-6 space-y-4" onSubmit={handleSubmit}>
  <label className="block text-gray-700 font-medium">Enter your prompt</label>

  <textarea
  value={prompt}
  onChange={(e) => setPrompt(e.target.value)}
  className="w-full p-4 bg-white/90 text-gray-900 rounded-xl shadow-lg border border-gray-300 placeholder-gray-500 focus:ring-2 focus:ring-indigo-400 focus:border-indigo-400"
  rows={3}
/>

  <button type="submit" className="primary-btn w-full text-center">
    {loading ? "Generating..." : "Generate Image"}
  </button>
</form>
