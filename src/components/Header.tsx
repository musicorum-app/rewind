import styled from "styled-components";
import React from "react";
import {THEME_COLOR} from "../Constants";

interface WrapperProps {
  absolute: boolean
}

const Wrapper = styled.div`
  padding: 40px 0px 0px 40px;
  position: ${(p: WrapperProps) => p.absolute ? 'absolute' : 'auto'};
  z-index: 20;
  
  @media(max-width: 880px) {
    padding: 30px 0px 0px 18px;  
  }
`

const Title = styled.h2`
  color: ${THEME_COLOR};
  font-weight: 900;
  font-size: 80px;
  margin: 0px;
  line-height: 61px;
  //transform: translateZ(20px);
  
  
  @media(max-width: 880px) {
    font-size: 38px;
    line-height: 43px;
  }
`
  
const SubTitle = styled.p`
  font-weight: 500;
  font-size: 28px;
  margin: 10px 0px 5px 0px;
  
  @media(max-width: 880px) {
    font-size: 15px;
  }
`

const Header: React.FC<{
  title?: string,
  notAbsolute?: boolean
}> = ({title, children, notAbsolute}) => {
  return <Wrapper absolute={!notAbsolute}>
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
