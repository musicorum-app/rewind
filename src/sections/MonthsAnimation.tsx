import React, {forwardRef, useImperativeHandle} from "react";
import Section from "../components/Section";
import {RewindData} from "../api/interfaces";
import styled from "styled-components";
import {gsap, TimelineMax} from 'gsap';
import CustomEase from 'gsap/CustomEase'
import {useTranslation} from "react-i18next";

gsap.registerPlugin(CustomEase)

const monthsShort = ['jan', 'feb',  'mar',  'apr',  'may',  'jun',  'jul',  'aug',  'sep',  'oct',  'nov',  'dec']

const cubeSize = 120
const cubeSizeSmall = 58
const mediaQueryBreak = 700

const Perspective = styled.div`
  perspective: 700px;
  display: flex;
  text-align: center;
  justify-content: center;
  width: 100%;
  height: 100%;
  flex-direction: column;
  transform: translateY(100vh)
`

const Cube = styled.div`
  transform-style: preserve-3d;
  transform-origin: ${cubeSize}px;
  
  @media(max-width: ${mediaQueryBreak}px) {
    transform-origin: ${cubeSizeSmall}px;
  }
`

const Face = styled.div`
  font-weight: 900;
  color: #FD0F57;
  font-size: ${cubeSize - 12}px;
  line-height: ${cubeSize}px;
  position: absolute;
  top: 0px;
  left: 50vw;
  background: black;
  width: 100%;
  text-transform: uppercase;
  
  @media(max-width: ${mediaQueryBreak}px) {
    line-height: ${cubeSizeSmall}px;
    font-size: ${cubeSizeSmall - 12}px;
  }
`

const FaceEven = styled(Face)`
  color: white;
`

const Front = styled(Face)`
  transform: translateX(-50%) translateZ(${cubeSize / 2}px) translateY(-${cubeSize / 2}px);
  
  @media(max-width: ${mediaQueryBreak}px) {
    transform: translateX(-50%) translateZ(${cubeSizeSmall / 2}px) translateY(-${cubeSizeSmall / 2}px);
  }
`

const Bottom = styled(FaceEven)`
  transform: rotateX(-90deg) translateX(-50%);
`

const Back = styled(Face)`
  transform: rotateX(180deg) translateX(-50%) translateZ(${cubeSize / 2}px) translateY(${cubeSize / 2}px);
   
  @media(max-width: ${mediaQueryBreak}px) {
    transform: rotateX(180deg) translateX(-50%) translateZ(${cubeSizeSmall / 2}px) translateY(${cubeSizeSmall / 2}px);
  }
`

const Top = styled(FaceEven)`
  transform: rotateX(90deg) translateZ(${cubeSize}px) translateX(-50%);
   
  @media(max-width: ${mediaQueryBreak}px) {
    transform: rotateX(90deg) translateZ(${cubeSizeSmall}px) translateX(-50%);
  }
`

const MonthsAnimation: React.FC<{
  data: RewindData,
  ref?: React.Ref<HTMLDivElement>,
  onEnd?: () => void;
}> = forwardRef(({onEnd, data}, ref) => {
  const { t } = useTranslation()

  const months = monthsShort.map(m => t('sections.months.' + m))

  const start = () => {
    console.log('Starting')
    const tl = new TimelineMax()
      .to('#perspective', {
        y: '-100vh',
        duration: 2.8,
        ease: 'linear'
      })
      .from('#cube', {
        duration: 3,
        rotateX: -(360 * 3),
        ease: 'linear'
      }, 0)
      .to([], {
        duration: 2,
        onComplete: () => {
          if (onEnd) onEnd()
        }
      }, 0)
  }

  // @ts-ignore
  useImperativeHandle(ref, () => ({
    start,
    animateEnd: async () => {}
  }))

  const listenedMonth = months[new Date(data.firstTrack.listenedAt).getMonth()]

  const otherMonths = months.filter(m => m !== listenedMonth)

  return <Section center>
    <Perspective id="perspective">
      <Cube id="cube">
        <Top>{otherMonths[1]}</Top>
        <Front>{listenedMonth}</Front>
        <Bottom>{otherMonths[5]}</Bottom>
        <Back>{otherMonths[10]}</Back>
      </Cube>
    </Perspective>
  </Section>
})

MonthsAnimation.defaultProps = {
  onEnd: () => {
  }
}

export default MonthsAnimation
