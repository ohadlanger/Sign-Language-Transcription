import PropTypes from "prop-types";
import styles from "./NavigationFooter.module.css";

const NavigationFooter = ({ className = "" }) => {
  return (
    <footer className={[styles.navigationFooter, className].join(" ")}>
      <div className={styles.divider} />
      <div className={styles.frameParent}>
        <div className={styles.frameGroup}>
          <div className={styles.signLanguageTranscriptionWrapper}>
            <div className={styles.signLanguageTranscription}>
              Sign Language Transcription
            </div>
          </div>
          <div className={styles.frameContainer}>
            <div className={styles.topicParent}>
              <div className={styles.topic}>Topic</div>
            </div>
            <div className={styles.topicGroup}>
              <div className={styles.topic1}>Topic</div>
            </div>
            <div className={styles.topicContainer}>
              <div className={styles.topic2}>Topic</div>
            </div>
          </div>
        </div>
        <div className={styles.frameDiv}>
          <div className={styles.buttonsIconParent}>
            <img
              className={styles.buttonsIcon}
              loading="lazy"
              alt=""
              src="/buttons--icon@2x.png"
            />
            <img
              className={styles.buttonsIcon1}
              loading="lazy"
              alt=""
              src="/buttons--icon-1@2x.png"
            />
            <img
              className={styles.buttonsIcon2}
              alt=""
              src="/buttons--icon-2@2x.png"
            />
            <img
              className={styles.buttonsIcon3}
              loading="lazy"
              alt=""
              src="/buttons--icon-3@2x.png"
            />
          </div>
          {/* <div className={styles.pageParent}>
            <div className={styles.page6}>Page</div>
            <div className={styles.page7}>Page</div>
          </div>
          <div className={styles.page8}>Page</div> */}
        </div>
      </div>
    </footer>
  );
};

NavigationFooter.propTypes = {
  className: PropTypes.string,
};

export default NavigationFooter;
