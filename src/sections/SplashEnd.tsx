import React, {forwardRef, useImperativeHandle} from "react";
import Section from "../components/Section";
import {Typography, Box} from "@material-ui/core";
import {RewindData} from "../api/interfaces";
import logo from '../assets/logo.svg'
import styled from "styled-components";
import {gsap, TimelineMax} from 'gsap';
import CustomEase from 'gsap/CustomEase'

gsap.registerPlugin(CustomEase)

const SectionWrapper = styled.div`
  flex-direction: column;
  display: flex;
  overflow: hidden;
  width: 100%;
  justify-content: center;
  text-align: center;
`

const LogoImage = styled.img`
  width: 180px;
`

const OutlinedText = styled.span`
  -webkit-text-stroke: 2px #FD0F57;
  font-weight: 900;
  color: #FD0F57;
  font-size: 130px;
  text-align: center;
`

const BorderTextEffect = styled(OutlinedText)`
-webkit-text-stroke: 2px transparent;
  color: transparent;
  position: absolute;
  line-height: 0px;
  top: 50vh;
  left: 50vw;
  text-align: center;
  transform: translateX(-50%);
`

const SplashEnd: React.FC<{
  data: RewindData,
  ref?: React.Ref<HTMLDivElement>,
  onEnd?: () => void;
}> = forwardRef(({onEnd}, ref) => {

  const start = () => {
    console.log('Starting')
    const startTiming = .3
    const secondTimeGap = .05
    const outlineDelay = 3.4
    const outlineEase = CustomEase.create("custom", "M0,0,C0.084,0.61,-0.014,0.848,0.13,0.924,0.249,0.987,0.374,1,1,1")


    const tl = new TimelineMax()
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
        y: -80,
        duration: outlineDelay,
        ease: outlineEase
      }, startTiming)
      .to('#borderTextEffectBottom1', {
        y: 80,
        duration: outlineDelay,
        ease: outlineEase
      }, startTiming)
      .to('#borderTextEffectTop2', {
        y: -140,
        duration: outlineDelay,
        ease: outlineEase
      }, startTiming + secondTimeGap)
      .to('#borderTextEffectBottom2', {
        y: 140,
        duration: outlineDelay,
        ease: outlineEase
      }, startTiming + secondTimeGap)
      .to('#borderTextEffectTop3', {
        y: -210,
        duration: outlineDelay,
        ease: outlineEase
      }, startTiming + (secondTimeGap * 2))
      .to('#borderTextEffectBottom3', {
        y: 210,
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
        scale: 1.5,
        opacity: 0,
        duration: .6,
        ease: "expo.inOut",
      }, startTiming + (secondTimeGap * 2) + excludeDelay + (excludeGap))

  }

  // @ts-ignore
  useImperativeHandle(ref, () => ({
    start
  }))

  const text = '2020'

  return <Section center>
    <SectionWrapper>
      <BorderTextEffect id="borderTextEffectTop1" className="outlinedText r1">
        { text }
      </BorderTextEffect>
      <BorderTextEffect id="borderTextEffectBottom1" className="outlinedText r1">
        { text }
      </BorderTextEffect>

      <BorderTextEffect id="borderTextEffectTop2" className="outlinedText r2">
        { text }
      </BorderTextEffect>
      <BorderTextEffect id="borderTextEffectBottom2" className="outlinedText r2">
        { text }
      </BorderTextEffect>

      <BorderTextEffect id="borderTextEffectTop3" className="outlinedText r3">
        { text }
      </BorderTextEffect>
      <BorderTextEffect id="borderTextEffectBottom3" className="outlinedText r3">
        { text }
      </BorderTextEffect>


      <OutlinedText id="rewindText">
        { text }
      </OutlinedText>
    </SectionWrapper>
  </Section>
})

SplashEnd.defaultProps = {
  onEnd: () => {}
}

export default SplashEnd
