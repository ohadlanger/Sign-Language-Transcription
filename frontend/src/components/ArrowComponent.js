import React from 'react';
import styles from "./ArrowComponent.module.css";

const Arrow = ({ size = "arrow" }) => {

    return (
        <div className={size == "arrow" ? styles.arrow : styles.bigArrow}>
            <span></span>
            <span></span>
            <span></span>
        </div>
    )
}

export default Arrow;