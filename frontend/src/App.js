import { useEffect, useState } from "react";
import {
  Routes,
  Route,
  useNavigationType,
  useLocation,
} from "react-router-dom";
import { useNavigate } from "react-router-dom";
import Welcome from "./pages/Welcome";
import About from "./pages/About";
import Upload from "./pages/Upload";
import Calculator from "./pages/Calculator";

function App() {
  const action = useNavigationType();
  const location = useLocation();
  const pathname = location.pathname;
  const [video, setVideo] = useState(null);
  const [language, setLanguage] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (action !== "POP") {
      window.scrollTo(0, 0);
    }
  }, [action, pathname]);

  useEffect(() => {
    let title = "";
    let metaDescription = "";

    switch (pathname) {
      case "/":
        title = "Welcome page";
        metaDescription = "Opening screen of the site";
        break;
      case "/Upload":
        title = "Upload Page";
        metaDescription = "Upload a video to translate";
        break;
      case "/About":
        title = "About Page";
        metaDescription = "Translation result page about a given video";
        break;
      case "/Calculator":
        title = "Calculator Page";
        metaDescription = "Calculate similarity scores";
        break;
      default:
        navigate("/");
        break;
    }

    if (title) {
      document.title = title;
    }

    if (metaDescription) {
      const metaDescriptionTag = document.querySelector(
        'head > meta[name="description"]'
      );
      if (metaDescriptionTag) {
        metaDescriptionTag.content = metaDescription;
      }
    }
  }, [pathname]);

  return (
    <Routes>
      <Route path="/" element={<Welcome video={video} setVideo={setVideo} language={language} setLanguage={setLanguage} />} />
      <Route path="/Upload" element={<Upload video={video} setVideo={setVideo} language={language} setLanguage={setLanguage} />} />
      <Route path="/About" element={<About video={video} setVideo={setVideo} language={language} setLanguage={setLanguage} />} />
      <Route path="/Calculator" element={<Calculator />} />
    </Routes>
  );
}
export default App;
