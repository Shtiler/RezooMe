import React, { useState, FormEvent } from 'react';

const RezooMe: React.FC = () => {
  const [resume, setResume] = useState('');
  const [response, setResponse] = useState('');
  const [advice, setAdvice] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      const res = await fetch('http://13.48.195.213:8000/api/analyze-resume', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        mode: 'cors',
        body: JSON.stringify({ content: resume }), // Changed this line
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.detail || `HTTP error! status: ${res.status}`);
      }

      const data = await res.json();
      setResponse(data.response);
      setAdvice(data.advice);
    } catch (error) {
      console.error('Error:', error);
      setError(`An error occurred: ${error instanceof Error ? error.message : String(error)}`);
      setResponse('');
      setAdvice('');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex justify-center items-center bg-gray-100 p-4">
      <div className="w-full max-w-md">
        <div className="mb-4 border rounded p-4 bg-white shadow-md">
          <h2 className="text-2xl font-bold mb-4 text-center">RezooMe</h2>
          <form onSubmit={handleSubmit}>
            <textarea
              value={resume}
              onChange={(e) => setResume(e.target.value)}
              placeholder="Paste your resume here..."
              className="w-full p-2 mb-4 border rounded"
              rows={10}
            />
            <div className="flex justify-center">
              <button 
                type="submit" 
                disabled={isLoading}
                className="px-6 py-2 bg-blue-500 text-white rounded disabled:bg-gray-400 hover:bg-blue-600 transition-colors"
              >
                {isLoading ? 'Analyzing...' : 'Analyze Resume'}
              </button>
            </div>
          </form>
        </div>
        {error && (
          <div className="mb-4 border rounded p-4 bg-red-100 text-red-700 shadow-md">
            <h2 className="text-xl font-bold mb-2">Error</h2>
            <p>{error}</p>
          </div>
        )}
        {response && (
          <div className="mb-4 border rounded p-4 bg-white shadow-md">
            <h2 className="text-xl font-bold mb-2">Analysis Result</h2>
            <p>{response}</p>
          </div>
        )}
        {advice && (
          <div className="border rounded p-4 bg-white shadow-md">
            <h2 className="text-xl font-bold mb-2">Detailed Advice</h2>
            <textarea
              value={advice}
              readOnly
              className="w-full p-2 border rounded"
              rows={10}
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default RezooMe;
