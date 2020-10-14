import React, {forwardRef, useEffect, useImperativeHandle, useState} from "react";
import Section from "../components/Section";
import {Typography, useMediaQuery} from "@material-ui/core";
import {RewindData} from "../api/interfaces";
import styled from "styled-components";
import {gsap, TimelineMax} from 'gsap';
import CustomEase from 'gsap/CustomEase'
import ParallaxWrapper from "../components/ParallaxWrapper";

gsap.registerPlugin(CustomEase)

const mediaQueryBreak = 800

const SectionWrapper = styled.div`
  flex-direction: column;
  display: flex;
  overflow: hidden;
  width: 100%;
  justify-content: center;
  text-align: center;
  position: absolute;
  top: 200vh;
`

const createTransform = (z: number) => `translateX(-50%) translateY(-50%) translateZ(${z}px)`

const Text = styled.span`
  font-weight: 900;
  color: #FD0F57;
  font-size: 130px;
  text-align: center;
  position: absolute;
  top: 50vh;
  left: 50vw;
  transform: ${createTransform(30)};
  
  @media(max-width: ${mediaQueryBreak}px) {
    font-size: 80px;
  }
`

const OutlinedText = styled(Text)`
  -webkit-text-stroke: 2px #FD0F57;
  transform: ${createTransform(-40)};
`

const BorderTextEffect = styled(OutlinedText)`
  -webkit-text-stroke: 2px transparent;
  color: transparent;
  line-height: 0px;  
  text-align: center;
  
`

const SideText = styled.div`
  position: absolute;
  width: 100vw;
  left: 50vw;
  top: 50vh;
  transform: translateY(-50%) translateX(-50%);
  
  @media(max-width: ${mediaQueryBreak}px) {
    font-size: 18px;
  }
`

const SideTextGap = styled.div`
  height: 170px;
  
  @media(max-width: ${mediaQueryBreak}px) {
    height: 114px;
  }
`

const SplashEnd: React.FC<{
  data: RewindData,
  ref?: React.Ref<HTMLDivElement>,
  onEnd?: () => void;
}> = forwardRef(({onEnd}, ref) => {

  const [show, setShow] = useState(false)
  const [started, setStarted] = useState(false)
  const small = useMediaQuery(`(max-width: ${mediaQueryBreak}px)`)

  useEffect(() => {
    if (show && !started) {
      animate()
      setStarted(true)
    }
  }, [show])

  const animate = () => {
    const startTiming = .3
    const secondTimeGap = .05
    const outlineDelay = 3.4
    const outlineEase = CustomEase.create("custom", "M0,0,C0.084,0.61,-0.014,0.848,0.13,0.924,0.249,0.987,0.374,1,1,1")

    const positions = small ? [
      // Small size
      45, 85, 135
    ] : [
      // Normal
      80, 140, 210
    ]

    console.log(positions)

    const tl = new TimelineMax()
      .to('#splashEndSection', {
        top: 0,
        duration: 0
      })
      .fromTo('#rewindText', {
        // y: '320vh',
        scale: 1.8,
        opacity: 0,
        duration: .6,
      }, {
        opacity: 1,
        scale: 1,
        ease: "expo.inOut"
      })
      .to('.outlinedText', {
        '-webkit-text-stroke-color': '#FD0F57',
        duration: .0001
      }, startTiming)
      .to('#borderTextEffectTop1', {
        y: -positions[0],
        duration: outlineDelay,
        ease: outlineEase
      }, startTiming)
      .to('#borderTextEffectBottom1', {
        y: positions[0],
        duration: outlineDelay,
        ease: outlineEase
      }, startTiming)
      .to('#borderTextEffectTop2', {
        y: -positions[1],
        duration: outlineDelay,
        ease: outlineEase
      }, startTiming + secondTimeGap)
      .to('#borderTextEffectBottom2', {
        y: positions[1],
        duration: outlineDelay,
        ease: outlineEase
      }, startTiming + secondTimeGap)
      .to('#borderTextEffectTop3', {
        y: -positions[2],
        duration: outlineDelay,
        ease: outlineEase
      }, startTiming + (secondTimeGap * 2))
      .to('#borderTextEffectBottom3', {
        y: positions[2],
        duration: outlineDelay,
        ease: outlineEase
      }, startTiming + (secondTimeGap * 2))

    // exclude
    const excludeDelay = 2
    const excludeGap = .1
    tl.to('.r1', {
      opacity: 0,
      duration: 0
    }, startTiming + (secondTimeGap * 2) + excludeDelay + excludeGap)
      .to('.r2', {
        opacity: 0,
        duration: 0
      }, startTiming + (secondTimeGap * 2) + excludeDelay + (excludeGap * 2))
      .to('.r3', {
        opacity: 0,
        duration: 0,
        onComplete: () => {
          if (onEnd) onEnd()
        }
      }, startTiming + (secondTimeGap * 2) + excludeDelay + (excludeGap * 3))
      .to('#rewindText', {
        scale: 1.4,
        // opacity: 0,
        duration: .8,
        ease: "expo.inOut",
      }, startTiming + (secondTimeGap * 2) + excludeDelay + (excludeGap))
      .from('#splashEndSideText', {
        opacity: 0
      })
  }

  const start = () => {
    console.log('Starting splash end section')
    setShow(true)
  }

  const animateEnd = () => {
    return new Promise(resolve => {
      const tl = new TimelineMax()
      tl.to('#splashEndSection', {
        scale: .8,
        opacity: 0,
        duration: .6,
      })
        .to({}, {
          duration: .3,
          onComplete: () => {
            resolve()
          }
        }, 0)
        .to('#splashEndSection', {
          top: '200vh',
          duration: 0,
          onComplete: () => {
            setShow(false)
            setStarted(false)
          }
        })
      console.log('Splash end section end')
    })
  }

  // @ts-ignore
  useImperativeHandle(ref, () => ({
    start,
    animateEnd
  }))

  const text = '2020'

  const zGapInit = 10
  const zGap = 85

  return show ? <Section center>
    <SectionWrapper id="splashEndSection">
      <ParallaxWrapper>
        <BorderTextEffect
          id="borderTextEffectTop1"
          className="outlinedText r1"
          style={{
            transform: createTransform(-(zGapInit + zGap))
          }}
        >
          {text}
        </BorderTextEffect>
        <BorderTextEffect
          id="borderTextEffectBottom1"
          className="outlinedText r1"
          style={{
            transform: createTransform(-(zGapInit + zGap))
          }}
        >
          {text}
        </BorderTextEffect>

        <BorderTextEffect
          id="borderTextEffectTop2"
          className="outlinedText r2"
          style={{
            transform: createTransform(-(zGapInit + zGap * 2))
          }}
        >
          {text}
        </BorderTextEffect>
        <BorderTextEffect
          id="borderTextEffectBottom2"
          className="outlinedText r2"
          style={{
            transform: createTransform(-(zGapInit + zGap * 2))
          }}
        >
          {text}
        </BorderTextEffect>

        <BorderTextEffect
          id="borderTextEffectTop3"
          className="outlinedText r3"
          style={{
            transform: createTransform(-(zGapInit + zGap * 3))
          }}>
          {text}
        </BorderTextEffect>
        <BorderTextEffect
          id="borderTextEffectBottom3"
          className="outlinedText r3"
          style={{
            transform: createTransform(-(zGapInit + zGap * 3))
          }}>
          {text}
        </BorderTextEffect>


        <Text id="rewindText">
          {text}
        </Text>

        <SideText id="splashEndSideText">
          <Typography variant="h4" style={{fontSize: 'inherit'}}>
            ...and that was your
          </Typography>
          <SideTextGap>{" "}</SideTextGap>
          <Typography variant="h4" style={{fontSize: 'inherit'}}>
            on music
          </Typography>
        </SideText>
      </ParallaxWrapper>
    </SectionWrapper>
  </Section> : null
})

SplashEnd.defaultProps = {
  onEnd: () => {
  }
}

export default SplashEnd
