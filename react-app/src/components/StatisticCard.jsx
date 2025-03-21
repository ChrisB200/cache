import React, { useEffect } from "react";
import useFetch from "../hooks/useFetch";
import styles from "../styles/StatisticCard.module.css";
import upArrow from "../assets/icons/increase-green.svg";
import downArrow from "../assets/icons/decrease-red.svg";
import middleArrow from "../assets/icons/same-yellow.svg";

function StatisticCard({ title, apiRequest }) {
  const { data, refetch } = useFetch(apiRequest);

  useEffect(() => {
    refetch();
  }, []);

  const selectArrow = () => {
    if (data == null || undefined) {
      return;
    }

    if (data.percent > 0) {
      return upArrow;
    } else if (data.percent < 0) {
      return downArrow;
    } else if (data.percent === 0) {
      return middleArrow;
    }
  };

  return (
    <>
      <div className={styles.container}>
        <h3>{title}</h3>
        <div className={styles.details}>
          <p className={styles.hours}>{data?.hours.toFixed(0)}hrs</p>
          <p className={styles.pay}>£{data?.pay.toFixed(2)}</p>
        </div>
        <div className={styles.percentage}>
          <div className={styles.arrow}>
            <img src={selectArrow()} />
          </div>
          <p className="">{data?.percent.toFixed(0)}%</p>
        </div>
      </div>
    </>
  );
}

export default StatisticCard;
