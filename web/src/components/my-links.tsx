import { Button } from "./button";
import { Link as LinkIcon } from "lucide-react";
import type { Link } from "../types";
import { apiDelete } from "../lib/api";

export const MyLinks = ({
  links,
  setLinks,
  triggerRefresh,
}: {
  links: Link[];
  setLinks: React.Dispatch<React.SetStateAction<Link[]>>;
  triggerRefresh: () => void;
}) => {
  const handleDelete = async (id: string) => {
    try {
      await apiDelete(`/links/${id}`);
      triggerRefresh();
    } catch (error) {
      console.error("Failed to delete link", error);
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
          {links.map((link) => (
            <div
              key={link.id}
              className="flex items-center justify-between bg-gray-50 p-3 rounded-md"
            >
              <div className="flex flex-col">
                <a
                  href={link.shortenedUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-700 font-medium hover:underline"
                >
                  {link.shortenedUrl}
                </a>
                <p className="text-sm text-gray-500 truncate max-w-xs">
                  {link.originalUrl}
                </p>
              </div>
              <div className="flex items-center gap-4">
                <span className="text-sm text-gray-600">
                  {link.accessCount} acessos
                </span>
                <Button icon="copy" label={""} />
                <Button icon="trash" onClick={() => handleDelete(link.id)} />
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
