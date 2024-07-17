import React from 'react';
import English from "./EnglishComponent";
import Fsw from "./FswComponent";
import Vocal from "./VocalComponent.js";
import PropTypes from "prop-types";

// import 'swiper/css';
import './swiper.css';
import 'swiper/css/effect-coverflow';
import 'swiper/css/pagination';
import 'swiper/css/navigation';
import './index.css';
import './FrameComponent.module.css';
import styles from "./FrameComponent.module.css";

import { Swiper, SwiperSlide } from 'swiper/react';
import { EffectCoverflow, Navigation } from 'swiper/modules';


const FrameComponent = ({ className = "", english, fsw, vocal }) => {
  
  return (
    <div className={[styles.frameWrapper, className].join(" ")}>
      <div className={styles.frameParent}>
        <Swiper
          effect={'coverflow'}
          grabCursor={true}
          centeredSlides={true}
          loop={true}
          slidesPerView={'auto'}
          coverflowEffect={{
            rotate: 0,
            stretch: 0,
            depth: 100,
            modifier: 2.5,
          }}
          navigation={{
            nextEl: '.swiper-button-next',
            prevEl: '.swiper-button-prev',
            clickable: true,
          }}
          modules={[EffectCoverflow, Navigation]}

          className="swiper_container"
        >


          <SwiperSlide>
            <English translation={english} />
          </SwiperSlide>
          <SwiperSlide>
            <Vocal translation={vocal} />
          </SwiperSlide>
          <SwiperSlide>
            <Fsw translation={fsw} />
          </SwiperSlide>

          
          <SwiperSlide>
            <English translation={english} />
          </SwiperSlide>
          <SwiperSlide>
            <Vocal translation={vocal} />
          </SwiperSlide>
          <SwiperSlide>
            <Fsw translation={fsw} />
          </SwiperSlide>
          




          <div className="slider-controler">
            <div className="swiper-button-prev slider-arrow">
              <ion-icon name="arrow-back-outline"></ion-icon>
            </div>
            <div className="swiper-button-next slider-arrow">
              <ion-icon name="arrow-forward-outline"></ion-icon>
            </div>
          </div>
        </Swiper>
      </div>
    </div>
  );
};

FrameComponent.propTypes = {
  className: PropTypes.string,
};

export default FrameComponent;


