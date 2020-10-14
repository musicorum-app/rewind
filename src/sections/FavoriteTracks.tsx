import React, {forwardRef, useEffect, useImperativeHandle, useState} from "react";
import Section from "../components/Section";
import {RewindData} from "../api/interfaces";
import styled from "styled-components";
import {gsap, TimelineMax} from 'gsap';
import CustomEase from 'gsap/CustomEase'
import HeartIcon from '../assets/heart.svg'
import ParallaxWrapper from "../components/ParallaxWrapper";
import {THEME_COLOR} from "../Constants";
import {getReversed} from "../utils";

gsap.registerPlugin(CustomEase)

const Content = styled.div`
  opacity: 0;
  height: 100%;
  top: 200vh;
`

const AnimationWrapper = styled.div`
  position: absolute;
  width: 100%;
  top: 0;
  left: 0;
  display: flex;
  justify-content: center;
  align-content: center;
  flex-direction: column;
  align-items: center;
  line-height: 0px;
  height: 100%;
  font-weight: 900;
  transform: translateZ(-140px);
`

const AnimationText = styled.span`
  font-size: 120px;
  color: ${THEME_COLOR};
`

const FavoriteSubtext = styled.div`
  position: absolute;
  //width: 100%;
  //height: 100%;
  top: 50vh;
  left: 50vw;
  color: white;
  transform: translateX(-50%) translateY(60px) translateZ(-130px);
  font-size: 20px;
  opacity: 0;
  text-align: center;
  
  
  @media(max-width: 700px) {
    font-size: 18px;
  }
`

const Background = styled.div`
  position: absolute;
  height: 200vh;
  width: 200vw;
  top: -50vh;
  left: -50vw;
  background: url(${HeartIcon});
  transform: translateZ(-260px);
  background-size: 158px;
  background-position-y: 0px;
  opacity: 0;
  animation: heart-animation 18s infinite linear;
`


const FavoriteTracks: React.FC<{
  data: RewindData,
  ref?: React.Ref<HTMLDivElement>,
  onEnd?: () => void;
}> = forwardRef(({data, onEnd}, ref) => {

  const [show, setShow] = useState(false)
  const REPEATS = 7

  useEffect(() => {
    if (show) {
      const textEase = CustomEase.create("textEase", "M0,0,C0,0.658,0.084,0.792,0.15,0.846,0.226,0.908,0.272,0.976,1,1")

      const tl = new TimelineMax()
        .to('#favoriteSection', {
          // opacity: 1,
          // scale: 1,
          top: 0,
          duration: 0
        })
        .fromTo('#favoriteSection', {
          scale: .8,
          opacity: 0
        }, {
          scale: 1,
          opacity: 1,
          ease: textEase,
          duration: 1
        })
        .fromTo('.favoriteTracks-animationNode', {
          lineHeight: 0
        }, {
          lineHeight: '100px',
          ease: textEase,
          duration: 2.8
        }, .4)

      const number = (7 - 1) / 2
      const arr = new Array(number).fill(1).map((_, i) => i)
      const firstNodes = getReversed([...arr]).map(v => `#favoriteTracks-animationNode-${v}`)
      const lastNodes = [...arr].map(v => `#favoriteTracks-animationNode-${v + 4}`)

      const duration = .05
      const stagger = .07
      const position = 1.2
      const positionGap = 0.2

      tl.to(firstNodes, {
        color: 'white',
        duration: duration,
        stagger: stagger
      }, position)
        .to(lastNodes, {
          color: 'white',
          duration: duration,
          stagger: stagger
        }, position)
        .to(firstNodes, {
          color: 'transparent',
          duration: duration,
          stagger: stagger
        }, position + positionGap)
        .to(lastNodes, {
          color: 'transparent',
          duration: duration,
          stagger: stagger
        }, position + positionGap)
        .to('#favoriteTracks-animationNode-3', {
          scale: 1.28,
          ease: textEase,
          duration: .8
        }, position + positionGap)
        .to('#favoriteSubtext', {
          // scale: 2,
          opacity: 1,
          duration: 2
          // ease: textEase
        }, position + positionGap + .8)
        .to('#favoriteBackground', {
          opacity: 0.18,
          duration: 2
        }, position + positionGap + .8)

      tl.to({}, {
        duration: .5,
        onComplete: () => {
          if (onEnd) onEnd()
        }
      })
    }
  }, [show])

  const animateEnd = () => {
    return new Promise(resolve => {
      const tl = new TimelineMax()
      tl.to('#favoriteSection', {
        scale: .8,
        opacity: 0,
        duration: .6,
        onComplete: () => {
          resolve()
          setShow(false)
        }
      })
        .to('#favoriteSection', {
          top: '100vh',
          duration: 0
        })
      console.log('Favorites end')
    })
  }

  const start = () => {
    console.log('Starting favorites')
    setShow(true)
  }

  // @ts-ignore
  useImperativeHandle(ref, () => ({
    start,
    animateEnd
  }))

  // const date = new Date(data.firstTrack.listenedAt).toLocaleDateString()

  return show ? <Section>
    <Content id="favoriteSection">
      <ParallaxWrapper>
        <Background id="favoriteBackground" />
        <AnimationWrapper>
          {
            new Array(REPEATS).fill(1).map((_, i) =>
              <AnimationText key={i} className="favoriteTracks-animationNode" id={`favoriteTracks-animationNode-${i}`}>
                {
                  data.lovedTracks.length.toLocaleString()
                }
              </AnimationText>
            )
          }
        </AnimationWrapper>
        <FavoriteSubtext id="favoriteSubtext">
          is how many tracks you loved this year
        </FavoriteSubtext>
      </ParallaxWrapper>
    </Content>
  </Section> : null
})

export default FavoriteTracks
