import React, { useState } from 'react';
import { useNavigate } from "react-router-dom";
import { Button } from "react-bootstrap";
import Table from './TableComponent';
import styles from './WelcomeComponent.module.css';

const Welcome = () => {
    const navigate = useNavigate()

    const handleSubmit = (event) => {
        navigate('/Upload')
    }

    return (
        <div className={styles.wrapper}>
            <div className={styles.box}><h1><b>Welcome to the SignWriting Transcription Project!</b></h1></div>
            <Table />
            <p>
                In this project, we teamed with the research team of Amit Moryossef, our instructor, with the goal of developing an Artificial Intelligance
                that is capable of translating Sign-Language videos to spoken language.
            </p>
            <p>
                The Idea for this project came about when we searched for a field that was not sufficiently explored using artificial intelligence, where we can create real change and help people in need. The field we came up with is deafness and sign-language speakers.
            </p>
            <p>
                Our goal was to allow hard-hearing people to be able to speak in their native language, the sign language, even with people who are not familiar with it, without the need to uncomfortably speak in verbal languages that are unintuitive for them.
            </p>
            <p>
                This technology can be integrated into day-to-day usage, online meatings and conventions, other feilds of research from visual gestures and much more.
            </p>

            <div style={{ margin: "10px" }}>
                <a href="https://1drv.ms/p/c/d8aeeeb13ff122a0/EV9EVQzTQAlLqdz_ldCirjoBJafncIsxUL86hKXjzLArnQ?e=4AepNy" target='_blank' rel='noopener noreferrer' style={{ color: 'cyan' }}>Watch Project Presentation</a>
            </div>

            <div className={styles.box}><Button className={styles.button} variant="outline-light" onClick={handleSubmit}>Get Started!</Button></div>
        </div >
    );
}

export default Welcome;
