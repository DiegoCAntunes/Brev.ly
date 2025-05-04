import { useEffect, useRef } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { apiGet } from "../lib/api";

interface Props {
  showAlert: (message: string, severity?: "success" | "error") => void;
}

export function RedirectPage({ showAlert }: Props) {
  const { shortUrl } = useParams<{ shortUrl: string }>();
  const navigate = useNavigate();
  const didRedirect = useRef(false);

  useEffect(() => {
    if (didRedirect.current) return;

    didRedirect.current = true;

    async function fetchAndRedirect() {
      try {
        const data = await apiGet<{ originalUrl: string }>(
          `/links/${shortUrl}`
        );
        if (data?.originalUrl) {
          window.location.href = data.originalUrl;
        } else {
          showAlert("Short URL not found", "error");
          navigate("/redirect/not-found");
        }
      } catch {
        showAlert("Failed to fetch original URL", "error");
        navigate("/redirect/not-found", { replace: true });
      }
    }

    fetchAndRedirect();
  }, [shortUrl]);

  return (
    <main className="min-h-screen bg-gray-200 flex items-center justify-center">
      <div className="bg-gray-100 p-6 py-12 rounded-lg shadow-md max-w-md w-full text-center flex flex-col items-center gap-4">
        <img src="/Logo_Icon.svg" alt="logo" className="h-12 mx-auto" />
        <h1 className="text-xl font-bold ">Redirecionando...</h1>
        <p className="text-gray-600">
          O link será aberto automaticamente em alguns instantes.
          <br />
          Não foi redirecionado? Acesse{" "}
          <a href="#" className="text-blue-600 underline">
            aqui
          </a>
          .
        </p>
      </div>
    </main>
  );
}
