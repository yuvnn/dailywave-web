import React from "react";
import styled from "styled-components";
import "../../styles/variables.css";

const StyledDivider = styled.div`
  width: 95%;
  height: 2px;
  background-color: var(--color-dwblue-light);
  opacity: 0.3;
  margin: 0.5rem auto;
`;

const Divider = () => {
  return <StyledDivider />;
};

export default Divider;
