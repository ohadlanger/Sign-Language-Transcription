import React, { useState } from 'react';
import { useNavigate } from "react-router-dom";
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
            navigate("/About", { video:video, setVideo:setVideo });
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
                <img src='/upload_copy.png' className={styles.image} alt="Upload" />
                <input type="file" accept="video/*" onChange={handleFileChange} className={styles.input} />
                <button onClick={handleSubmit}>Upload</button>
            </div>
        </div>
    );
}

export default Upload;



// // import styles from './DragAndDropUpload.module.css';

// const DragAndDropUpload = ({ setVideo }) => {
//     const [selectedFile, setSelectedFile] = useState(null);
//     const [isDragging, setIsDragging] = useState(false);

//     const handleFileChange = (event) => {
//         const file = event.target.files[0];
//         if (file) {
//             setSelectedFile(file);
//             setVideo(file);
//         }
//     };

//     const handleDragOver = (event) => {
//         event.preventDefault();
//         event.stopPropagation();
//         setIsDragging(true);
//     };

//     const handleDragLeave = (event) => {
//         event.preventDefault();
//         event.stopPropagation();
//         setIsDragging(false);
//     };

//     const handleDrop = (event) => {
//         event.preventDefault();
//         event.stopPropagation();
//         setIsDragging(false);

//         const file = event.dataTransfer.files[0];
//         if (file) {
//             setSelectedFile(file);
//             setVideo(file);
//         }
//     };

//     const handleSubmit = (event) => {
//         event.preventDefault();
//         if (selectedFile) {
//             // Handle file upload
//             console.log("File uploaded:", selectedFile);
//         }
//     };

//     //   return (
//     //     <div>
//     //       <h2>Upload Video</h2>
//     //       <div
//     //         // className={`${isDragging ? styles.dragging : ''}`}
//     //         onDragOver={handleDragOver}
//     //         onDragLeave={handleDragLeave}
//     //         onDrop={handleDrop}
//     //       >
//     //         <input
//     //           type="file"
//     //           accept="video/*"
//     //           onChange={handleFileChange}
//     //         />
//     //         <p>Drag and drop a video file here, or click to select one.</p>
//     //       </div>
//     //       {selectedFile && (
//     //         <div>
//     //           <p>Selected file: {selectedFile.name}</p>
//     //           <button onClick={handleSubmit}>Upload</button>
//     //         </div>
//     //       )}
//     //     </div>
//     //   );


//     return (
//         <div onDragOver={handleDragOver} onDragLeave={handleDragLeave} onDrop={handleDrop}>
//             <h2 className={styles.headline}>Upload Video</h2>
//             <div className={styles.border}>
//                 <h3 className={styles.options}>Choose a file or drag & drop it here</h3>
//                 <h3 className={styles.extentions}>.MP4, .MOV, .AVI, .MKV, .WEBM, .OGG, .FLV, .WMV, .3GP</h3>
//                 <img src='/upload_copy.png' className={styles.image} />
//                 <form onSubmit={handleSubmit}>
//                     <input type="file" accept="video/*" onChange={handleFileChange} className={styles.imput} />
//                     <button type="submit">Upload</button>
//                 </form>
//             </div>
//         </div>
//     );

// };

// export default DragAndDropUpload;



// // return (
// //     <div onDragOver={handleDragOver} onDragLeave={handleDragLeave} onDrop={handleDrop}>
// //         <h2 className={styles.headline}>Upload Video</h2>
// //         <div className={styles.border}>
// //             <h3 className={styles.options}>Choose a file or drag & drop it here</h3>
// //             <h3 className={styles.extentions}>.MP4, .MOV, .AVI, .MKV, .WEBM, .OGG, .FLV, .WMV, .3GP</h3>
// //             <img src='/upload_copy.png' className={styles.image} />
// //             <form onSubmit={handleSubmit}>
// //                 <input type="file" accept="video/*" onChange={handleFileChange} className={styles.imput} />
// //                 <button type="submit">Upload</button>
// //             </form>
// //         </div>
// //     </div>
// // );
// // }
