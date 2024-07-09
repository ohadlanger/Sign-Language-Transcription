import React, { useRef, useState } from 'react';
import styles from "./FrameComponent.module.css";
import './index.css';

const Vocal = ({ translation }) => {

    const audioRef = useRef(null);
    const videoRef = useRef();
    const [audioReady, setAudioReady] = useState(false);
    const [audioDuration, setAudioDuration] = useState(4.3);

    const handleButtonClick = () => {
        try {
            if (audioReady) {
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
        setAudioDuration(audioRef.current.duration);
    };

    return (
        <div className={styles.paragraphWithIcon}>
            <div style={{ display: 'flex', flexDirection: 'row', width: '100%', justifyContent: 'center', scale: '1.2' }}>
                <img className={styles.icon} loading="lazy" alt="" src="/audio1.png" />
                <h3 className={styles.subheading}>Vocal</h3>
            </div>
            <div className={styles.bodyTextFor}>
                <audio ref={audioRef} src={audioUrl} onCanPlayThrough={handleCanPlayThrough} />
                <button className={styles.circular} onClick={handleButtonClick}>
                    <video
                        ref={videoRef}
                        className={styles.videoPlayer}
                        loading="lazy"
                        playsInline
                        alt=""
                        src="/audio-waves.mp4"
                        // autoPlay={true}
                        loop
                        muted
                    />
                </button>
            </div>
        </div>
    );
}

export default Vocal;
