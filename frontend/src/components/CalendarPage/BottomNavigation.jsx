// BottomNavigation.jsx
import React, { useState } from "react";
import styled from "styled-components";
import CalendarPage from "../Pages/AppRouter";
import DiaryListPage from "./DiaryListPage";

const PageWrapper = styled.div`
  padding-bottom: 80px; /* 하단 버튼 높이만큼 공간 확보 */
`;

const FixedBottomBar = styled.div`
  position: fixed;
  bottom: 0;
  left: 0;
  width: 100%;
  background: white;
  border-top: 1px solid #ccc;
  display: flex;
  justify-content: space-around;
  padding: 1.2rem 0;
  z-index: 100;
`;

const NavButton = styled.button`
  flex: 1;
  background: none;
  border: none;
  font-size: 16px;
  font-weight: bold;
  color: ${({ active }) => (active ? "var(--color-dwblue)" : "#888")};
  cursor: pointer;
`;

const BottomNavigation = () => {
  const [page, setPage] = useState("calendar");

  return (
    <>
      <PageWrapper>
        {page === "calendar" ? <CalendarPage /> : <DiaryListPage />}
      </PageWrapper>

      <FixedBottomBar>
        <NavButton
          active={page === "calendar"}
          onClick={() => setPage("calendar")}
        >
          📅 캘린더
        </NavButton>
        <NavButton active={page === "diary"} onClick={() => setPage("diary")}>
          📓 일기목록
        </NavButton>
      </FixedBottomBar>
    </>
  );
};

export default BottomNavigation;
