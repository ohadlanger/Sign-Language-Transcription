import React, { useState, useEffect } from 'react';
import styles from "./FrameComponent.module.css";
import * as lib from '@sutton-signwriting/font-ttf';
import './index.css';
import './SuttonSignWriting.css'


const SvgComponent = ({ svgContent }) => {
    return (
        <div className="sign" style={{ marginRight: "2px", marginLeft: "2px" }}>
            <div
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
                setLoading(false);
            } catch (error) {
                console.error('Error generating SignWriting image:', error);
                setLoading(false);
            }
        }
    }, [translation]);

    if (loading) {
        return (
            <div className={styles.paragraphWithIcon}>
                <div style={{ display: 'flex', flexDirection: 'row', width: '100%', justifyContent: 'center' }}>
                    <img className={styles.icon} loading="lazy" alt="" src="/signing.png" />
                    <h3 className={styles.subheading}>SignWriting (FSW)</h3>
                </div>
                <div className={styles.bodyTextFor}>Loading...</div>
            </div>);
    }

    if (error) {
        return <div className={styles.bodyTextFor}>{error}</div>;
    }

    const preventPropagation = (e) => {
        e.stopPropagation();
    };

    let signs = [];
    const split = translation.split(' ');
    for (let i = 0; i < split.length; i++) {
        split[i] = (split[i][0] === 'A' || split[i][0] === 'M') ? split[i] : ('M500x500' + split[i]);
        signs = [...signs, lib.fsw.signSvg(split[i])];
    }

    return (
        <div className={styles.paragraphWithIcon}
            onMouseDown={preventPropagation}
            onMouseMove={preventPropagation}
            onMouseUp={preventPropagation}>
            <div style={{ display: 'flex', flexDirection: 'row', width: '100%', justifyContent: 'center', scale:'1.2'}}>
                <img className={styles.icon} loading="lazy" alt="" src="/signing1.png" />
                <h3 className={styles.subheading}>SignWriting (FSW)</h3>
            </div>
            <div id="html_signtext" style={{ "width": "500px", "height": "500px" }}
            >
                <div className="signtext">
                    <span className="outside">
                        <span className="middle">
                            <span className="inside">
                                {signs.map((_, i) => (
                                    <SvgComponent key={i} svgContent={signs[i]} />
                                ))}
                            </span>
                        </span>
                    </span>
                </div>
            </div>
        </div>
    );
}

export default Fsw;