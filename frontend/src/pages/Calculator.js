import React, { useEffect, useState } from 'react';
import Navigation from "../components/Navigation";
import NavigationFooter from "../components/NavigationFooter";
import styles from "./Upload.module.css";
import styles2 from "./Calculator.module.css";
import Arrow from "../components/ArrowComponent"
import { Button } from 'react-bootstrap';
import { SvgComponent } from '../components/FswComponent';
import * as lib from '@sutton-signwriting/font-ttf';

const Calculator = ({ className = "", video, setVideo, language, setLanguage }) => {

    const [loading, setLoading] = useState(false)
    const [result, setResult] = useState(null)
    const [ref, setRef] = useState([]);
    const [hyp, setHyp] = useState([]);

    useEffect(() => { }, [ref, hyp])

    const handleClick = () => {
        let symbol1 = (document.getElementById('symbol1')).value
        let symbol2 = (document.getElementById('symbol2')).value
        setLoading(true);
        setResult(100.0);
    }

    const changeRef = (event) => {
        let value = event.target.value;
        let split = value.split(/(?=[M])/);
        let signs = [];
        for (let i = 0; i < split.length; i++) {
            split[i] = (split[i][0] === 'A' || split[i][0] === 'M') ? split[i] : ('M500x500' + split[i]);
            signs = [...signs, lib.fsw.signSvg(split[i])];
        }
        console.log(signs);
        setRef(signs);
    }

    const changeHyp = (event) => {
        let value = event.target.value;
        let split = value.split(/(?=[M])/);
        let signs = [];
        for (let i = 0; i < split.length; i++) {
            split[i] = (split[i][0] === 'A' || split[i][0] === 'M') ? split[i] : ('M500x500' + split[i]);
            signs = [...signs, lib.fsw.signSvg(split[i])];
        }
        console.log(signs);
        setHyp(signs);
    }

    return (
        <div className={styles.about}>
            <Navigation back={"/"} setVideo={setVideo} setLanguage={setLanguage} />
            <section className={styles.aboutInner} style={{ minHeight: '600px' }}>
                <div className={styles.frameParent} style={{ height: "100%" }}>
                    <div className={styles2.wrapper1}>

                        <div className={styles2.symbols}>

                            <h2 style={{ width: "100%" }}><b><span>Similarity Metric Calculator:</span></b></h2>

                            <div className={styles2.container}>
                                <div className={styles2.folder}>
                                    <div className={styles2.top}></div>
                                    <div className={styles2.bottom}></div>
                                </div>
                                <label className={styles2.customFileUpload}>
                                    <div id="html_signtext" style={{ width: "100%", height: "120px", marginBottom: "10px" }}
                                    >
                                        <div className="signtext" style={{ width: "100%", height: "120px", overflow: "scroll", marginBottom: "10px" }}>
                                            <span className="outside" >
                                                <span className="middle">
                                                    <span className="inside">
                                                        {ref.map((_, i) => (
                                                            <SvgComponent key={i} svgContent={ref[i]} />
                                                        ))}
                                                    </span>
                                                </span>
                                            </span>
                                        </div>
                                    </div>
                                    <input id='symbol1' className={styles2.fileName} type='text' placeholder='Symbol 1' onChange={changeRef}></input>
                                </label>
                            </div>

                            <div className={styles2.container}>
                                <div className={styles2.folder}>
                                    <div className={styles2.top}></div>
                                    <div className={styles2.bottom}></div>
                                </div>
                                <label className={styles2.customFileUpload}>
                                    <div id="html_signtext" style={{ width: "100%", height: "120px", marginBottom: "10px" }}
                                    >
                                        <div className="signtext" style={{ width: "100%", height: "120px", overflow: "scroll", marginBottom: "10px" }}>
                                            <span className="outside">
                                                <span className="middle">
                                                    <span className="inside">
                                                        {hyp.map((_, i) => (
                                                            <SvgComponent key={i} svgContent={hyp[i]} />
                                                        ))}
                                                    </span>
                                                </span>
                                            </span>
                                        </div>
                                    </div>
                                    <input id='symbol2' className={styles2.fileName} type='text' placeholder='Symbol 2' onChange={changeHyp}></input>
                                </label>
                            </div>
                        </div>


                        <div className={styles2.wrapper2}>
                            {loading ? (
                                <Arrow />
                            ) : (

                                <Button className={styles2.calcBtn} variant="outline-light" onClick={handleClick}>Calculate</Button>
                            )}
                        </div>




                        <div className={styles2.wrapper2}>
                            {result ? (
                                <span>{result}</span>
                            ) : (loading ? (
                                <span>Loading</span>
                            ) : (
                                <span>____________</span>
                            )
                            )}
                        </div>
                    </div>
                </div>
            </section>
            <NavigationFooter />
        </div>
    );
};

export default Calculator;
