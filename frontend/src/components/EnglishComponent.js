import styles from "./ResultsComponent.module.css";
import './index.css';

const English = ({translation, example }) => {
    return (
        <div className={styles.paragraphWithIcon}>
            <div style={{ display: 'flex', flexDirection: 'row', width: '100%', justifyContent: 'center', scale:'1.2'}}>
                <img className={styles.icon} loading="lazy" alt="" src="/language.png" />
                <h3 className={styles.subheading}>English</h3>
            </div>
            <div className={styles.bodyTextFor}>
                {(!example && translation)? translation : 'What is your name?'}
            </div>
        </div>
    );
}

export default English;