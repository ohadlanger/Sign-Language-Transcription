import React, { useEffect, useState } from 'react';
import Navigation from "../components/Navigation";
import { useNavigate } from "react-router-dom";
import FrameComponent2 from "../components/FrameComponent2";
import FrameComponent from "../components/FrameComponent";
import NavigationFooter from "../components/NavigationFooter";
import styles from "./About.module.css";

const About = ({ video, setVideo }) => {
  const navigate = useNavigate();
  if (!video) {
    navigate('/');
  }
  
  const [binaryData, setBinaryData] = useState(null);
  const reader = new FileReader();
  reader.onload = function(event) {
    setBinaryData(event.target.result.split(',')[1]);
    const fetchData = async () => {
      try {
        const params = {
          videoFile: event.target.result.split(',')[1],
        };
        console.log("HIIIIIIIIIIIIII: ", params);
        const response = await fetch(`http://localhost:5000/api/translate/all_translations`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(params),
        });
        const res = await response.json();
        console.log(res);
        setEnglish(res.text_translation)
        setFsw(res.signWriting_translation)
        setVocal(res.voice_translation);
      } catch (error) {
        console.error('Error fetching data:', error);
      }

    };
    fetchData();
  };
  

  const [english, setEnglish] = useState(null);
  const [fsw, setFsw] = useState(null);
  const [vocal, setVocal] = useState(null);
  const [result, setResult] = useState(null);

  useEffect(() => {
    if (video) {
      reader.readAsDataURL(video);
    }
    else {
      navigate('/');
    }
  }, [video]);


  useEffect(() => {
    const fetchResult = async () => {
      try {
        if (english && vocal && binaryData) {
          console.log("fetching result...");
          const params = {
            text_translation: english,
            video: binaryData,
            sound_translation: vocal
          };
          // const response = await fetch(`http://localhost:5000/api/translate/video?${params.toString()}`)
          const response = await fetch('http://localhost:5000/api/translate/video', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify(params),
          });
          const res = await response.json();
          setResult(res.video);
          console.log("Fetch result success!");
        }
      } catch (error) {
        console.error('Error fetching result:', error);
      }
    };
    fetchResult();
  }, [english, vocal, binaryData]);


  return (
    <div className={styles.about}>
      <Navigation setVideo={setVideo} />
      <section className={styles.aboutInner}>
        <div className={styles.frameParent}>
          <FrameComponent2 video={video} result={result} />
          <div className={styles.divider}></div>
          <FrameComponent video={video} english={english} fsw={fsw} vocal={vocal} />
        </div>
      </section>
      <NavigationFooter />
    </div>
  );
};

export default About;
