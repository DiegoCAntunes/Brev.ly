import { useEffect, useState } from "react";
//import { apiGet } from "@/lib/api";

interface Link {
  id: string;
  originalUrl: string;
  shortUrl: string;
}

export function LinkList() {
  const [links, setLinks] = useState<Link[]>([]);

  // useEffect(() => {
  //   async function fetchLinks() {
  //     try {
  //       const data = await apiGet<{ links: Link[] }>("/links");
  //       setLinks(data.links);
  //     } catch (error) {
  //       console.error("Error:", error);
  //     }
  //   }
  //   fetchLinks();
  // }, []);

  return (
    <section className="container mx-auto mt-10 px-4 font-sans">
      <h3 className="text-2xl font-bold mb-6 text-center text-text">
        Links Encurtados
      </h3>
      <div className="flex flex-col gap-4 items-center">
        {links.map((link) => (
          <div
            key={link.id}
            className="flex flex-col sm:flex-row items-center gap-4 border border-border p-4 rounded-lg w-full max-w-2xl"
          >
            <span className="text-primary break-all">{link.shortUrl}</span>
            <button
              onClick={() => navigator.clipboard.writeText(link.shortUrl)}
              className="bg-primary text-white px-4 py-2 rounded-lg hover:bg-primary-dark transition font-semibold"
            >
              Copiar
            </button>
          </div>
        ))}
      </div>
    </section>
  );
}
