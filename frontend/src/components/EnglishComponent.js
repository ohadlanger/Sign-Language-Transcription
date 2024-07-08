import styles from "./FrameComponent.module.css";
import './index.css';

const English = ({translation}) => {
    return (
        <div className={styles.paragraphWithIcon}>
            <div style={{ display: 'flex', flexDirection: 'row', width: '100%', justifyContent: 'center', scale:'1.2'}}>
                <img className={styles.icon} loading="lazy" alt="" src="/language.png" />
                <h3 className={styles.subheading}>English</h3>
            </div>
            <div className={styles.bodyTextFor}>
                {translation? translation : 'Loading...'}
            </div>
        </div>
    );
}

export default English;