import React from "react";
import styled from "styled-components";
import AppRouter from "./components/Pages/AppRouter"; 
import SongRecommendation from "./components/common/SongRecommendation";
import Emo_face from "./components/DiaryPage/Emo_face";
import BottomNavigation from "./components/CalendarPage/BottomNavigation";

const AppContainer = styled.div`
  width: 100vw;
  height: 100vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  box-sizing: border-box;
  overflow: hidden;
`;

const result = {
    최상위감정1: "분노",
    최상위감정1비율: 0.83,
    최상위감정2: "상처",
    최상위감정2비율: 0.07,
    최상위감정3: "불안",
    최상위감정3비율: 0.04,
    노래결과: [
      {
        노래제목: "첫만남은 ",
        아티스트: "21학번",
        앨범표지: "/assets/album_images/35391594.jpg", // ✅ 경로 맞음 (public 기준)
        유사도: 0.999
      }
    ]
};

function App() {
  return (
    <AppContainer>
      <BottomNavigation />
    </AppContainer>
  );
}

export default App;
