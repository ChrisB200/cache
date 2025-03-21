import React, { useState } from "react";
import { useUser } from "../hooks/contexts";
import useFetch from "../hooks/useFetch";
import styles from "../styles/WorkStatistics.module.css";
import { BASE_API_URL } from "../utils/constants";
import { dateToStr } from "../utils/helpers";
import StatisticCard from "./StatisticCard";

function WorkStatistics() {
  const [currentDate, setCurrentDate]  = useState(new Date())
  const { currentUser } = useUser()

  const thisWeek = {
    url: `${BASE_API_URL}/shifts/week?date=${dateToStr(currentDate)}`,
    method: "get",
    withCredentials: true,
    key: ["get", "shifts", "week",  "user", dateToStr(currentDate), currentUser?.id],
    cache: {
      enabled: true,
      ttl: 60
    }
  };

  const thisMonth = {
    url: `${BASE_API_URL}/shifts/month?date=${dateToStr(currentDate)}`,
    method: "get",
    withCredentials: true,
    key: ["get", "shifts", "month",  "user", dateToStr(currentDate), currentUser?.id],
    cache: {
      enabled: true,
      ttl: 60
    }
  }

  const averageWeekly = {
    url: `${BASE_API_URL}/shifts/average/week`,
    method: "get",
    withCredentials: true,
    key: ["get", "average", "shifts", "week",  "user", dateToStr(currentDate), currentUser?.id],
    cache: {
      enabled: true,
      ttl: 60
    }
  }


  return (
    <>
      <div className={styles.container}>
        <StatisticCard title={"This week"} apiRequest={thisWeek}/>
        <StatisticCard title={"This month"} apiRequest={thisMonth}/>
        <StatisticCard title={"Average weekly"} apiRequest={averageWeekly}/>
      </div>
    </>
  );
}

export default WorkStatistics;
