import { Button } from "./button";
import { Link as LinkIcon } from "lucide-react";
import type { Link } from "../types";
import { apiDelete } from "../lib/api";

export const MyLinks = ({
  links,
  triggerRefresh,
  showAlert,
}: {
  links: Link[];
  triggerRefresh: () => void;
  showAlert: (message: string, severity?: "success" | "error") => void;
}) => {
  const handleDelete = async (id: string) => {
    if (!id) return;
    try {
      await apiDelete(`/links/${id}`);
      triggerRefresh();
      showAlert("Link deletado com sucesso", "success");
    } catch (error) {
      console.error("Failed to delete link", error);
      showAlert("Erro ao deletar o link", "error");
    }
  };

  const handleLinkClick = (shortenedUrl: string) => {
    const url = `${window.location.origin}/${shortenedUrl}`;
    window.open(url, "_blank");
  };

  const handleCopy = async (originalUrl: string) => {
    try {
      await navigator.clipboard.writeText(originalUrl);
      showAlert("Link copiado para a área de transferência", "success");
    } catch (err) {
      console.error("Failed to copy link", err);
      showAlert("Erro ao copiar o link", "error");
    }
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md max-w-md w-full">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-bold">Meus links</h2>
        <Button icon="download" label="Baixar CSV" />
      </div>

      <div className="border-t border-gray-200 my-4" />

      {links.length === 0 ? (
        <div className="flex flex-col items-center justify-center h-24 gap-3">
          <LinkIcon className="w-8 h-8 text-gray-400" />
          <p className="text-gray-500 text-sm">
            Ainda não existem links cadastrados
          </p>
        </div>
      ) : (
        <div className="flex flex-col gap-4">
          {links.map(({ id, shortenedUrl, originalUrl, accessCount }) => (
            <div
              key={id}
              className="flex items-center justify-between bg-gray-50 p-3 rounded-md"
            >
              <div className="flex flex-col">
                <span
                  onClick={() => handleLinkClick(shortenedUrl)}
                  className="text-blue-700 font-medium hover:underline cursor-pointer"
                >
                  {shortenedUrl}
                </span>
                <p className="text-sm text-gray-500 truncate max-w-xs">
                  {originalUrl}
                </p>
              </div>
              <div className="flex items-center gap-4">
                <span className="text-sm text-gray-600">
                  {accessCount} acessos
                </span>
                <Button
                  icon="copy"
                  label={""}
                  onClick={() => handleCopy(originalUrl)}
                />
                <Button icon="trash" onClick={() => handleDelete(id)} />
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
