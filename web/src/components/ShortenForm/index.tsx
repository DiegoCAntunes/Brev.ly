import { useState } from "react";
//import { apiPost } from "@/lib/api";

export function ShortenForm() {
  const [url, setUrl] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  // async function handleShortenUrl(e: React.FormEvent) {
  //   e.preventDefault();
  //   if (!url) return;

  //   try {
  //     setIsLoading(true);
  //     await apiPost("/links", { originalUrl: url });
  //     setUrl("");
  //   } catch (error) {
  //     console.error("Error:", error);
  //   } finally {
  //     setIsLoading(false);
  //   }
  // }

  return (
    <form
      //onSubmit={}
      className="flex flex-col items-center gap-4 mt-8 font-sans"
    >
      <input
        type="url"
        placeholder="Cole seu link aqui..."
        className="w-full max-w-lg p-3 border border-border rounded-lg"
        value={url}
        onChange={(e) => setUrl(e.target.value)}
        required
      />
      <button
        type="submit"
        className="bg-primary text-white px-6 py-3 rounded-lg hover:bg-primary-dark transition font-semibold"
        disabled={isLoading}
      >
        {isLoading ? "Encurtando..." : "Encurtar Link"}
      </button>
    </form>
  );
}
