import styled from "styled-components";

export const StyledBody = styled.div`
  height: 100vh;
  width: auto;
  background-color: yellowgreen;

  display: flex;
  align-items: center;
  justify-content: center;
  
  h1, p {
    margin: 0;
  }
`;

export const StyledMenu = styled.div `
  position: fixed;
  bottom: 1rem;
  right: 1rem;

  height: 3rem;
  background-color: lightblue;
  box-shadow: rgba(0, 0, 0, 0.35) 0px 5px 15px;
  border-radius: 5px;

  display: flex;
  align-items: center;
  justify-content: space-around;

  .btnText:hover {
    cursor: pointer;
    opacity: .6;
  }
`;
