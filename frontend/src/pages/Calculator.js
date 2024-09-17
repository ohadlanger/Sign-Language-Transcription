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
    const [count, setCount] = useState(0);
    const threshold = 1.5;

    useEffect(() => { }, [ref, hyp])

    const fetchData = async () => {
        // setLoading(true);
        let symbol1 = (document.getElementById('symbol1')).value
        let symbol2 = (document.getElementById('symbol2')).value
        try {
            if (symbol1 && symbol2) {
                const params = {
                    reference: symbol1,
                    hypothesis: symbol2,
                };
                const response = await fetch(`http://localhost:5000/api/evaluate/calculate`, {
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
            // console.error('Error fetching data:', error);
            // setVideo(null);
            // setLanguage(null);
            // navigate("/Upload")
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
                        return 0; // Reset the counter
                    }
                    return newCount;
                }
                return prevCount;
            });
        }, 500); // Increment the counter every half of a second

        // Cleanup interval on component unmount
        return () => clearInterval(interval);
    }, []);

    const resetCounter = () => {
        setCount(0.0);
    };



    const changeRef = (event) => {
        resetCounter();
        let value = event.target.value;
        if (value) {
            setLoading(true);
        }
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
        resetCounter();
        let value = event.target.value;
        if (value) {
            setLoading(true);
        }
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
                <div className={styles.frameParent} style={{ height: "100%", width:"80%" }}>
                    <div className={styles2.wrapper1}>

                        <div className={styles2.symbols}>

                            <h2 style={{ width: "100%", padding:"0px", margin:"0px"}}><b><span>Similarity Metric Calculator:</span></b></h2>

                            <span style={{ fontSize : "20px" }}>Comapre FSW symbols. Write or paste the symbols <br/> and wait
                            for the result!</span>

                            <div className={styles2.container}>
                                <div className={styles2.folder}>
                                    <div className={styles2.top}></div>
                                    <div className={styles2.bottom}></div>
                                </div>
                                <label className={styles2.customFileUpload}>
                                    <div id="html_signtext" style={{ width: "100%", height: "120px", marginBottom: "10px" }}
                                    >
                                        <div className="signtext" style={{ width: "100%", height: "120px", overflowX: "auto", overflowY: "hidden", marginBottom: "10px" }}>
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
                            <Arrow size='bigArrow'/>
                        </div>



                        <div style={{ display: "flex", flexDirection: "column", justifyContent: "center" }}>

                            <label className={styles2.result}
                                 style={{ height: "100px", width: "300px", display: "flex", flexDirection: "column", justifyContent: "center" }}>
                                <div style={{ display: "flex", flexDirection: "column", justifyContent: "center" }}>
                                    <div style={{ display: "flex", flexDirection: "row", justifyContent: "center" }}>
                                        <b><span style={{ fontSize: "25px" }}>Score: </span></b>
                                        {result ? (
                                            <span>{result}</span>
                                        ) : (loading ? (
                                            <span>Loading</span>
                                        ) : (
                                            <span>________________</span>
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