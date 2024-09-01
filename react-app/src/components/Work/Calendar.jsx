import { useState, useEffect } from "react";
import "../../index.css";
import "./Work.css";



function Calendar() {
  const [currentDate, setDate] = useState(null)

  const GenerateCalendar = (month, year) => {
    const start = new Date(year, month, 1)
    console.log(start)
    const dayIndex = start.getDay()

    for (let i = 0; i < 6; i++) {
      for (let j = 0; j < 7; j++) {
        if (i === 1 && j === dayIndex) {
          console.log(dayIndex)
        } 
      }
    }
  }
  
  GenerateCalendar(8, 2024)
  return (
    <>
      <div className="calendar-container">
        <div className="calendar">
          <div className="calendar-header">
            <button className="prev">&#60;</button>
            <div>
              <p className="year">2024</p>
              <h2 className="calendar-month">September</h2>
            </div>
            <button className="next">&#62;</button>
          </div>
          <div className="calendar-dates">
            <p>Sun</p>
            <p>Mon</p>
            <p>Tue</p>
            <p>Wed</p>
            <p>Thu</p>
            <p>Fri</p>
            <p>Sat</p>
            <p>1</p>
            <p>2</p>
            <p>3</p>
            <p>4</p>
            <p>5</p>
            <p>6</p>
            <p>7</p>
            <p>8</p>
            <p>9</p>
            <p>10</p>
            <p>11</p>
            <p>12</p>
            <p>13</p>
            <p>14</p>
            <p>15</p>
            <p>16</p>
            <p>17</p>
            <p>18</p>
            <p>19</p>
            <p>20</p>
            <p>21</p>
            <p>22</p>
            <p>23</p>
            <p>24</p>
            <p>25</p>
            <p>26</p>
            <p>27</p>
            <p>28</p>
            <p>29</p>
            <p>30</p>
            <p>31</p>
            <p>1</p>
            <p>2</p>
            <p>3</p>
            <p>4</p>
          </div>
        </div>
      </div>
    </>
  );
}

export default Calendar;
