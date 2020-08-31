import styled from "styled-components";
import React from "react";
import {THEME_COLOR} from "../Constants";

const Wrapper = styled.div`
  padding: 40px 0px 0px 40px;
  position: absolute;
  z-index: 20;
`

const Title = styled.h2`
  color: ${THEME_COLOR};
  font-weight: 900;
  font-size: 80px;
  margin: 0px;
  line-height: 61px;
  //transform: translateZ(20px);
`

const SubTitle = styled.p`
  font-weight: 500;
  font-size: 28px;
  margin: 10px 0px 5px 0px;
`

const Header: React.FC<{
  title?: string
}> = ({title, children}) => {
  return <Wrapper>
    {
      title && <Title>
        { title }
      </Title>
    }
    <SubTitle>
      { children }
    </SubTitle>
  </Wrapper>
}

export default Header
