import styles from "../styles/ClickableIcon.module.css"

function ClickableIcon({ className, icon, onClick }) {
  return (
    <div className={`${styles.container} ${className}`} onClick={onClick}>
      <img src={icon}/>
    </div>
  )
}

export default ClickableIcon;
