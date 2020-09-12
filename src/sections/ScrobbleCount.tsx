import React, {forwardRef, useEffect, useImperativeHandle, useState} from "react";
import Section from "../components/Section";
import {Typography, Box} from "@material-ui/core";
import {RewindData} from "../api/interfaces";
import logo from '../assets/logo.svg'
import styled from "styled-components";
import {gsap, TimelineMax} from 'gsap';
import CustomEase from 'gsap/CustomEase'
import ParallaxWrapper from "../components/ParallaxWrapper";

gsap.registerPlugin(CustomEase)

const SectionWrapper = styled.div`
  flex-direction: column;
  display: flex;
  overflow: hidden;
  width: 100vw;
  height: 100vh;
  justify-content: center;
  text-align: center;
  perspective: 1000px;
  position: absolute;
  top: 0px;
  left: 0px;
`

const CarouselWrapper = styled.div`
  position: absolute;
  top: 50vh;
  transform:  translateX(-50%) translateY(-50%);
  perspective: 800px;
`

const Carousel = styled.div`
  transform-style: preserve-3d;
  display: flex;
  flex-direction: column;
  line-height: 124px;
  transform: translateY(50vh)
  
`

const CarouselItem = styled.span`
  font-weight: 900;
  color: #FD0F57;
  font-size: 130px;
  text-align: center;
  position: absolute;
  transform: translateY(-50%) translateX(-50%);
  left: 50vw;
  background-color: black;
  opacity: 0;
  
  &:nth-child(even) {
    color: white;
  }
`

const CarouselBox = styled.div`
  position: absolute;
  width: 100%;
  top: 50vh;
  opacity: 1;
  height: ${130 * 3}px;
  transform: translateY(-50%) translateZ(300px);
  background: linear-gradient(0deg, rgba(0,0,0,1) 0%, rgba(255,255,255,0) 40%, rgba(245,245,245,0) 60%, rgba(0,0,0,1) 100%);
`

const BottomTextBox = styled.div`
  font-size: 30px;
  position: absolute;
  left: 50vw;
  transform: translateX(-50%) translateY(80px);
  top: 50vh;
  overflow: hidden;
`

const BottomText = styled.span`
  position: relative;
  opacity: 0;
  //top: -40px
`

const ImageBase = styled.img`
  position: absolute;
  width: 300px;
  height: 300px;
  border-radius: 4px;
  opacity: 0;
  z-index: -30;
`

const LeftImage = styled(ImageBase)`
  left: 10vw;
  top: calc(87vh - 300px);
  transform: translateZ(-70px);
`

const RightImage = styled(ImageBase)`
  right: 18vw;
  top: 20vh;
  transform: translateZ(-100px);
`

const ScrobbleCount: React.FC<{
  data: RewindData,
  ref?: React.Ref<HTMLDivElement>,
  onEnd?: () => void;
}> = forwardRef(({onEnd, data}, ref) => {

  const [show, setShow] = useState(false)

  useEffect(() => {
    const outlineEase = CustomEase.create("ease2", "M0,0,C0.084,0.61,-0.014,0.848,0.13,0.924,0.249,0.987,0.374,1,1,1")
    if (show) {
      const nodesToExclude = Array(7)
        .fill('#carouselNode-')
        .map((v, i) => v + (i + 1))

      const tl = new TimelineMax()
        .to('#scrobbleWrapper', {
          top: '0vh',
          duration: 0
        })
        .to('#scrobbleWrapper', {
          opacity: 1,
        })
        .to('.carouselNode', {
          opacity: 1,
          duration: 0.5
        }, 0)
        .to('#carousel', {
          rotateX: `${360 * 2}`,
          duration: 4,
          ease: "power4.out"
        }, 0)
        .to(nodesToExclude, {
          opacity: 0,
          duration: 0
        }, 3.7)
        .to('#bottomText', {
          opacity: 1
        }, 3.7)
        .to('#carouselBox', {
          opacity: 0,
          duration: 0
        }, 3.7)
        .to('.carouselNode', {
          background: 'transparent',
          duration: 0
        }, 3.7)
        .to('.counterBackgroundImage', {
          opacity: 0.4
        }, 3.81)
        .to({}, {
          duration: 1,
          onComplete: () => {
            if (onEnd) onEnd()
          }
        })
    }
  }, [show])

  const start = () => {
    console.log('Starting')

    setShow(true)
  }

  const animateEnd = () => {
    return new Promise(resolve => {
      new TimelineMax().to('#scrobbleWrapper', {
        opacity: 0
      })
        .to('#scrobbleWrapper', {
          top: '100vh',
          duration: 0,
          onComplete: () => {
            resolve()
            setShow(false)
          }
        })

    })
  }

  // @ts-ignore
  useImperativeHandle(ref, () => ({
    start,
    animateEnd
  }))

  const getBound = (i: number): number => {
    return Math.round(i * (0.3 + i))
  }

  const {scrobbles} = data.stats

  const texts = Array(8)
    .fill(scrobbles)
    .map((n, i) => Math.round(n - i))
    .map((n, i) => i === 7 ? n + 8 : n)
    .map(n => n.toLocaleString())

  return show ? <Section center>
    <SectionWrapper id="scrobbleWrapper">
      <ParallaxWrapper>
        {/*<CarouselWrapper>*/}
        <Carousel id="carousel">
          {
            texts.map((text, i) =>
              <CarouselItem key={i} id={`carouselNode-${i}`} className="carouselNode" style={{
                transform: `translateX(-50%) translateY(-50%) rotateX(${i * 45}deg) translateZ(148px)`
              }}>
                {text}
              </CarouselItem>
            )
          }
        </Carousel>
        {/*</CarouselWrapper>*/}
        <CarouselBox id="carouselBox"/>
        <BottomTextBox>
          <BottomText id="bottomText">
            is how many scrobbles you had this year
          </BottomText>
        </BottomTextBox>
        <LeftImage className="counterBackgroundImage" src={data.topTracks[2].image} draggable={false}/>
        <RightImage className="counterBackgroundImage" src={data.topTracks[0].image} draggable={false}/>
      </ParallaxWrapper>
    </SectionWrapper>
  </Section> : null
})

ScrobbleCount.defaultProps = {
  onEnd: () => {
  }
}

export default ScrobbleCount
