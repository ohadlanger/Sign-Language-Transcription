import React, { useState, useEffect } from 'react';
import styles from "./ResultsComponent.module.css";
import * as lib from '@sutton-signwriting/font-ttf';
import './index.css';
import './SuttonSignWriting.css'


export const SvgComponent = ({ svgContent }) => {

    function replaceFirstViewBox(svgString) {
        const parser = new DOMParser();
        const doc = parser.parseFromString(svgString, 'image/svg+xml');
        const svgElement = doc.querySelector('svg');

        if (svgElement) {
            let viewBox = svgElement.getAttribute('viewBox');
            if (viewBox) {
                viewBox = viewBox.split(" ");
                const width = parseInt(viewBox[2], 10);
                const height = parseInt(viewBox[3], 10);

                if (width < 1 || height < 1) {
                    let maxDimension = Math.max(width, height);
                    if (maxDimension < 1) {
                        maxDimension = 30;
                    }
                    viewBox[2] = maxDimension;
                    viewBox[3] = maxDimension;
                    viewBox = viewBox.join(" ");
                    svgElement.setAttribute('viewBox', viewBox);

                    svgElement.setAttribute('width', maxDimension);
                    svgElement.setAttribute('width', maxDimension);
                }

                const serializer = new XMLSerializer();
                return serializer.serializeToString(doc);
            }
            return svgString;
        } else {
            return svgString; // Return the original string if no SVG element found
        }
    }

    svgContent = replaceFirstViewBox(svgContent);

    return (
        <div className="sign" style={{ marginRight: "2px", marginLeft: "2px" }}>
            <div
                dangerouslySetInnerHTML={{ __html: svgContent }}
            />
        </div>
    );
};



const Fsw = ({ translation, example }) => {
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



    if (loading && !example) {
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


    if (example) {
        translation = "M507x523S15a20494x496S26500493x477\nM522x525S11511498x491S11519479x498S20600489x476\nM553x568S27102538x528S30300482x477S14c01508x529S14c07464x528S27116444x528S30c30489x495";
    }
    let signs = [];
    const split = translation.split('\n');
    for (let i = 0; i < split.length; i++) {
        split[i] = (split[i][0] === 'A' || split[i][0] === 'M') ? split[i] : ('M500x500' + split[i]);
        signs = [...signs, lib.fsw.signSvg(split[i])];
    }

    return (
        <div className={styles.paragraphWithIcon}
            onMouseDown={preventPropagation}
            onMouseMove={preventPropagation}
            onMouseUp={preventPropagation}>
            <div style={{ display: 'flex', flexDirection: 'row', width: '100%', justifyContent: 'center', scale: '1.2' }}>
                <img className={styles.icon} loading="lazy" alt="" src="/signing1.png" />
                <h3 className={styles.subheading}>SignWriting (FSW)</h3>
            </div>
            <div id="html_signtext" style={{ width: "500px", height: "500px" }}
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