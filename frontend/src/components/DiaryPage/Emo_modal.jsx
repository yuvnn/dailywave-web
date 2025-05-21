import React from "react";
import ReactDOM from "react-dom";
import styled, { keyframes } from "styled-components";
import Close_btn from "../common/close_btn";
import SongRecommendation from "../common/SongRecommendation";

const colorMap = {
  분노: "var(--color-angry)",
  슬픔: "var(--color-sad)",
  불안: "var(--color-anxious)",
  상처: "var(--color-hurt)",
  당황: "var(--color-confused)",
  기쁨: "var(--color-happy)",
};

const fadeIn = keyframes`
  from { opacity: 0; transform: translate(-50%, -60%) scale(0.95);}
  to { opacity: 1; transform: translate(-50%, -50%) scale(1);}
`;

const ModalOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  box-sizing: border-box;
  overflow: hidden;
  background: rgba(0, 0, 0, 0.45);
  z-index: 999;
  backdrop-filter: blur(2px);
`;

const ModalContent = styled.div`
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  background: #fff;
  border-radius: 1.2rem;
  width: 80%;
  height: 60%;
  min-height: 420px;
  z-index: 1000;
  display: flex;
  flex-direction: column;
  align-items: center;
  font-family: "Inter", sans-serif;
  text-align: center;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.18);
  animation: ${fadeIn} 0.25s;
  box-sizing: border-box;
  overflow: hidden;
`;

const Header = styled.h2`
  font-family: "Jua", sans-serif;
  font-size: 22px;
  margin-top: -1rem;
  margin-bottom: 1.5rem;
  width: 100%;
  color: #4a2f2f;
  letter-spacing: 0.5px;
`;

const DateText = styled.span`
  color: #888;
  font-size: 15px;
  font-weight: 400;
`;
const EmotionBarContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
  width: 100%;
`;
const UserText = styled.span`
  font-weight: 400;
  b {
    color: #4a2f2f;
    font-weight: bold;
  }
`;

const EmotionRow = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
  width: 100%;
`;

const EmotionLabel = styled.div`
  font-size: 15px;
  min-width: 48px;
  margin-bottom: 0.18rem;
  color: ${({ emotion }) => colorMap[emotion] || "#888"};
  font-weight: bold;
  letter-spacing: 0.2px;
`;

const EmotionBarWrap = styled.div`
  width: 100%;
  margin-bottom: 0.7rem;
`;

const EmotionBar = styled.div`
  width: 100%;
  height: 13px;
  background-color: #f2f2f2;
  border-radius: 10px;
  overflow: hidden;
  position: relative;
  box-shadow: 0 1px 4px rgba(0, 0, 0, 0.04);

  & > div {
    height: 100%;
    width: ${({ ratio }) => `${ratio * 100}%`};
    background: ${({ emotion }) => colorMap[emotion] || "#aaa"};
    border-radius: 10px;
    transition: width 0.5s cubic-bezier(0.4, 2, 0.6, 1);
  }
`;

const Description = styled.p`
  font-size: 15px;
  margin-top: 0.5rem;
  margin-bottom: 1.5rem;
  line-height: 1.7;
  color: #444;
`;

const Highlight = styled.span`
  font-weight: bold;
  color: #4a2f2f;
`;

const Modal = ({ result, date, open, onClose }) => {
  if (!open) return null;

  const {
    최상위감정1,
    최상위감정1비율,
    최상위감정2,
    최상위감정2비율,
    최상위감정3,
    최상위감정3비율,
    노래결과,
  } = result;

  const song = 노래결과[0];
  const dateObj = new Date(date);
  const weekday = dateObj.toLocaleDateString("ko-KR", { weekday: "short" });

  return ReactDOM.createPortal(
    <div>
      <ModalOverlay onClick={onClose} />
      <ModalContent onClick={(e) => e.stopPropagation()}>
        <Close_btn onClick={onClose} />
        <Header>
          <DateText>
            {date.replace(/-/g, ".")} {weekday}
          </DateText>
          <br />
          <UserText>
            <b>길동님</b>의 감정 로그
          </UserText>
        </Header>
        {/* 감정 바 차트 */}
        <div
          style={{
            width: "80%",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            padding: "0 2rem",
          }}
        >
          {[
            { 감정: 최상위감정1, 비율: 최상위감정1비율 },
            { 감정: 최상위감정2, 비율: 최상위감정2비율 },
            { 감정: 최상위감정3, 비율: 최상위감정3비율 },
          ].map(({ 감정, 비율 }, i) => (
            <EmotionBarWrap key={i}>
              <EmotionRow>
                <EmotionLabel emotion={감정}>{감정}</EmotionLabel>
                <EmotionBar emotion={감정} ratio={비율}>
                  <div />
                </EmotionBar>
              </EmotionRow>
            </EmotionBarWrap>
          ))}
          <Description>
            오늘 하루 <Highlight>{최상위감정1}</Highlight> 감정을 느꼈던 길동님.
            <br />
            {최상위감정1}한 마음, 여기서 잠시 내려놓아도 괜찮아요. 고생했던
            하루의 끝에서 <Highlight>{song.아티스트}</Highlight>의
            <Highlight>{song.노래제목}</Highlight>와 함께 좋은 꿈을 꿔볼까요?
          </Description>
        </div>

        <SongRecommendation result={result} />
      </ModalContent>
    </div>,
    document.getElementById("modal-root")
  );
};

export default Modal;
