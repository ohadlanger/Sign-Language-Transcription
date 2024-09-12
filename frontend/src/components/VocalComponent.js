import React, { useRef, useState } from 'react';
import styles from "./ResultsComponent.module.css";
import './index.css';

const Vocal = ({ translation, example }) => {

    const audioRef = useRef(null);
    const videoRef = useRef();
    const [audioReady, setAudioReady] = useState(false);

    const handleButtonClick = (event) => {
        event.stopPropagation();
        
        try {
            if ((!example && audioReady) || example) {
                videoRef.current.play();
                audioRef.current.play();
                setTimeout(() => {
                    videoRef.current.pause();
                    videoRef.current.currentTime = 0; // Reset video to start
                }, audioRef.current.duration * 1000);
            }
        }
        catch (error) {
            console.log("Audio not ready...")
        }
    };

    const audioBlob = new Blob([new Uint8Array(atob(translation).split("").map(char => char.charCodeAt(0)))], { type: 'audio/wav' });
    const audioUrl = URL.createObjectURL(audioBlob);


    const handleCanPlayThrough = () => {
        setAudioReady(true);
    };

    return (
        <div className={styles.paragraphWithIcon}>
            <div style={{ display: 'flex', flexDirection: 'row', width: '100%', justifyContent: 'center', scale: '1.2' }}>
                <img className={styles.icon} loading="lazy" alt="" src="/audio1.png" />
                <h3 className={styles.subheading}>Vocal</h3>
            </div>
            <div className={styles.bodyTextFor}>
                <audio ref={audioRef} src={example ? "/voice_example.mp3" : audioUrl} onCanPlayThrough={handleCanPlayThrough} />
                <button className={styles.circular} onClick={handleButtonClick}>
                    <video
                        ref={videoRef}
                        className={styles.videoPlayer}
                        loading="lazy"
                        playsInline
                        alt=""
                        src="/audio-waves.mp4"
                        loop
                        muted
                    />
                </button>
            </div>
        </div>
    );
}

export default Vocal;
