import React, { useState } from 'react'
import "bootstrap/dist/css/bootstrap.min.css";
import { Button } from "react-bootstrap";
import PropTypes from "prop-types";
import { saveAs } from 'file-saver';
import styles from "./FrameComponent2.module.css";

const FrameComponent2 = ({ className = "", video, result }) => {
  if (video != null)
    console.log(video);

  const [showMenu, setShowMenu] = useState(false);

  const toggleMenu = () => {
    setShowMenu(!showMenu);
  };

  const closeMenu = () => {
    setShowMenu(false);
  };

  const onDownload = async () => {
    if (result) {
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

  return (
    <div className={[styles.frameParent, className].join(" ")}>
      <div className={styles.videoPlayerParent}>
        <div className={styles.frameGroup}>
          <div className={styles.videoWrapper}>
            <h2 className={styles.video}>Video</h2>
          </div>
          {video ? (
            <video
              className={styles.videoPlayer}
              loading="lazy"
              alt=""
              autoPlay
              loop
              muted>
              <source src={URL.createObjectURL(video)} type={video.type} />
            </video>
          ) : (
            <video
              className={styles.videoPlayer}
              loading="lazy"
              alt=""
              src="/video.mp4"
              autoPlay
              loop
              muted
            />
          )}

        </div>
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
                    <div className={styles.name}>Name</div>
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
                    <div className={styles.size}>Size</div>
                    <div className={styles.group}>
                      {video ? (
                        <div className={styles.div1}>{video.size}</div>
                      ) : (
                        <div className={styles.div1}>Empty</div>
                      )
                      }
                    </div>
                  </div>
                  <div className={styles.ownerParent}>
                    <div className={styles.owner}>Type</div>
                    <div className={styles.container}>
                      {video ? (
                        <div className={styles.div1}>{video.type}</div>
                      ) : (
                        <div className={styles.div1}>Empty</div>
                      )
                      }
                    </div>
                  </div>
                </div>
              </div>
              <div className={styles.dropdownContainer}>
                {showMenu && (
                  <div className={styles.dropdownMenu} onMouseLeave={closeMenu}>
                    <ul>
                      <li><button className={styles.download} onClick={onDownload}>Download result</button></li>
                      <li>Option 2</li>
                      <li>Option 3</li>
                    </ul>
                  </div>
                )}
                <Button className={styles.secondaryButton} variant="outline-light" onClick={toggleMenu}>
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

FrameComponent2.propTypes = {
  className: PropTypes.string,
};

export default FrameComponent2;
