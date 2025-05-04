import { CreateLink } from "../components/create-link";
import { MyLinks } from "../components/my-links";
import type { Link } from "../types";

interface Props {
  links: Link[];
  triggerRefresh: () => void;
  showAlert: (message: string, severity?: "success" | "error") => void;
}

export function MainPage({ links, triggerRefresh, showAlert }: Props) {
  return (
    <main className="min-h-screen bg-gray-100 font-sans p-4 md:p-8 md:flex md:items-center md:justify-center">
      <div className="w-full max-w-6xl flex flex-col items-center gap-4 md:-translate-y-24">
        <img src="/Logo.svg" alt="logo" className="h-8 mb-6" />
        <div className="flex flex-col md:flex-row gap-4 w-full justify-center items-center md:items-start">
          <CreateLink onLinkCreated={triggerRefresh} showAlert={showAlert} />
          <MyLinks
            links={links}
            triggerRefresh={triggerRefresh}
            showAlert={showAlert}
          />
        </div>
      </div>
    </main>
  );
}
