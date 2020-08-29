import React, {forwardRef} from "react";
import styled from 'styled-components'

const Centered = styled.div`
  display: flex;
  justify-content: center;
  height: 100%;
  align-items: center;
`

const SectionWrapper = styled.section`
  width: 100%;
  height: 100vh;
  overflow: hidden;
  position: absolute;
  top: 0px;
`

const Section: React.FC<{
  parallax?: boolean,
  center?: boolean
}> = forwardRef(({children, parallax, center}) => {

  return <SectionWrapper>
    {
      center ? <Centered>
        {
          children
        }
      </Centered> : children
    }
  </SectionWrapper>
})

Section.defaultProps = {
  parallax: true,
  center: false
}

export default Section
