import PropTypes from "prop-types";
import styles from "./NavigationFooter.module.css";

const NavigationFooter = ({ className = "" }) => {
  return (
    <footer className={[styles.navigationFooter, className].join(" ")}>
      <div className={styles.divider} />
      <div className={styles.frameParent}>
        <div className={styles.frameGroup} >
          <div className={styles.signLanguageTranscriptionWrapper}>
            <div className={styles.signLanguageTranscription}>
              Sign Language Transcription
            </div>
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
          </div>
          <div className={styles.frameContainer}>
            <div className={styles.frameParent} style={{ display: 'flex', flexDirection: 'column' }}>
              <div className={styles.pageFrame}>
                <div className={styles.name}>Ohad Langer</div>
                <div className={styles.name}>Rotem Zilberman</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

NavigationFooter.propTypes = {
  className: PropTypes.string,
};

export default NavigationFooter;
