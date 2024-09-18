import React, { useEffect, useState } from 'react';
import Navigation from "../components/Navigation";
import NavigationFooter from "../components/NavigationFooter";
import styles from "./Upload.module.css";
import styles2 from "./Calculator.module.css";
import Arrow from "../components/ArrowComponent"
import { SvgComponent } from '../components/FswComponent';
import * as lib from '@sutton-signwriting/font-ttf';


const Calculator = ({ className = "", video, setVideo, language, setLanguage }) => {

    const [loading, setLoading] = useState(false)
    const [result, setResult] = useState(null)
    const [ref, setRef] = useState([]);
    const [hyp, setHyp] = useState([]);
    const [count, setCount] = useState(0);
    const threshold = 1.5;

    const string_to_float = (string) => {
        return parseFloat(string);
    }

    useEffect(() => {
        if (ref.length == 0 || hyp.length == 0) {
            setLoading(false);
            setResult(null);
        }
        else {
            setLoading(true);
            setResult(null);
        }
    }, [ref, hyp])

    const fetchData = async () => {
        let symbol1 = (document.getElementById('symbol1')).value
        let symbol2 = (document.getElementById('symbol2')).value
        try {
            if (symbol1 && symbol2) {
                const params = {
                    reference: symbol1,
                    hypothesis: symbol2,
                };
                const response = await fetch('http://localhost:5000/api/evaluate/calculate', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(params),
                });
                const res = await response.json();
                setLoading(false);
                setResult(res.score);
            }
        } catch (error) {
            setLoading(false);
            setResult(null);
            setCount(10);
            alert("Error fetching data");
        }
    };


    useEffect(() => {
        const interval = setInterval(() => {
            setCount(prevCount => {
                if (prevCount <= threshold) {
                    const newCount = prevCount + 0.5;
                    if (newCount == threshold) {
                        fetchData();
                        return newCount;
                    }
                    return newCount;
                }
                return prevCount;
            });
        }, 500);

        return () => clearInterval(interval);
    }, []);

    const resetCounter = () => {
        setCount(0.0);
    };

    const changeRef = (event) => {
        let value = event.target.value;
        if (value === "") {
            setLoading(false);
            setResult(null);
            setRef([]);
            return;
        }
        resetCounter();
        let split = value.split(/(?=[AM])/);
        let signs = [];
        for (let i = 0; i < split.length; i++) {
            if (split[i][0] === 'A') {
                continue;
            }
            split[i] = (split[i][0] === 'A' || split[i][0] === 'M') ? split[i] : ('M500x500' + split[i]);
            signs = [...signs, lib.fsw.signSvg(split[i])];
        }
        setRef(signs);
    }

    const changeHyp = (event) => {
        let value = event.target.value;
        if (value === "") {
            setLoading(false);
            setResult(null);
            setHyp([]);
            return;
        }
        resetCounter();
        let split = value.split(/(?=[AM])/);
        let signs = [];
        for (let i = 0; i < split.length; i++) {
            if (split[i][0] === 'A') {
                continue;
            }
            split[i] = (split[i][0] === 'A' || split[i][0] === 'M') ? split[i] : ('M500x500' + split[i]);
            signs = [...signs, lib.fsw.signSvg(split[i])];
        }
        setHyp(signs);
    }

    return (
        <div className={styles.about}>
            <Navigation back={"/"} setVideo={setVideo} setLanguage={setLanguage} />
            <section className={styles.aboutInner} style={{ minHeight: '600px', width: '100%' }}>

                <div className={styles.frameParent} style={{
                    height: "100%", width: "100%", display: "flex", flexDirection: "column", justifyContent: "space-around",
                    border: "2px dashed", borderColor: "white", borderRadius: "100px", overflow: "auto"
                }}>

                    <div className={styles2.wrapper1}>

                        <div style={{ display: "flex", flexDirection: "column", maxWidth: "30%", justifyContent: "center", marginRight: "10%" }}>
                            <h2 style={{ marginBottom: "20px", marginTop: "0px" }}>
                                <b><span>Similarity Metric Calculator:</span></b>
                            </h2>
                            <span className={styles2.smallText}>
                                Comapre FSW symbols. Write or paste the symbols and wait for the result!
                            </span>
                        </div>

                        <div className={styles2.symbols}>
                            <div className={styles2.container}>
                                <div className={styles2.folder}>
                                    <div className={styles2.top}></div>
                                    <div className={styles2.bottom}></div>
                                </div>
                                <label className={styles2.customFileUpload}>
                                    <div id="html_signtext" className={styles2.signtextContainer}>
                                        <div className={`signtext ${styles2.signtext}`}>
                                            <span className="outside">
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
                                    <div id="html_signtext" className={styles2.signtextContainer}>
                                        <div className={`signtext ${styles2.signtext}`}>
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
                            <Arrow size='bigArrow' />
                        </div>


                        <div className={styles2.scoreContainer1}>
                            <label className={`${styles2.scoreContainer2} ${styles2.gradientDiv} ${result ? styles2.animate : ''}`}>
                                <div className={styles2.scoreContainer1}>
                                    <div className={styles2.scoreWrapper}>
                                        {result ? (
                                            <>
                                                <b><span className={`${styles2.score} ${styles2.bigText}`}>Score:&nbsp;
                                                    <span className={styles2.score}>{string_to_float(result).toFixed(3)}</span>
                                                </span></b>
                                            </>
                                        ) : (loading ? (
                                            <span className={styles2.bigText}>Loading...</span>
                                        ) : (
                                            <span className={styles2.bigText}>Enter the symbols!</span>
                                        )
                                        )}
                                    </div>
                                </div>
                            </label>
                        </div>
                    </div>
                </div>
            </section>
            <NavigationFooter />
        </div>
    );
};

export default Calculator;