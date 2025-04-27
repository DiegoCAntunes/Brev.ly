export const CreateLink = () => {
  return (
    <div className="bg-white p-6 rounded-lg shadow-md max-w-md w-full">
      <h2 className="text-xl font-bold mb-4">Novo link</h2>

      <div className="mb-4">
        <label className="block text-xs text-gray-700 mb-1.5">
          LINK ORIGINAL
        </label>
        <div className="flex items-center">
          <input
            type="text"
            placeholder="www.exemplo.com.br"
            className="flex-1 p-2 border border-gray-300 rounded-md text-sm"
          />
        </div>
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
          />
        </div>
      </div>

      <button className="w-full bg-blue-base text-white py-2 rounded-md hover:bg-blue-dark">
        Salvar link
      </button>
    </div>
  );
};
