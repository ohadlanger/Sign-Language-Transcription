import React from 'react';
import Navigation from "../components/Navigation";
import Upload from '../components/UploadComponent'
import NavigationFooter from "../components/NavigationFooter";
import styles from "./Upload.module.css";


const UploadVideo = ({ className = "", video, setVideo }) => {

    return (
        <div className={styles.about}>
            <Navigation back={false}/>
            <section className={styles.aboutInner}>
                <div className={styles.frameParent}>
                    <Upload video={video} setVideo={setVideo}/>
                </div>
            </section>
            <NavigationFooter />
        </div>
    );
};

export default UploadVideo;
