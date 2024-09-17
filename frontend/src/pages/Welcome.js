import React from 'react';
import Navigation from "../components/Navigation";
import NavigationFooter from "../components/NavigationFooter";
import Welcome from '../components/WelcomeComponent';
import styles from "./Welcome.module.css";

const WelcomePage = ({ className = "", video, setVideo, language, setLanguage }) => {

    return (
        <div className={styles.about}>
            <Navigation back={null}/>
            <section className={styles.aboutInner}>
                <div className={styles.frameParent}>
                    <Welcome />
                </div>
            </section>
            <NavigationFooter />
        </div>
    );
};

export default WelcomePage;
