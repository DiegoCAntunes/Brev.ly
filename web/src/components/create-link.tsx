import { useState } from "react";
import { apiPost } from "../lib/api"; // Adjust the import based on your file structure
import type { Link } from "../types";
import { TriangleAlert } from "lucide-react";

export const CreateLink = ({
  onLinkCreated,
  showAlert,
}: {
  onLinkCreated?: (link: Link) => void;
  showAlert: (message: string, severity?: "success" | "error") => void;
}) => {
  const [originalUrl, setOriginalUrl] = useState("");
  const [shortenedUrl, setShortenedUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    const urlPattern =
      /^(?:https?:\/\/)?[\w-]+(\.[\w-]+)+[\w\-._~:/?#[\]@!$&'()*+,;=.]+$/;
    if (!urlPattern.test(originalUrl)) {
      setError("invalid-url");
      setLoading(false);
      return;
    }

    const shortUrlPattern = /^[a-z0-9-]+$/;
    if (!shortUrlPattern.test(shortenedUrl)) {
      setError("invalid-shorturl");
      setLoading(false);
      return;
    }

    const urlLink = "https://" + originalUrl;

    try {
      const response = await apiPost("/links", {
        originalUrl: urlLink,
        shortenedUrl,
      });
      console.log("Link created:", response);
      setOriginalUrl("");
      setShortenedUrl("");
      if (onLinkCreated) {
        onLinkCreated(response as Link);
      }
      showAlert("Link criado com sucesso!", "success");
    } catch (error: any) {
      const errorBody = error?.body;
      const message =
        errorBody?.issues?.[0]?.message ||
        errorBody?.message ||
        "Failed to create link. Please try again.";
      setError(message);
      showAlert(message, "error");
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
              placeholder="www.exemplo.com.br"
              className="flex-1 p-2 border border-gray-300 rounded-md text-sm"
              value={originalUrl}
              onChange={(e) => {
                setOriginalUrl(e.target.value);
                if (error === "invalid-url") {
                  setError(null); // Clear error when input changes
                }
              }}
            />
          </div>
          {error === "invalid-url" && (
            <div className="flex items-center text-xs mt-1 text-gray-500">
              <TriangleAlert className="w-3 h-3 mr-1 text-red-500" />
              Link inválido
            </div>
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
              onChange={(e) => {
                setShortenedUrl(e.target.value);
                if (error === "invalid-shorturl") {
                  setError(null); // Clear error when input changes
                }
              }}
            />
          </div>
          {error === "invalid-shorturl" && (
            <div className="flex items-center text-xs mt-1 text-gray-500">
              <TriangleAlert className="w-3 h-3 mr-1 text-red-500" />
              Informe url minúscula e sem espaço/caracteres especiais
            </div>
          )}
        </div>

        {error && error !== "invalid-url" && error !== "invalid-shorturl" && (
          <p className="text-red-500 text-xs mb-4">{error}</p>
        )}

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
