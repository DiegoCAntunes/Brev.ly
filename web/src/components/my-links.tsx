import { Button } from "./button";
import { Link } from "lucide-react";

export const MyLinks = () => {
  return (
    <div className="bg-white p-6 rounded-lg shadow-md max-w-md w-full">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold">Meus links</h2>
        <Button icon="download" label="Baixar CSV" />
      </div>

      <div className="border-t border-gray-200 my-4"></div>

      <div className="flex flex-col items-center justify-center h-24 gap-3">
        <Link className="w-8 h-8 text-gray-400" />
        <p className="text-gray-500 text-sm">
          Ainda não existem links cadastrados
        </p>
      </div>
    </div>
  );
};
