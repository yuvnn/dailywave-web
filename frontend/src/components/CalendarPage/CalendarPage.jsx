import React from "react";
import Calendar from "../CalendarPage/Calendar";
import SongRecommendation from "../common/SongRecommendation";
import CloseBtn from "../common/close_btn";

const result = {
  최상위감정1: "분노",
  최상위감정1비율: 0.83,
  최상위감정2: "상처",
  최상위감정2비율: 0.07,
  최상위감정3: "불안",
  최상위감정3비율: 0.04,
  노래결과: [
    {
      노래제목: "thirsty",
      아티스트: "aspea",
      앨범표지: "/assets/album_images/36416114.jpg",
      유사도: 0.999,
    },
  ],
};

const CalendarPage = () => {
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        width: "100vw",
        height: "100vh",
        overflow: "hidden",
        marginTop: "1rem",
      }}
    >
      {/* 이후 설정버튼 추가 */}
      <div style={{ padding: "20px" }}></div>
      {/* 캘린더 */}
      <Calendar />
      {/* 하단 회색 배경 영역 */}
      <div
        style={{
          background: "#eeeeee",
          display: "flex",
          justifyContent: "center",
        }}
      >
        {/* 곡 추천 영역 (큰 원) */}
        <div
          style={{
            width: "150vw",
            backgroundColor: "#ffffff",
            borderRadius: "50%",
            position: "relative",
            top: 0,
            display: "flex",
            justifyContent: "center",
            alignItems: "flex-start",
            paddingTop: "2rem",
          }}
        >
          {/* 곡 추천 콘텐츠 */}
          <div
            style={{
              width: "65vw",
              padding: "3rem",
            }}
          >
            <SongRecommendation result={result} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default CalendarPage;
