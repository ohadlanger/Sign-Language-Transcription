import { useEffect, createContext, useState } from "react";
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

function App() {
  const action = useNavigationType();
  const location = useLocation();
  const pathname = location.pathname;
  const [video, setVideo] = useState(null);
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
        title = "";
        metaDescription = "";
        break;
      case "/Upload":
        title = "About Page";
        metaDescription = "Learn more about us.";
        break;
      case "/About":
        title = "About Page";
        metaDescription = "Learn more about us.";
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
      <Route path="/" element={<Welcome video={video} setVideo={setVideo}/>} />
      <Route path="/Upload" element={<Upload video={video} setVideo={setVideo}/>} />
      <Route path="/About" element={<About video={video} setVideo={setVideo}/>} />
      {/* <Route path="/" element={<About />} /> */}
    </Routes>
  );
}
export default App;
