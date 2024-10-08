import React, { useState } from 'react'
import "bootstrap/dist/css/bootstrap.min.css";
import { Button } from "react-bootstrap";
import PropTypes from "prop-types";
import { saveAs } from 'file-saver';
import styles from "./DetailsComponent.module.css";
import VideoComponent from './VideoComponent';

const DetailsComponent = ({ className = "", video, result, skeletonVideo = null, example = false, language = 'English (American)' }) => {

  const [showMenu, setShowMenu] = useState(false);
  const toggleMenu = () => {
    setShowMenu(!showMenu);
  };

  const closeMenu = () => {
    setShowMenu(false);
  };


  const onDownloadResult = async () => {
    if (example) {
      const link = document.createElement('a');
      link.href = "/result_example.mp4";
      link.download = 'result.mp4';
      link.click();
      URL.revokeObjectURL("/result_example.mp4");
    }
    else if (result) {
      console.log("Downloading...");
      const byteCharacters = atob(result);
      const byteNumbers = new Array(byteCharacters.length);
      for (let i = 0; i < byteCharacters.length; i++) {
        byteNumbers[i] = byteCharacters.charCodeAt(i);
      }
      const byteArray = new Uint8Array(byteNumbers);
      const blob = new Blob([byteArray], { type: 'video/mp4' });
      saveAs(blob, video.name);
    }
    else {
      console.log("Not finished...");
    }
  }


  const onDownloadSkeleton = async () => {
    if (example) {
      const link = document.createElement('a');
      link.href = "/skeleton.mp4";
      link.download = 'skeleton.mp4';
      link.click();
      URL.revokeObjectURL("/skeleton.mp4");
    }
    else if (skeletonVideo) {
      console.log("Downloading...");
      const fileURL = URL.createObjectURL(skeletonVideo);
      const link = document.createElement("a");
      link.href = fileURL;
      link.download = skeletonVideo.name;
      document.body.appendChild(link);
      link.click();
      URL.revokeObjectURL(fileURL);
      document.body.removeChild(link);
    }
    else {
      console.log("Not finished...");
    }
  }

  return (
    <div className={[styles.frameParent, className].join(" ")}>
      <div className={styles.videoPlayerParent}>

        <VideoComponent video={video} skeletonVideo={skeletonVideo} example={example} />
        <div className={styles.frameWrapper}>
          <div className={styles.frameGroup}>
            <div className={styles.frameContainer}>
              <div className={styles.detailsParent}>
                <h2 className={styles.details}>Details</h2>
                <h2 className={styles.details1}>Details</h2>
              </div>
            </div>
            <div className={styles.vectorParent}>
              <img className={styles.frameChild} alt="" src="/vector-1.svg" />
              <div className={styles.table}>
                <div className={styles.frameDiv}>
                  <div className={styles.frameParent1}>
                    <div className={styles.titleParent}>
                      <b className={styles.title}></b>
                    </div>
                  </div>
                </div>
                <div className={styles.list}>
                  <div className={styles.nameParent}>
                    <div className={styles.name}>Name:</div>
                    <div className={styles.parent}>
                      {video ? (
                        <div className={styles.div1}>{video.name}</div>
                      ) : (
                        <div className={styles.div1}>Empty</div>
                      )
                      }
                    </div>
                  </div>
                  <div className={styles.sizeParent}>
                    <div className={styles.size}>Size:</div>
                    <div className={styles.group}>
                      {video ? (
                        <div className={styles.div1}>{(video.size / 1000).toFixed(1) + ' KB'}</div>
                      ) : (
                        <div className={styles.div1}>Empty</div>
                      )
                      }
                    </div>
                  </div>
                  <div className={styles.ownerParent}>
                    <div className={styles.owner}>Type:</div>
                    <div className={styles.container}>
                      {video ? (
                        <div className={styles.div1}>{video.type}</div>
                      ) : (
                        <div className={styles.div1}>Empty</div>
                      )
                      }
                    </div>
                  </div>
                  <div className={styles.nameParent}>
                    <div className={styles.name}>Sign Language:</div>
                    <div className={styles.parent}>
                      {video ? (
                        <div className={styles.div1}>{language}</div>
                      ) : (
                        <div className={styles.div1}>Empty</div>
                      )
                      }
                    </div>
                  </div>
                </div>
              </div>
              <div className={styles.dropdownContainer} onMouseLeave={closeMenu}>
                {showMenu && (
                  <div className={styles.dropdownMenu}>
                    <ul>
                      {example ? (
                        <>
                          <li><button id="resultBtn" className={styles.download} onClick={onDownloadResult}>Download Result</button></li>
                          <li><button id="skeletonBtn" className={styles.download} onClick={onDownloadSkeleton}>Download Skeleton</button></li>
                        </>
                      ) : (
                        <>
                          <li><button id="resultBtn" className={styles.download} onClick={onDownloadResult}>{result ? "Download Result" : "Loading..."}</button></li>
                          <li><button id="skeletonBtn" className={styles.download} onClick={onDownloadSkeleton}>{skeletonVideo ? "Download Skeleton" : "Loading..."}</button></li>
                        </>
                      )}
                    </ul>
                  </div>
                )}
                <Button className={styles.secondaryButton} variant="outline-light" onClick={toggleMenu} >
                  Options
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

DetailsComponent.propTypes = {
  className: PropTypes.string,
};

export default DetailsComponent;
