import React, { useEffect } from 'react';
import Navigation from "../components/Navigation";
import Upload from '../components/UploadComponent'
import NavigationFooter from "../components/NavigationFooter";
import styles from "./Upload.module.css";


const UploadPage = ({ className = "", video, setVideo, language, setLanguage }) => {

    useEffect(() => {
        setVideo(null);
        setLanguage(null);
    }, []) 

    return (
        <div className={styles.about}>
            <Navigation back={"/"} setVideo={setVideo} setLanguage={setLanguage}/>
            <section className={styles.aboutInner}>
                <div className={styles.frameParent}>
                    <Upload video={video} setVideo={setVideo} language={language} setLanguage={setLanguage}/>
                </div>
            </section>
            <NavigationFooter />
        </div>
    );
};

export default UploadPage;
