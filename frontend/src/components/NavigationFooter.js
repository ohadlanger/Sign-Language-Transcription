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
    const githubUrl = "https://github.com/sign-language-processing/signwriting-transcription.git";
    window.open(githubUrl, '_blank');
  };

  let onHuggingFace = () => {
    const githubUrl = "https://huggingface.co/spaces/ohadlanger/signwriting_transcription/tree/main";
    window.open(githubUrl, '_blank');
  };

  let onSheets = () => {
    const githubUrl = "https://docs.google.com/spreadsheets/d/19mluHVMTjIraUWxxJ5FaDFk0nNZOx2fNFsRbo3tc50Q/edit?usp=sharing";
    window.open(githubUrl, '_blank');
  };

  return (
    <footer className={[styles.navigationFooter, className].join(" ")}>
      <div className={styles.divider} />
      <div className={styles.frameParent}>
        <div className={styles.frameGroup} >
          <div className={styles.signLanguageTranscriptionWrapper}>
            <div className={styles.signLanguageTranscription}>
              <span>
                Sign Language Transcription
              </span>
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
          <div className={styles.buttonsIconParent}>
            <img
              onClick={onGmail}
              className={styles.buttonsIcon}
              loading="lazy"
              alt=""
              src="/gmail.png"
              style={{width:"40px", scale:"0.7"}}
            />
            <img
              onClick={onGithub}
              className={styles.buttonsIcon}
              loading="lazy"
              alt=""
              src="/github.png"
              style={{width:"40px", scale:"0.7"}}
            />
            <img
              onClick={onHuggingFace}
              className={styles.buttonsIcon}
              loading="lazy"
              alt=""
              src="/huggingface.png"
              style={{width:"40px", scale:"0.7"}}
            />
            <img
              onClick={onSheets}
              className={styles.buttonsIcon}
              loading="lazy"
              alt=""
              src="/sheets.png"
              style={{width:"40px", scale:"0.7"}}
            />
            {/* <img
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
            /> */}
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
