"use client";

import { useState } from "react";
import Image from "next/image";

export default function Home() {
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  
  // Function to handle API testing
  const testAPI = async () => {
    setLoading(true);
    try {
      // Make a request to the external test site
      const response = await fetch("https://json-extraction-challenge.intellixio.com/api/generate-test-image");
      const data = await response.json();
      
      if (data.imageBase64) {
        // Send the image to our API endpoint
        const extractResponse = await fetch("/api/extract", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ imageBase64: data.imageBase64 }),
        });
        
        const extractResult = await extractResponse.json();
        setResult(extractResult);
      }
    } catch (error) {
      console.error("Error testing API:", error);
      setResult({ success: false, message: `Error: ${error.message}` });
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <div className="grid grid-rows-[auto_1fr_auto] min-h-screen p-8">
      <header className="mb-8">
        <h1 className="text-2xl font-bold mb-2">JSON Extraction API</h1>
        <p className="text-gray-600">Extract JSON data from base64-encoded images</p>
      </header>
      
      <main className="flex flex-col gap-6">
        <div className="flex flex-col gap-4">
          <button
            onClick={testAPI}
            disabled={loading}
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 disabled:bg-blue-300 w-fit"
          >
            {loading ? "Processing..." : "Test API with Random Image"}
          </button>
          
          {result && (
            <div className="mt-4 p-4 border rounded">
              <h2 className="text-xl font-semibold mb-2">Result:</h2>
              <pre className="bg-gray-100 p-4 rounded overflow-auto max-w-full">
                {JSON.stringify(result, null, 2)}
              </pre>
            </div>
          )}
        </div>
        
        <div className="mt-8">
          <h2 className="text-xl font-semibold mb-2">API Information</h2>
          <div className="bg-gray-100 p-4 rounded">
            <p className="mb-2"><strong>Endpoint:</strong> POST /api/extract</p>
            <p className="mb-2"><strong>Request Format:</strong></p>
            <pre className="bg-gray-200 p-2 rounded">
              {JSON.stringify({ imageBase64: "data:image/png;base64,..." }, null, 2)}
            </pre>
          </div>
        </div>
      </main>
      
      <footer className="mt-8 text-center text-gray-500 text-sm">
        JSON Extraction API - Test your API at{" "}
        <a
          className="text-blue-600 hover:underline"
          href="https://json-extraction-challenge.intellixio.com/"
          target="_blank"
          rel="noopener noreferrer"
        >
          json-extraction-challenge.intellixio.com
        </a>
      </footer>
    </div>
  );
}