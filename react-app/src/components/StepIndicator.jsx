import styles from "../styles/StepIndicator.module.css";

function StepIndicator({ stepRefs }) {
  return (
    <div className={styles.container}>
      <section className={styles["step-indicator"]}>
        <div className={`${styles.step} ${styles.step1} ${styles.active}`} ref={stepRefs.stepOne}>
          <div className={styles["step-icon"]}>1</div>
          <p>Cache</p>
        </div>
        <div className={`${styles["indicator-line"]} ${styles.active}`} ref={stepRefs.lineOne}></div>
        <div className={`${styles.step} ${styles.step2}`} ref={stepRefs.stepTwo}>
          <div className={styles["step-icon"]}>2</div>
          <p>FGP</p>
        </div>
        <div className={styles["indicator-line"]} ref={stepRefs.lineTwo}></div>
        <div className={`${styles.step} ${styles.step3}`} ref={stepRefs.stepThree}>
          <div className={styles["step-icon"]}>3</div>
          <p>Sdworx</p>
        </div>
      </section>
    </div>
  );
}

export default StepIndicator;

