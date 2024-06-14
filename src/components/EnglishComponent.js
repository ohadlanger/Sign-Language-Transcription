import styles from "./FrameComponent.module.css";
import './index.css';

const English = ({translation}) => {
    return (
        <div className={styles.paragraphWithIcon}>
            <div style={{ display: 'flex', flexDirection: 'row' }}>
                <img className={styles.icon} loading="lazy" alt="" src="/00-1.svg" />
                <h3 className={styles.subheading}>English</h3>
            </div>
            <div className={styles.bodyTextFor}>
                {translation? translation : 'Loading...'}
            </div>
        </div>
    );
}

export default English;