import styled from "styled-components";
import SongRecommendation from "../common/SongRecommendation";
import Modal_btn from "./Emo_btn";

const koreanToEnglish = {
  분노: "anger",
  슬픔: "sad",
  불안: "anxious",
  상처: "hurt",
  당황: "confused",
  기쁨: "happy",
};

const colorMap = {
  anger: "var(--color-angry)",
  sad: "var(--color-sad)",
  anxious: "var(--color-anxious)",
  hurt: "var(--color-hurt)",
  confused: "var(--color-confused)",
  happy: "var(--color-happy)",
};

const faceMap = {
  anger: "｀д´",
  sad: "ᴗ_ᴗ̩̩",
  anxious: "**;;",
  hurt: ";_;",
  confused: "O_O",
  happy: "^-^",
};

const RoundedBox = styled.div`
  font-family: "Inter", sans-serif;
  font-weight: 900;
  color: black;

  box-sizing: border-box;
  background: ${({ mood }) => colorMap[mood] || colorMap.sad};
  border-radius: 15rem;
  width: 100%;
  height: 80%;
  padding: 2rem;

  display: flex;
  flex-direction: column;
  align-items: center;
`;

const FaceDisplay = styled.div`
  font-size: 4rem;
`;

const SongResultWrapper = styled.div`
  margin-top: 1rem;
  width: 65vw;
  max-width: 400px;
  background: none;
  border-radius: 1rem;
  z-index: 1000;
`;

const EmoFace = ({ result, date }) => {
  const koreanMood = result?.최상위감정1 || "분노";
  const mood = koreanToEnglish[koreanMood] || "anger";
  const face = faceMap[mood] || faceMap.sad;

  return (
    <>
      <RoundedBox mood={mood}>
        <FaceDisplay>{face}</FaceDisplay>
        <Modal_btn result={result} date={date} />
        <SongResultWrapper>
          <SongRecommendation result={result} />
        </SongResultWrapper>
      </RoundedBox>
    </>
  );
};
export default EmoFace;
