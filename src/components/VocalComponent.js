import React, { useRef } from 'react';
import styles from "./FrameComponent.module.css";
import './index.css';

const Vocal = ({ translation }) => {

    const audioRef = useRef(null);

    const handleButtonClick = () => {
        if (audioRef.current) {
            audioRef.current.play();
        }
    };

    const audioBlob = new Blob([new Uint8Array(atob(translation).split("").map(char => char.charCodeAt(0)))], { type: 'audio/wav' });
    const audioUrl = URL.createObjectURL(audioBlob);

    
    return (
        <div className={styles.paragraphWithIcon}>
            <div style={{ display: 'flex', flexDirection: 'row' }}>
                <img className={styles.icon} loading="lazy" alt="" src="/00-1.svg" />
                <h3 className={styles.subheading}>Vocal</h3>
            </div>
            <div className={styles.bodyTextFor}>
                <audio ref={audioRef} src={audioUrl} />
                <button className={styles.circular} onClick={handleButtonClick}>
                    <div className={styles.play}></div>
                </button>
            </div>
        </div>
    );
}

export default Vocal;
