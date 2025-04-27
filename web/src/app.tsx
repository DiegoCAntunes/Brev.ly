import { CreateLink } from "./components/create-link";
import { MyLinks } from "./components/my-links";

export function App() {
  return (
    <main className="min-h-screen bg-gray-100 font-sans p-4 md:p-8">
      <div className="max-w-6xl mx-auto gap-4 flex flex-col justify-center items-center">
        <img src="/Logo.svg" alt="logo" className="h-8"></img>

        <div className="flex flex-col md:flex-row gap-4 w-full">
          <div className="md:w-1/2">
            <CreateLink />
          </div>
          <div className="md:w-1/2">
            <MyLinks />
          </div>
        </div>
      </div>
    </main>
  );
}
