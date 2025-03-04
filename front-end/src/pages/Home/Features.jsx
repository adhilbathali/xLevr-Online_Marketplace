import React from 'react';
import style from './Features.module.css';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faGraduationCap } from "@fortawesome/free-solid-svg-icons";  // Import the specific icon

const Features = () => {
  return (
    <div className={style.feature_container}>
      <h6>Features</h6>
      <h1>Why Choose Xlever?</h1>
      <p>Our platform offers unique benefits for both students and professionals</p>
      <div className={style.feature_content_container}>
      <div className={style.feature_contents}>
        
        <div className={style.content}>
          <FontAwesomeIcon className={style.icon} icon={faGraduationCap} /> {/* Use the imported icon */}
          <div className={style.content_text}>
            <h5>Easy to Use</h5>
            <p>Our platform is designed to be user-friendly and intuitive</p>
          </div>
        </div>

        <div className={style.content}>
          <FontAwesomeIcon className={style.icon} icon={faGraduationCap} /> {/* Use the imported icon */}
          <div className={style.content_text}>
            <h5>Easy to Use</h5>
            <p>Our platform is designed to be user-friendly and intuitive</p>
          </div>
        </div>

        <div className={style.content}>
          <FontAwesomeIcon className={style.icon} icon={faGraduationCap} /> {/* Use the imported icon */}
          <div className={style.content_text}>
            <h5>Easy to Use</h5>
            <p>Our platform is designed to be user-friendly and intuitive</p>
          </div>
        </div>
      </div>
      <div className={style.feature_contents}>
        <div className={style.content}>
          <FontAwesomeIcon className={style.icon} icon={faGraduationCap} /> {/* Use the imported icon */}
          <div className={style.content_text}>
            <h5>Easy to Use</h5>
            <p>Our platform is designed to be user-friendly and intuitive</p>
          </div>
        </div>

        <div className={style.content}>
          <FontAwesomeIcon className={style.icon} icon={faGraduationCap} /> {/* Use the imported icon */}
          <div className={style.content_text}>
            <h5>Easy to Use</h5>
            <p>Our platform is designed to be user-friendly and intuitive</p>
          </div>
        </div>

        <div className={style.content}>
          <FontAwesomeIcon className={style.icon} icon={faGraduationCap} /> {/* Use the imported icon */}
          <div className={style.content_text}>
            <h5>Easy to Use</h5>
            <p>Our platform is designed to be user-friendly and intuitive</p>
          </div>
        </div> 
      </div>
      </div>
      
    </div>
  );
}

export default Features;