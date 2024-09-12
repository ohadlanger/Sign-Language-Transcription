import React, { useEffect, useState } from 'react';
import Navigation from "../components/Navigation";
import { useNavigate } from "react-router-dom";
import DetailsComponent from "../components/DetailsComponent";
import ResultsComponent from "../components/ResultsComponent";
import NavigationFooter from "../components/NavigationFooter";
import Arrow from '../components/ArrowComponent';
import styles from "./About.module.css";

const About = ({ video, setVideo, language, setLanguage }) => {

  const navigate = useNavigate();
  if (!video) {
    navigate('/Upload');
  }

  const [english, setEnglish] = useState(null);
  const [fsw, setFsw] = useState(null);
  const [vocal, setVocal] = useState(null);
  const [result, setResult] = useState(null);
  const [skeletonVideo, setSkeletonVideo] = useState(null);
  const [example, setExample] = useState(false);

  const [binaryData, setBinaryData] = useState(null);
  const reader = new FileReader();

  if (video !== "Example" && !example) {
    reader.onload = function (event) {
      setBinaryData(event.target.result.split(',')[1]);
      const fetchData = async () => {
        try {
          const params = {
            videoFile: event.target.result.split(',')[1],
            signLanguage: language.value,
          };
          const response = await fetch(`http://localhost:5000/api/translate/all_translations`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify(params),
          });
          const res = await response.json();
          setEnglish(res.text_translation)
          setFsw(res.signWriting_translation)
          setVocal(res.voice_translation);
        } catch (error) {
          console.error('Error fetching data:', error);
        }

      };
      fetchData();
    };
  }


  useEffect(() => {
    if (video && video !== "Example" && !example) {
      reader.readAsDataURL(video);
    }
    else if (video === "Example") {
      setExample(true);
    }
    else if (video !== "Example" && !example) {
      navigate('/Upload');
    }
  }, [video]);

  function handleSkeleton(base64) {
    function base64ToBlob(base64, type = "application/octet-stream") {
      const binary = atob(base64);
      const array = [];
      for (let i = 0; i < binary.length; i++) {
        array.push(binary.charCodeAt(i));
      }
      return new Blob([new Uint8Array(array)], { type: type });
    }
  
    // Convert the base64 string (assuming it's for an MP4 video)
    const blob = base64ToBlob(base64, "video/mp4");
  
    // Create a File object from the Blob
    const file = new File([blob], "skeleton.mp4", {
      type: "video/mp4",
      lastModified: Date.now(),
    });

    return file;
  }

  useEffect(() => {
    if (video !== "Example" && !example) {
      const fetchResult = async () => {
        try {
          if (english && vocal && binaryData) {
            console.log("fetching result...");
            const params = {
              text_translation: english,
              video: binaryData,
              sound_translation: vocal
            };
            const response = await fetch('http://localhost:5000/api/translate/video', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json'
              },
              body: JSON.stringify(params),
            });
            const res = await response.json();
            setResult(res.video);
            setSkeletonVideo(handleSkeleton(res.skeletonVideo));
            console.log("Fetch result success!");
          }
        } catch (error) {
          console.error('Error fetching result:', error);
        }
      };
      fetchResult();
    }
  }, [english, vocal, binaryData]);

  if (video === "Example") {
    const filePathToFileObject = async (path) => {
      const response = await fetch(path);
      const data = await response.blob();
      const fileName = path.split('/').pop();
      const file = new File([data], fileName, { type: data.type });
      return file;
    };

    const Update = async () => { setVideo(await filePathToFileObject("/example.mp4")); }

    Update();
  }

  if (video === "Example" || example) {
    return (
      <div className={styles.about}>
        <Navigation setVideo={setVideo} back={"/Upload"} setLanguage={setLanguage}/>
        <section className={styles.aboutInner}>
          <div className={styles.frameParent}>
            <DetailsComponent video={video} result={result} example={example} />
            <div className={styles.divider}></div>
            <ResultsComponent english={english} fsw={fsw} vocal={vocal} example={example}/>
          </div>
        </section >
        <NavigationFooter />
      </div >
    );
  }

  return (
    <div className={styles.about}>
      <Navigation setVideo={setVideo} back={"/Upload"} setLanguage={setLanguage}/>
      {(result && skeletonVideo) ? (
        <section className={styles.aboutInner}>
          <div className={styles.frameParent}>
            <DetailsComponent video={video} result={result} skeletonVideo={skeletonVideo} language={language.label} example={example}/>
            <div className={styles.divider}></div>
            <ResultsComponent video={video} english={english} fsw={fsw} vocal={vocal} example={example}/>
          </div>
        </section >
      ) : (
        <section className={styles.aboutInner} style={{ height: '100%', minHeight: '300px', display: 'flex', alignItems: 'center' }}>
          <div className={styles.frameParent} style={{ justifyContent: 'space-evenly', flexDirection: "row", flexWrap: 'wrap' }}>
            <div className={styles.videoWrapper}>
              <h2 className={styles.video}>Video</h2>
              {video ? (
                <video
                  className={styles.videoPlayer}
                  loading="lazy"
                  alt=""
                  autoPlay
                  loop
                  muted>
                  <source src={URL.createObjectURL(video)} type={video.type} />
                </video>
              ) : (
                <video
                  className={styles.videoPlayer}
                  loading="lazy"
                  alt=""
                  src="/video.mp4"
                  autoPlay
                  loop
                  muted
                />
              )}
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
              <Arrow />
              <b className={styles.loading}>Loading...</b>
            </div>

            <div >
              <h2 className={styles.video}>English</h2>
              <h2 className={styles.video}>Sound</h2>
              <h2 className={styles.video}>Signwriting (FSW)</h2>
            </div>
          </div>
        </section>
      )}
      <NavigationFooter />
    </div >
  );
};

export default About;
