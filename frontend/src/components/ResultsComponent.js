import React from 'react';
import English from "./EnglishComponent.js";
import Fsw from "./FswComponent.js";
import Vocal from "./VocalComponent.js";
import PropTypes from "prop-types";

import './swiper.css';
import 'swiper/css/effect-coverflow';
import 'swiper/css/pagination';
import 'swiper/css/navigation';
import './index.css';
import './ResultsComponent.module.css';
import styles from "./ResultsComponent.module.css";

import { Swiper, SwiperSlide } from 'swiper/react';
import { EffectCoverflow, Navigation } from 'swiper/modules';


const ResultsComponent = ({ className = "", english, fsw, vocal, example }) => {

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
            <English translation={english} example={example}/>
          </SwiperSlide>
          <SwiperSlide>
            <Vocal translation={vocal} example={example}/>
          </SwiperSlide>
          <SwiperSlide>
            <Fsw translation={fsw} example={example}/>
          </SwiperSlide>


          <SwiperSlide>
            <English translation={english} example={example}/>
          </SwiperSlide>
          <SwiperSlide>
            <Vocal translation={vocal} example={example}/>
          </SwiperSlide>
          <SwiperSlide>
            <Fsw translation={fsw} example={example}/>
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

ResultsComponent.propTypes = {
  className: PropTypes.string,
};

export default ResultsComponent;


