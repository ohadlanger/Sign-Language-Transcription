import { useMemo } from "react";
import PropTypes from "prop-types";
import styles from "./FrameComponent1.module.css";

const FrameComponent1 = ({
  className = "",
  subheading,
  propWidth,
  propPadding,
}) => {
  const frameDivStyle = useMemo(() => {
    return {
      width: propWidth,
      padding: propPadding,
    };
  }, [propWidth, propPadding]);

  return (
    <div
      className={[styles.paragraphWithIconWrapper, className].join(" ")}
      style={frameDivStyle}
    >
      <div className={styles.paragraphWithIcon}>
        <img className={styles.icon} loading="lazy" alt="" src="/00.svg" />
        <h3 className={styles.subheading}>{subheading}</h3>
        <div
          className={styles.bodyTextFor}
        >{`Body text for whatever you’d like to suggest. Add main takeaway points, quotes, anecdotes, or even a very very short story. `}</div>
      </div>
    </div>
  );
};

FrameComponent1.propTypes = {
  className: PropTypes.string,
  subheading: PropTypes.string,

  /** Style props */
  propWidth: PropTypes.any,
  propPadding: PropTypes.any,
};

export default FrameComponent1;
