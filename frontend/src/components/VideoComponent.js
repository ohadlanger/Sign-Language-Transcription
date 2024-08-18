import React, { useState, useRef, useEffect } from 'react'
import "bootstrap/dist/css/bootstrap.min.css";
import { Button } from "react-bootstrap";
import styles from "./FrameComponent2.module.css";

const VideoComponent = ({ video, skeletonUrl, example=false }) => {

    const videoRef = useRef(null);
    const [mode, setMode] = useState(true);
    const [currentTime, setCurrentTime] = useState(0);
    const [videoUrl, setVideoUrl] = useState();



    // const height = video
    console.log(video)

    const onChangeMode = async () => {
        if (video) {
            // videoRef.current.pause();
            setMode(!mode);
            setCurrentTime(videoRef.current.currentTime);
        }
    }

    useEffect(() => {
        if (video) {
            videoRef.current.currentTime = currentTime;
            // videoRef.current.play();
        }
    }, [mode, currentTime]);


    console.log("video: ", video)
    console.log("skeletonUrl: ", skeletonUrl)

    return (
        <div style={{ display: 'flex', flexDirection: 'row' }}>
            <div style={{ display: 'flex', flexDirection: 'column', justifyContent:'end', minHeight:"400px"}}>
                <Button className={styles.secondaryButton} variant="outline-light" style={{ marginTop: '10px', marginRight:'5px', height: '45px'}} onClick={onChangeMode}>
                    {mode ? (
                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" className="bi bi-eye" viewBox="0 0 16 16">
                            <path d="M16 8s-3-5.5-8-5.5S0 8 0 8s3 5.5 8 5.5S16 8 16 8M1.173 8a13 13 0 0 1 1.66-2.043C4.12 4.668 5.88 3.5 8 3.5s3.879 1.168 5.168 2.457A13 13 0 0 1 14.828 8q-.086.13-.195.288c-.335.48-.83 1.12-1.465 1.755C11.879 11.332 10.119 12.5 8 12.5s-3.879-1.168-5.168-2.457A13 13 0 0 1 1.172 8z" />
                            <path d="M8 5.5a2.5 2.5 0 1 0 0 5 2.5 2.5 0 0 0 0-5M4.5 8a3.5 3.5 0 1 1 7 0 3.5 3.5 0 0 1-7 0" />
                        </svg>) : (
                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" className="bi bi-eye-slash" viewBox="0 0 16 16">
                            <path d="M13.359 11.238C15.06 9.72 16 8 16 8s-3-5.5-8-5.5a7 7 0 0 0-2.79.588l.77.771A6 6 0 0 1 8 3.5c2.12 0 3.879 1.168 5.168 2.457A13 13 0 0 1 14.828 8q-.086.13-.195.288c-.335.48-.83 1.12-1.465 1.755q-.247.248-.517.486z" />
                            <path d="M11.297 9.176a3.5 3.5 0 0 0-4.474-4.474l.823.823a2.5 2.5 0 0 1 2.829 2.829zm-2.943 1.299.822.822a3.5 3.5 0 0 1-4.474-4.474l.823.823a2.5 2.5 0 0 0 2.829 2.829" />
                            <path d="M3.35 5.47q-.27.24-.518.487A13 13 0 0 0 1.172 8l.195.288c.335.48.83 1.12 1.465 1.755C4.121 11.332 5.881 12.5 8 12.5c.716 0 1.39-.133 2.02-.36l.77.772A7 7 0 0 1 8 13.5C3 13.5 0 8 0 8s.939-1.721 2.641-3.238l.708.709zm10.296 8.884-12-12 .708-.708 12 12z" />
                        </svg>
                    )}
                </Button>
            </div>
            <div className={styles.frameGroup}>
                <div className={styles.videoWrapper}>
                    <h2 className={styles.video}>Video</h2>
                </div>
                {video ? (
                    <video
                        key={mode ? "original" : "skeleton"}
                        className={styles.videoPlayer}
                        ref={videoRef}
                        loading="lazy"
                        alt=""
                        autoPlay
                        loop
                        muted>
                        {/* <source src={mode? URL.createObjectURL(video) : URL.createObjectURL(skeletonVideo)} type={video.type} /> */}
                        <source src={(video !== "Example" && !example) ? (mode ? URL.createObjectURL(video) : skeletonUrl) :
                            (mode ? "/example.mp4" : "/skeleton.mp4")} type={video.type} />
                    </video>
                ) : (
                    <video
                        className={styles.videoPlayer}
                        loading="lazy"
                        alt=""
                        src="/video.mp4"
                        autoPlay
                        loop
                        muted
                    />
                )}

            </div>
        </div>
    );
}

export default VideoComponent;