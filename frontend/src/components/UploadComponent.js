import React, { useEffect, useState } from 'react';
import { useNavigate } from "react-router-dom";
import { Button } from "react-bootstrap";
import styles from './UploadComponent.module.css';
import Select from 'react-select';

const options = [
    { value: 'ca', label: 'Catalan' },
    { value: 'de', label: 'German' },
    { value: 'de-CH', label: 'Swiss-German' },
    { value: 'en', label: 'English' },
    { value: 'en-NG', label: 'Nigerian' },
    { value: 'es', label: 'Spanish' },
    { value: 'fr', label: 'French' },
    { value: 'fr-BE', label: 'French-Belgian' },
    { value: 'fr-CH', label: 'Swiss-French' },
    { value: 'gr', label: 'Greek' },
    { value: 'it', label: 'Italian' },
    { value: 'ms', label: 'Malay' },
    { value: 'sv', label: 'Swedish' },
    { value: 'th', label: 'Thai' }
];

const Upload = ({ video, setVideo, language, setLanguage }) => {

    const navigate = useNavigate();
    const [selectedFile, setSelectedFile] = useState(null);
    const [isDragging, setIsDragging] = useState(false);

    useEffect(() => {
        if (video) {
            let upload = document.getElementById("upload");
            let border = document.getElementById("border");

            console.log("HIIIII", upload, border);

            border.classList.add(styles.coloredBorder)
            upload.classList.add(styles.coloredUpload)
        }
    }, [video])

    const handleFileChange = (event) => {
        const file = event.target.files[0];
        if (file) {
            setSelectedFile(file);
            setVideo(file);
        }
    };

    const handleDragOver = (event) => {
        event.preventDefault();
        event.stopPropagation();
        setIsDragging(true);
    };

    const handleDragLeave = (event) => {
        event.preventDefault();
        event.stopPropagation();
        setIsDragging(false);
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
    };

    const handleSubmit = (event) => {
        event.preventDefault();
        // if (!selectedFile) {
        //     alert("No video was uploaded!");
        // }
        // else if (!(language && language != '')) {
        //     alert("No Sign Language was selected!");
        // }

        if (selectedFile && (language && language != '')) {
            console.log("Upload!!!!!!: ", language)
            setVideo(selectedFile);
            console.log("File uploaded:", selectedFile);
            navigate("/About", { video: video, setVideo: setVideo, language: language, setLanguage: setLanguage });
        }
        else {
            let error = document.getElementById("error");
            error.classList.add(styles.error);
        }
    };

    const handleExample = (event) => {
        event.preventDefault();
        setLanguage({ value: "en", label: "English" });
        setVideo("Example");
        console.log("File: Example");
        navigate("/About", { video: video, setVideo: setVideo, language: language, setLanguage: setLanguage });
    };

    const handleChange = (option) => {
        console.log(option);
        // console.log(setLanguage);
        // console.log(setVideo);
        setLanguage(option);
    };

    const customStyles = {
        menu: (provided) => ({
            ...provided,
            overflowY: 'scroll'
        })
    };

    return (
        <>
            <div
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
                className={`${styles.border} ${isDragging ? styles.dragging : ''}`}
                id="border"
            >
                <h2 className={styles.headline}>Upload Video</h2>
                <div className={styles.dropzone}>
                    <h3 className={styles.options}>Choose a file or drag & drop it here</h3>
                    <div style={{ width: "100%", display: "flex", alignItems: 'center', justifyContent: 'center', flexDirection: 'row' }}>
                        <Select className={styles.language}
                            isSearchable
                            options={options}
                            placeholder="Select Sign Language"
                            styles={customStyles}
                            onChange={handleChange}
                        />
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center' }}>
                        <img src='/upload2.png' className={styles.image} alt="Upload" />
                        {/* <input type="file" accept="video/*" onChange={handleFileChange} className={styles.input} /> */}
                        <input className="form-control" variant="outline-light" accept="video/*" type="file" id="formFile" onChange={handleFileChange} style={{ margin: '10px', backgroundColor: 'transparent' }} />
                        <Button id="upload" className={styles.button} variant="outline-light" onClick={handleSubmit}>Upload</Button>
                    </div>
                    <Button className={styles.button} variant="outline-light" onClick={handleExample}>Example Video</Button>
                </div>
            </div>
            <span id='error' style={{fontSize: 20, color: "cyan", visibility: "hidden"}}>File or Language were not selected!</span>
        </>
    );
}

export default Upload;
