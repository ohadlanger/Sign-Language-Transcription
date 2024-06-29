import React, { useState } from 'react';
import { useNavigate } from "react-router-dom";
import { Button } from "react-bootstrap";
import styles from './UploadComponent.module.css';

const Upload = ({ video, setVideo }) => {

    const navigate = useNavigate();
    const [selectedFile, setSelectedFile] = useState(null);
    const [isDragging, setIsDragging] = useState(false);

    const handleFileChange = (event) => {
        const file = event.target.files[0];
        if (file) {
            setSelectedFile(file);
            setVideo(file);
        }
        console.log("changed");
    };

    const handleDragOver = (event) => {
        event.preventDefault();
        event.stopPropagation();
        setIsDragging(true);
        console.log("dragged");
    };

    const handleDragLeave = (event) => {
        event.preventDefault();
        event.stopPropagation();
        setIsDragging(false);
        console.log("undragged");
    };

    const handleDrop = (event) => {
        event.preventDefault();
        event.stopPropagation();
        setIsDragging(false);

        const file = event.dataTransfer.files[0];
        if (file) {
            setSelectedFile(file);
            setVideo(file);
        }
        console.log("DROPPED");
    };

    const handleSubmit = (event) => {
        event.preventDefault();
        if (selectedFile) {
            setVideo(selectedFile);
            console.log("File uploaded:", selectedFile);
            navigate("/About", { video: video, setVideo: setVideo });
        }
    };

    return (
        <div
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            className={`${styles.border} ${isDragging ? styles.dragging : ''}`}
        >
            <h2 className={styles.headline}>Upload Video</h2>
            <div className={styles.dropzone}>
                <h3 className={styles.options}>Choose a file or drag & drop it here</h3>
                <h3 className={styles.extentions}>.MP4, .MOV, .AVI, .MKV, .WEBM, .OGG, .FLV, .WMV, .3GP</h3>
                <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center'}}>
                    <img src='/upload2.png' className={styles.image} alt="Upload" />
                    {/* <input type="file" accept="video/*" onChange={handleFileChange} className={styles.input} /> */}
                    <input className="form-control" variant="outline-light" accept="video/*" type="file" id="formFile" onChange={handleFileChange} style={{margin:'10px', backgroundColor:'transparent'}}/>
                    <Button className={styles.button} variant="outline-light" onClick={handleSubmit}>Upload</Button>
                </div>
            </div>
        </div>
    );
}

export default Upload;
