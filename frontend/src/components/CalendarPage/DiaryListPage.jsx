// DiaryListPage.jsx
import React, { useState, useEffect } from "react";
import styled from "styled-components";
import Divider from "../common/Divider";
import "../../styles/variables.css";

const Header = styled.div`
  font-family: "Jua", serif;
  color: var(--color-dwblue);
  position: relative;
  text-align: center;
  padding: 3rem;
`;

const Entry = styled.div`
  margin: 20px;
  padding-bottom: 1rem;
  font-family: "Inter", san-serif;
`;

const EntryDate = styled.div`
  font-size: 20px;
  font-weight: 900;
  color: #3e3333;
  margin-bottom: 8px;
`;

const Hashtags = styled.div`
  font-size: 15px;
  font-weight: 600;
  color: var(--color-dwblue-light);
  margin-bottom: 6px;
`;

const Keyword = styled.div`
  font-size: 15px;
  font-weight: 300;
  color: rgb(132, 132, 132);
  padding-bottom: 1rem;
`;

const DiaryListPage = ({ onBack }) => {
  const [entries, setEntries] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("http://localhost:5000/api/diary-entries") // Flask 서버 주소, 포트 맞게 설정 필요
      .then((res) => res.json())
      .then((data) => {
        setEntries(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Failed to fetch diary entries:", err);
        setLoading(false);
      });
  }, []);

  return (
    <div>
      <Header>
        <h2>나의 감정 로그</h2>
      </Header>
      {loading ? (
        <p>불러오는 중...</p>
      ) : entries.length === 0 ? (
        <p>일기 기록이 없습니다.</p>
      ) : (
        entries.map((entry) => {
          const res = entry.result || {};
          const music = res.노래결과[0];

          return (
            <Entry key={entry.id}>
              <EntryDate>{entry.date}</EntryDate>
              <Hashtags>
                {res.최상위감정1 ?? "없음"} (
                {Math.round(parseFloat(res.최상위감정1비율 || "0") * 100)}
                %)&nbsp; {res.최상위감정2 ?? "없음"} (
                {Math.round(parseFloat(res.최상위감정2비율 || "0") * 100)}
                %)&nbsp; {res.최상위감정3 ?? "없음"} (
                {Math.round(parseFloat(res.최상위감정3비율 || "0") * 100)}%)
              </Hashtags>
              <Keyword>
                ♪ {music?.아티스트 ?? "정보 없음"} - {music?.노래제목 ?? ""}
              </Keyword>
              <Divider />
            </Entry>
          );
        })
      )}
    </div>
  );
};

export default DiaryListPage;
