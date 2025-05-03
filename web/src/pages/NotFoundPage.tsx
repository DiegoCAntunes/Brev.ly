export function NotFoundPage() {
  return (
    <main className="min-h-screen bg-gray-200 flex items-center justify-center">
      <div className="bg-gray-100 p-12 rounded-lg shadow-md max-w-md w-full text-center flex flex-col items-center gap-4">
        <img src="/404.svg" alt="not found" className="h-24 mx-auto" />
        <h1 className="text-xl font-bold "> Link não encontrado</h1>
        <p className="text-gray-600">
          O link que você está tentando acessar não existe, foi removido ou é
          uma URL inválida. Saiba mais em brev.ly.{" "}
          <a href="#" className="text-blue-600 underline">
            aqui
          </a>
          .
        </p>
      </div>
    </main>
  );
}
