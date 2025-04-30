import { useState } from "react";
import { apiPost } from "../lib/api"; // Adjust the import based on your file structure
import type { Link } from "../types";

export const CreateLink = ({
  onLinkCreated,
}: {
  onLinkCreated?: (link: Link) => void;
}) => {
  const [originalUrl, setOriginalUrl] = useState("");
  const [shortenedUrl, setShortenedUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showUrlError, setShowUrlError] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null); // Reset any previous error
    if (
      !originalUrl.startsWith("http://") &&
      !originalUrl.startsWith("https://")
    ) {
      setShowUrlError(true);
      return;
    }
    setShowUrlError(false);
    setLoading(true);

    try {
      const response = await apiPost("/links", { originalUrl, shortenedUrl });
      // Handle successful link creation, e.g., display a success message or reset form
      console.log("Link created:", response);
      // Optionally reset the form after successful creation
      setOriginalUrl("");
      setShortenedUrl("");
      if (onLinkCreated) {
        onLinkCreated(response as Link); // Cast response to Link type
      }
    } catch (error: any) {
      const errorBody = error?.body;
      const message =
        errorBody?.issues?.[0]?.message ||
        errorBody?.message ||
        "Failed to create link. Please try again.";
      setError(message);
      console.error("Error creating link:", errorBody);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md max-w-md w-full">
      <h2 className="text-xl font-bold mb-4">Novo link</h2>

      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label className="block text-xs text-gray-700 mb-1.5">
            LINK ORIGINAL
          </label>
          <div className="flex items-center">
            <input
              type="text"
              placeholder="https://www.exemplo.com.br"
              className="flex-1 p-2 border border-gray-300 rounded-md text-sm"
              value={originalUrl}
              onChange={(e) => setOriginalUrl(e.target.value)}
            />
          </div>
          {showUrlError && (
            <p className="text-xs text-red-500 mt-1">Coloque http ou https</p>
          )}
        </div>

        <div className="mb-4">
          <label className="block text-xs text-gray-700 mb-1.5">
            LINK ENCURTADO
          </label>
          <div className="flex items-center">
            <input
              type="text"
              placeholder="brev.ly/"
              className="flex-1 p-2 border border-gray-300 rounded-md text-sm"
              value={shortenedUrl}
              onChange={(e) => setShortenedUrl(e.target.value)}
            />
          </div>
        </div>

        {error && <p className="text-red-500 text-xs mb-4">{error}</p>}

        <button
          type="submit"
          className="w-full bg-blue-base text-white py-2 rounded-md hover:bg-blue-dark"
          disabled={loading}
        >
          {loading ? "Salvando..." : "Salvar link"}
        </button>
      </form>
    </div>
  );
};
