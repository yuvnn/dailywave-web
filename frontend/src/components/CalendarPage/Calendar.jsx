// CalendarPage.jsx
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import "../../styles/Calendar.css";
import "../../styles/variables.css";

const CalendarPage = () => {
  const [date, setDate] = useState(new Date());
  const navigate = useNavigate();

  const handleDateClick = (selectedDate) => {
    const year = selectedDate.getFullYear();
    const month = String(selectedDate.getMonth() + 1).padStart(2, "0");
    const day = String(selectedDate.getDate()).padStart(2, "0");
    const formattedDate = `${year}-${month}-${day}`;
    navigate(`/diary/${formattedDate}`);
  };

  return (
    <div>
      <Calendar
        onChange={(value) => {
          setDate(value);
          handleDateClick(value);
        }}
        value={date}
        locale="en-US"
        formatShortWeekday={(locale, date) =>
          date.toLocaleDateString("en-US", { weekday: "short" }).toUpperCase()
        }
        formatMonthYear={(locale, date) => (
          <div className="year-month">
            <div className="year">{date.getFullYear()}</div>
            <div className="month">
              {String(date.getMonth() + 1).padStart(2, "0")}
            </div>
          </div>
        )}
        minDetail="month" // 'year'로 내려가는 버튼 비활성화
        maxDetail="month" // 날짜 외 다른 상세 뷰 차단
        allowPartialRange={false} // 범위 선택 차단
        selectRange={false} // 드래그 범위 선택 비활성화
      />
    </div>
  );
};

export default CalendarPage;
