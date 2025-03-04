import React from "react";
import style from "./Hero.module.css";
import { Player } from "@lottiefiles/react-lottie-player";  // ✅ Corrected Import
import hero_animation from "../../assets/Animations/hero_animation.json";

const Hero = () => {
  return (
    <div className={style.hero_container}>
      <div className={style.content_left}>
        <h1>Connect Students with Professionals</h1>
        <h6>
          Xlever helps students gain real-world experience while professionals get their work done. The perfect marketplace for design, development, and creative work.
        </h6>
        <div className={style.btns}>
          <button className={style.btn_left}>Join as Student</button>
          <button className={style.btn_right}>Post a Project</button>
        </div>
      </div>
      <div className={style.content_right}>
        <div className={style.img}>
          {/* ✅ Corrected Lottie Component */}
          <Player  classname={style.Lottie}
            src={hero_animation} 
            loop 
            autoplay 
            
          />
        </div>
      </div>
    </div>
  );
};

export default Hero;
