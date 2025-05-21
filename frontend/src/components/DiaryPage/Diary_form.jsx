import React, { useState, useEffect } from "react";
import axios from "axios";
import styled from "styled-components";
import Emo_face from "../DiaryPage/Emo_face";

const FormWrapper = styled.form`
  margin: 0 auto;
  width: 90%;
  position: relative;
  min-height: 300px;
  border: none;
  }
`;

const StyledTextArea = styled.textarea`
  width: 100%;
  min-height: 200px;
  box-sizing: border-box;
  border: none;
  outline: none;
  font-family: "Inter", sans-serif;
  font-size: 16px;
  padding: 1rem;
  resize: vertical;
  background-color: transparent;
  &:disabled {
    background-color: transparent;
  }
`;

const SubmitButton = styled.button`
  width: 80vw;
  max-width: 400px;
  padding: 1.2rem 1rem;
  font-size: 16px;
  background-color: var(--color-dwblue);
  color: white;
  border: none;
  border-radius: 2rem;
  cursor: pointer;
  position: fixed;
  left: 50%;
  transform: translateX(-50%);
  bottom: 6rem;
  z-index: 1;
`;

const SongResultWrapper = styled.div`
  position: fixed;
  left: 50%;
  transform: translateX(-50%);
  top: 55%;
  width: 100vw;
  height: 100vh;
  background: white;
  border-radius: 1rem;
  padding: 1rem;
  z-index: 1;
`;
const LoadingOverlay = styled.div`
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  background: gray;
  opacity: 0.8;
  color: white;
  padding: 1rem 2rem;
  border-radius: 25px;
  z-index: 2;
  font-size: 15px;
`;

const DiaryForm = ({ date }) => {
  const [content, setContent] = useState("");
  const [result, setResult] = useState(null);
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  // 1) 기존 일기 데이터 불러올 때
  useEffect(() => {
    const fetchDiary = async () => {
      try {
        const response = await axios.get(
          `http://localhost:5000/api/diary/${date}`
        );

        if (response.status === 200) {
          setContent(response.data.diary || "");
          setResult(response.data.result || null);
          setSubmitted(response.data.submitted || false); // 서버가 보내주면 반영
        }
      } catch (error) {}
    };

    fetchDiary();
  }, [date]);

  // 2) 제출 후 저장
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await axios.post("http://localhost:5000/api/diary", {
        date,
        content,
      });

      setResult(response.data.result);
      setSubmitted(response.data.submitted ?? true);
      console.log("일기 DB에 저장 완료");
      console.log("감정분석, 노래추천 결과:", response.data);
    } catch (error) {
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {loading && <LoadingOverlay>음악 추천받는 중...</LoadingOverlay>}{" "}
      <FormWrapper onSubmit={handleSubmit}>
        <StyledTextArea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="오늘 당신의 감정을 적어보세요."
          disabled={submitted}
        />

        {submitted ? (
          <SongResultWrapper>
            <Emo_face result={result} date={date} />
          </SongResultWrapper>
        ) : (
          <SubmitButton type="submit">오늘, 당신을 위한 음악! ◀</SubmitButton>
        )}
      </FormWrapper>
    </>
  );
};

export default DiaryForm;
