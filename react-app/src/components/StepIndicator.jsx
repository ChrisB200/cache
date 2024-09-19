import styles from "../styles/StepIndicator.module.css";

function StepIndicator({ activeStep }) {
  return (
    <div className={styles.container}>
      <section className={styles["step-indicator"]}>
        <div
          className={`${styles.step} ${styles.step1} ${activeStep >= 1 ? styles.active : ""}`}
        >
          <div className={styles["step-icon"]}>1</div>
          <p>Cache</p>
        </div>
        <div className={`${styles["indicator-line"]} ${activeStep > 1 ? styles.active : ""}`}></div>
        <div
          className={`${styles.step} ${styles.step2} ${activeStep >= 2 ? styles.active : ""}`}
        >
          <div className={styles["step-icon"]}>2</div>
          <p>FGP</p>
        </div>
        <div className={`${styles["indicator-line"]} ${activeStep > 2 ? styles.active : ""}`}></div>
        <div
          className={`${styles.step} ${styles.step3} ${activeStep === 3 ? styles.active : ""}`}
        >
          <div className={styles["step-icon"]}>3</div>
          <p>Sdworx</p>
        </div>
      </section>
    </div>
  );
}


export default StepIndicator;

