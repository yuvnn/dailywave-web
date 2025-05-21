// components/DiaryPage/EmotionDetailModalWrapper.js

import React, { useState } from "react";
import Modal from "./Emo_modal.jsx";
import styled from "styled-components";

const ModalButton = styled.button`
  font-weight: 400;
  font-size: 12px;
  background: none;
  border: none;
  padding: 0 1rem;
  cursor: pointer;
  transition: background 0.2s;
  text-decoration: underline;
`;

const Emo_btn = ({ result, date }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <>
      <ModalButton onClick={() => setIsModalOpen(true)}>
        오늘의 감정 더 자세히 보기
      </ModalButton>
      {isModalOpen && (
        <Modal
          open={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          result={result}
          date={date}
        />
      )}
    </>
  );
};

export default Emo_btn;
