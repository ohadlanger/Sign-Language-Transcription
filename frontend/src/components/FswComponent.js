import React, { useState, useEffect } from 'react';
import styles from "./FrameComponent.module.css";
import * as lib from '@sutton-signwriting/font-ttf';
import './index.css';
import './SuttonSignWriting.css'


const SvgComponent = ({ svgContent }) => {
    return (
        <div className={styles.bodyTextFor}>
            <div
                className={styles.fsw}
                dangerouslySetInnerHTML={{ __html: svgContent }}
            />
        </div>
    );
};



const Fsw = ({ translation }) => {
    const [imageSrc, setImageSrc] = useState('');
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        if (translation) {
            try {
                // const imageDataUrl = lib.fsw.signPng(translation);
                // // imageDataUrl = [imageDataUrl[0],imageDataUrl[0]];
                // console.log(imageDataUrl);
                // setImageSrc(imageDataUrl);
                setLoading(false);
            } catch (error) {
                console.error('Error generating SignWriting image:', error);
                setLoading(false);
            }
        }
    }, [translation]);

    if (loading) {
        return <div className={styles.bodyTextFor}>Loading...</div>;
    }

    if (error) {
        return <div className={styles.bodyTextFor}>{error}</div>;
    }

    const svgContent = lib.fsw.signSvg(translation);

    return (
        <div className={styles.paragraphWithIcon}>
            <div style={{ display: 'flex', flexDirection: 'row' }}>
                <img className={styles.icon} loading="lazy" alt="" src="/00-1.svg" />
                <h3 className={styles.subheading}>SignWriting (FSW)</h3>
            </div>
            <SvgComponent svgContent={svgContent} />
            
        </div>
    );
}

export default Fsw;