import { useState, useEffect } from "react";
import Snackbar from "@mui/material/Snackbar";
import MuiAlert from "@mui/material/Alert";
import { apiGet } from "./lib/api";
import type { Link } from "./types";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { RedirectPage } from "./pages/RedirectPage";
import { NotFoundPage } from "./pages/NotFoundPage";
import { MainPage } from "./pages/MainPage";

export function App() {
  const [links, setLinks] = useState<Link[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  const [alert, setAlert] = useState<{
    message: string;
    severity: "success" | "error";
  } | null>(null);
  const [openAlert, setOpenAlert] = useState(false);

  const showAlert = (
    message: string,
    severity: "success" | "error" = "success"
  ) => {
    setAlert({ message, severity });
    setOpenAlert(true);
  };

  const handleCloseAlert = () => {
    setOpenAlert(false);
  };

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

  const triggerRefresh = () => {
    setLoading(true);
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
    <BrowserRouter>
      <Routes>
        <Route
          path="/"
          element={
            <MainPage
              links={links}
              triggerRefresh={triggerRefresh}
              showAlert={showAlert}
            />
          }
        />
        <Route
          path="/:shortUrl"
          element={<RedirectPage showAlert={showAlert} />}
        />
        <Route path="/redirect/not-found" element={<NotFoundPage />} />
      </Routes>
      <Snackbar
        open={openAlert}
        autoHideDuration={3000}
        onClose={handleCloseAlert}
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
      >
        {alert ? (
          <MuiAlert
            onClose={handleCloseAlert}
            severity={alert.severity}
            elevation={6}
            variant="filled"
          >
            {alert.message}
          </MuiAlert>
        ) : (
          <span />
        )}
      </Snackbar>
    </BrowserRouter>
  );
}
