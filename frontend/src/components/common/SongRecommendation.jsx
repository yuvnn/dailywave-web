import React, { useEffect, useRef, useState } from "react";
import styled, { keyframes } from "styled-components";
import "../../styles/variables.css";

const fadeInUp = keyframes`
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
`;

const rotateForever = keyframes`
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
`;

const RecommendationWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  background: none;
  animation: ${fadeInUp} 2s ease-out forwards;
`;

const CDContainer = styled.div`
  position: relative;
  animation: ${rotateForever} 20s linear infinite;
  width: 140%;
  aspect-ratio: 1 / 1;
  transform: translate(-50%, -50%);
`;

const CDImage = styled.img`
  position: absolute;
  object-fit: cover;
  width: 100%;
  height: 100%;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
  border-radius: 50%;
  box-shadow: 0px 0px 10px rgba(0, 0, 0, 0.3);
  z-index: 1;
`;

const CDHole = styled.div`
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
  width: 25%;
  aspect-ratio: 1 / 1;
  background-color: none;
  border-radius: 50%;
  z-index: 2;
  box-shadow: inset 0px 0px 10px rgba(0, 0, 0, 0.8);
`;

const SongInfo = styled.div`
  max-width: 200px;
  min-width: 150px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;

  font-family: "Inter", sans-serif;
  font-size: 15px;
  color: white;
  font-weight: bold;
  margin-bottom: -1.2rem;
  padding: 1.2rem 2rem;
  text-align: center;
  background-color: var(--color-dwbrown);
  border-radius: 50px;
  box-shadow: 0px 4px 4px rgba(0, 0, 0, 0.25);

  z-index: 3;
`;

const MarqueeText = styled.div`
  display: inline-block;
  white-space: nowrap;
  animation: marquee 20s linear infinite;
  text-align: center;

  @keyframes marquee {
    0% {
      transform: translateX(100%);
    }
    100% {
      transform: translateX(-100%);
    }
  }
`;

function SongRecommendation({ result }) {
  const [isOverflowing, setIsOverflowing] = useState(false);
  const textRef = useRef();

  // song과 fullText는 일단 기본값 설정
  const song = result?.노래결과?.[0];
  const fullText = song ? `${song.노래제목} - ${song.아티스트}` : "";

  useEffect(() => {
    if (
      textRef.current &&
      textRef.current.scrollWidth > textRef.current.clientWidth
    ) {
      setIsOverflowing(true);
    }
  }, [fullText]);

  if (!song) {
    return <div>추천 결과가 없습니다.</div>;
  }

  return (
    <RecommendationWrapper>
      <SongInfo ref={textRef}>
        {isOverflowing ? (
          <div style={{ width: "100%", overflow: "hidden" }}>
            <MarqueeText>{fullText}</MarqueeText>
          </div>
        ) : (
          fullText
        )}
      </SongInfo>
      <CDContainer>
        <CDImage src={song.앨범표지} alt={`${song.노래제목} 앨범 표지`} />
        <CDHole />
      </CDContainer>
    </RecommendationWrapper>
  );
}

export default SongRecommendation;
