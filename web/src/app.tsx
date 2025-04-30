import { useState, useEffect } from "react";
import { CreateLink } from "./components/create-link";
import { MyLinks } from "./components/my-links";
import { apiGet } from "./lib/api";
import type { Link } from "./types";

export function App() {
  const [links, setLinks] = useState<Link[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    async function fetchLinks() {
      try {
        const data = await apiGet<{ links: Link[] }>("/links");
        if (data && Array.isArray(data.links)) {
          setLinks(data.links);
        } else {
          console.error("Invalid data format received from API", data);
        }
      } catch (error) {
        console.error("Error fetching links", error);
      } finally {
        setLoading(false);
      }
    }
    fetchLinks();
  }, []);

  // Refresh links after a link is created or deleted
  const triggerRefresh = () => {
    setLoading(true); // Set loading true while fetching
    apiGet<{ links: Link[] }>("/links")
      .then((data) => {
        if (data && Array.isArray(data.links)) {
          setLinks(data.links);
        }
      })
      .catch((error) => console.error("Error re-fetching links", error))
      .finally(() => setLoading(false));
  };

  return (
    <main className="min-h-screen bg-gray-100 font-sans p-4 md:p-8 md:flex md:items-center md:justify-center">
      <div className="w-full max-w-6xl flex flex-col items-center gap-4 md:-translate-y-24">
        <img src="/Logo.svg" alt="logo" className="h-8 mb-6" />
        <div className="flex flex-col md:flex-row gap-4 w-full justify-center items-center md:items-start">
          <CreateLink onLinkCreated={triggerRefresh} />
          <MyLinks
            links={links}
            setLinks={setLinks}
            triggerRefresh={triggerRefresh}
          />
        </div>
      </div>
    </main>
  );
}
