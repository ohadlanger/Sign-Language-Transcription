import "bootstrap/dist/css/bootstrap.min.css";
import { Button } from "react-bootstrap";
import PropTypes from "prop-types";
import styles from "./Navigation.module.css";
import { useNavigate } from "react-router-dom";

const Navigation = ({ className = "", back = true, setVideo}) => {
  const navigate = useNavigate();

  const onClick = (event) => {
    event.preventDefault();
    setVideo(null);
    navigate("/");
  }

  return (
    <header className={[styles.navigation, className].join(" ")}>
      <div className={styles.signLanguageTranscriptionWrapper}>
        <div className={styles.signLanguageTranscription}>
          Sign Language Transcription
        </div>
      </div>
      <div className={styles.wrapper} style={{ display: 'flex', flexDirection: 'row'}}>
        <div className={styles.frameParent} style={{ display: 'flex', flexDirection: 'column' }}>
          <div className={styles.pageFrame}>
            <div className={styles.name}>Ohad Langer</div>
            <div className={styles.name}>Rotem Zilberman</div>
          </div>
        </div>
        {back === true && (
          <Button className={styles.button} variant="outline-light" onClick={onClick}>Back</Button>
        )}
      </div>
    </header>
  );
};

Navigation.propTypes = {
  className: PropTypes.string,
};

export default Navigation;
