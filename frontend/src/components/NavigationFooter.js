import PropTypes from "prop-types";
import styles from "./NavigationFooter.module.css";

const NavigationFooter = ({ className = "" }) => {

  let onGmail = () => {
    const email = "signtranscription@gmail.com";
    const subject = "Hello!";
    const body = "This is the body of the email.";

    const mailtoLink = `mailto:${email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    window.open(mailtoLink, '_blank');
  };

  let onGithub = () => {
    const url = "https://github.com/ohadlanger/Sign-Language-Transcription.git";
    window.open(url, '_blank');
  };

  let onHuggingFace = () => {
    const url = "https://huggingface.co/spaces/ohadlanger/signwriting_transcription/tree/main";
    window.open(url, '_blank');
  };

  let onSheets = () => {
    const url = "https://docs.google.com/spreadsheets/d/19mluHVMTjIraUWxxJ5FaDFk0nNZOx2fNFsRbo3tc50Q/edit?usp=sharing";
    window.open(url, '_blank');
  };

  let onYoutube = () => {
    const url = "https://www.youtube.com/watch?v=o74zp3d3Q08";
    window.open(url, '_blank');
  };

  let onPowerpoint = () => {
    const url = "https://1drv.ms/p/c/d8aeeeb13ff122a0/EUArZxLsN1lOjDnYhw4qs4YB682AEnG9Y4-A1VfvxGl7Xw?e=rQ8gRN";
    window.open(url, '_blank');
  };

  return (
    <footer className={[styles.navigationFooter, className].join(" ")}>
      <div className={styles.divider} />
      <div className={styles.frameParent}>
        <div className={styles.frameGroup} >
          <div className={styles.buttonsIconParent}>
            <div className={styles.iconContainer}>
              <img
                onClick={onGmail}
                className={styles.buttonsIcon}
                loading="lazy"
                alt=""
                src="/gmail.png"
                style={{ width: "40px", scale: "0.7" }}
              />
              <img
                onClick={onGithub}
                className={styles.buttonsIcon}
                loading="lazy"
                alt=""
                src="/github.png"
                style={{ width: "40px", scale: "0.7" }}
              />
              <img
                onClick={onHuggingFace}
                className={styles.buttonsIcon}
                loading="lazy"
                alt=""
                src="/huggingface.png"
                style={{ width: "40px", scale: "0.7" }}
              />
              <img
                onClick={onSheets}
                className={styles.buttonsIcon}
                loading="lazy"
                alt=""
                src="/sheets.png"
                style={{ width: "40px", scale: "0.7" }}
              />
              <img
                onClick={onYoutube}
                className={styles.buttonsIcon}
                loading="lazy"
                alt=""
                src="/youtube.png"
                style={{ width: "40px", scale: "0.7" }}
              />
              <img
                onClick={onPowerpoint}
                className={styles.buttonsIcon}
                loading="lazy"
                alt=""
                src="/powerpoint.png"
                style={{ width: "40px", scale: "0.7" }}
              />
            </div>
          </div>
          <div className={styles.signLanguageTranscriptionWrapper}>
            <div className={styles.signLanguageTranscription}>
              <span>
                Sign Language Transcription
              </span>
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
