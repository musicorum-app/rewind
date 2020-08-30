import React, {forwardRef, useImperativeHandle} from "react";
import Section from "../components/Section";
import {Typography, Box} from "@material-ui/core";
import {RewindData} from "../api/interfaces";
import logo from '../assets/logo.svg'
import styled from "styled-components";
import {gsap, TimelineMax} from 'gsap';
import CustomEase from 'gsap/CustomEase'

gsap.registerPlugin(CustomEase)

const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December']

const cubeSize = 130

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
`

const Face = styled.div`
  font-weight: 900;
  color: #FD0F57;
  font-size: 112px;
  line-height: 130px;
  position: absolute;
  top: 0px;
  left: 50vw;
  background: black;
  width: 100%;
  text-transform: uppercase;
`

const transform = `translateZ(${cubeSize / 2}px)`

const FaceEven = styled(Face)`
  color: white;
`

const Front = styled(Face)`
  transform: translateX(-50%) translateZ(${cubeSize / 2}px) translateY(-${cubeSize / 2}px);
`

const Bottom = styled(FaceEven)`
  transform: rotateX(-90deg) translateX(-50%);
`

const Back = styled(Face)`
  transform: rotateX(180deg) translateX(-50%) ${transform} translateY(${cubeSize / 2}px);
`

const Top = styled(FaceEven)`
  transform: rotateX(90deg) translateZ(${cubeSize}px) translateX(-50%);
`

const MonthsAnimation: React.FC<{
  data: RewindData,
  ref?: React.Ref<HTMLDivElement>,
  onEnd?: () => void;
}> = forwardRef(({onEnd, data}, ref) => {

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
    start
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
