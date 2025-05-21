import React from "react";
import styled from "styled-components";

// 전체 헤더 스타일
const Container = styled.header`
  width: 100%;
  display: flex;
  justify-content: flex-end;
  align-items: center;
  padding: 1.5rem;
`;

// 버튼 스타일
const BackButton = styled.button`
  background-color: transparent;
  border: none;
  padding: 0 2rem;
  cursor: pointer;

  img {
    width: 20px;
    height: 20px;
  }
`;

function CloseBtn({ onClick }) {
  const handleBack = () => {
    window.history.back();
  };

  const handleClick = (e) => {
    if (typeof onClick === "function") {
      onClick(e);
    } else if (typeof window.onCloseBtn === "function") {
      window.onCloseBtn(e);
    } else {
      handleBack();
    }
  };

  return (
    <Container>
      <BackButton onClick={handleClick}>
        <img src="../assets/close-icon.png" alt="닫기 버튼" />
      </BackButton>
    </Container>
  );
}

export default CloseBtn;
