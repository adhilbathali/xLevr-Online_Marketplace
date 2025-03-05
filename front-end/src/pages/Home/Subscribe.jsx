import React from 'react'
import styles from './Subscribe.module.css'


const Subscribe = () => {
  return (
    <div>
        <div className={styles.subscribe_container}>
            <h1>Ready to Get Started?</h1>
            <p>Join Xlever today and be part of a community that's changing how students and professionals work together</p>
            <form>
                <input type="email" placeholder="Enter your email"></input>
                <button type="submit">Subscribe</button>
            </form>
        </div>
    </div>
  )
}

export default Subscribe
