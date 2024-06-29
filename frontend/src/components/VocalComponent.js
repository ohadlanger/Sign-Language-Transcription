import React, { useRef, useState } from 'react';
import styles from "./FrameComponent.module.css";
import './index.css';

const Vocal = ({ translation }) => {

    const audioRef = useRef(null);

    const [audioReady, setAudioReady] = useState(false);

    const handleButtonClick = () => {
        try {
            if (audioReady) {
                audioRef.current.play();
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
            <div style={{ display: 'flex', flexDirection: 'row' }}>
                <img className={styles.icon} loading="lazy" alt="" src="/audio.png" />
                <h3 className={styles.subheading}>Vocal</h3>
            </div>
            <div className={styles.bodyTextFor}>
                <audio ref={audioRef} src={audioUrl} onCanPlayThrough={handleCanPlayThrough}/>
                <button className={styles.circular} onClick={handleButtonClick}>
                    <div className={styles.play}></div>
                </button>
            </div>
        </div>
    );
}

export default Vocal;
