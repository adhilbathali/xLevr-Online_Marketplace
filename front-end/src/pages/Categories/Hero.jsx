import styles from "./Hero.module.css"

export default function Hero(){
    return(
        <section className={styles["hero"]}>
            <h1>Explore Talents. Get things Done.</h1>
            <p>
                Discover a wide range of student-powered digital services. From design and development to content creation and turoring - all in one place.
            </p> 
        </section>
    )
}