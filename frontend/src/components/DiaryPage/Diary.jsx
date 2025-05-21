import React from "react";
import { useParams } from "react-router-dom";
import styled from "styled-components";
import Close_btn from "../common/close_btn";
import Divider from "../common/Divider";
import DiaryForm from "./Diary_form";

const Container = styled.div`
  width: 100vw;
  display: flex;
  flex-direction: column;
  text-align: center;
  align-items: center;
`;

const DateHeading = styled.h2`
  font-family: "Jua", sans-serif;
  font-size: 24px;
  margin: 0.5rem 0;
  padding: 0;
`;

const Text = styled.p`
  font-size: 15px;
`;

const DiaryPage = () => {
  const { date } = useParams(); // "2025-05-18"

  const dateObj = new Date(date);
  const weekday = dateObj.toLocaleDateString("ko-KR", { weekday: "short" });

  return (
    <Container>
      <Close_btn />
      <DateHeading>{date.replace(/-/g, ".") + " " + weekday}</DateHeading>
      <Divider />
      <DiaryForm date={date} />
    </Container>
  );
};

export default DiaryPage;
