import React, {forwardRef, useEffect, useImperativeHandle, useState} from "react";
import Section from "../components/Section";
import {RewindData, SpotifyArtistBase} from "../api/interfaces";
import styled from "styled-components";
import {gsap, TimelineMax} from 'gsap';
import CustomEase from 'gsap/CustomEase'
import ParallaxWrapper from "../components/ParallaxWrapper";
import {THEME_COLOR} from "../Constants";
import chroma from "chroma-js";

gsap.registerPlugin(CustomEase)

const Content = styled.div`
  opacity: 0;
  height: 100%;
  top: 200vh;
  transform-style: preserve-3d;
  perspective: 1000px;
`

const LeftSideArtist = styled.div`
  position: absolute;
  top: 50vh;
  left: 0;
  transform: translate3d(0, -50%, -130px);
  width: 25vw;
  text-align: center;
  transform-style: preserve-3d;
  //transform-origin: top;
  backface-visibility: hidden;
  font-size: 20px;
`

const RightSideArtist = styled(LeftSideArtist)`
  right: 0;
  left: auto;
  //transform-origin: bottom;
`

const ArtistSide = styled.div`
  //transform: translateZ(-200px);
`

const ArtistImage = styled.img`
  width: 100%;
  border-radius: 4px;
`

const ArtistName = styled.span`
  color: ${THEME_COLOR};
  font-size: 24px;
  margin-bottom: 10px;
  font-weight: 800;
`

const MainstreamPercent = styled.div`
  position: absolute;
  left: 50vw;
  top: 50vh;
  transform: translateZ(30px) translateX(-50%) translateY(-50%);
  width: calc(50vw - 12vw - 50px);
  height: 25vw;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
`

const MainstreamPercentNumberWrapper = styled.div`
  overflow: hidden;
`

const MainstreamPercentNumber = styled.span`
  color: ${THEME_COLOR};
  font-size: 100px;
  font-weight: 900;
  position: relative;
  line-height: 80px;
  padding-bottom: 20px;
`

const ProgressBar = styled.div`
  background-color: ${chroma(THEME_COLOR).darken(4).css()};
  height: 16px;
  width: 100%;
  margin-bottom: 10px;
`

interface ProgressBarInsideProps {
  percent: number
}

const ProgressBarInside = styled.div`
  background-color: ${THEME_COLOR};
  width: ${(p: ProgressBarInsideProps) => p.percent}%;
  height: 100%;
`

const Notice = styled.div`
  position: absolute;
  left: 0;
  bottom: 0;
  padding: 24px;
`


const Mainstream: React.FC<{
  data: RewindData,
  ref?: React.Ref<HTMLDivElement>,
  onEnd?: () => void;
}> = forwardRef(({data, onEnd}, ref) => {

  const [show, setShow] = useState(false)
  const [ordered, setOrdered] = useState<SpotifyArtistBase[]>([])

  const average = ordered
    .map(a => a.popularity)
    .reduce((a, b) => a + b, 0) / ordered.length

  useEffect(() => {
    if (show) {
      const tl = new TimelineMax()
        .to('#mainstreamSection', {
          // opacity: 1,
          // scale: 1,
          top: 0,
          duration: 0
        })
        .fromTo('#mainstreamSection', {
          opacity: 0
        }, {
          scale: 1,
          opacity: 1,
          duration: 0
        })
        .from('#mainstreamSectionBar', {
          width: 0
        }, .5)
        .from('#mainstreamSectionArtistSide-1', {
          opacity: 0,
          rotateX: -170,
          duration: 1.7,
          ease: 'expo.out'
        }, .8)
        .from('#mainstreamSectionArtistSide-2', {
          opacity: 0,
          rotateX: 170,
          duration: 1.7,
          ease: 'expo.out'
        }, .8)
        .from('#mainstreamSectionNumber', {
          top: 90,
          duration: 1.2,
          ease: 'expo.out'
        }, .8)
        .from('#mainstreamSectionSubtext', {
          opacity: 0
        }, 1.5)
        .from('#mainstreamSectionNotice', {
          opacity: 0
        }, 3)


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
      tl.to('#mainstreamSection', {
        scale: .8,
        opacity: 0,
        duration: .6,
        onComplete: () => {
          resolve()
        }
      })
        .to('#mainstreamSection', {
          top: '100vh',
          duration: 0
        })

      console.log('Mainstream end')
    })
  }

  const start = () => {
    setOrdered([...(data.spotifyData || [])]
      .filter(a => a)
      .sort((a, b) => b.popularity - a.popularity)
    )
    console.log('Mainstream favorites')
    setShow(true)
  }

  // @ts-ignore
  useImperativeHandle(ref, () => ({
    start,
    animateEnd
  }))

  const last = ordered[ordered.length - 1]

  return show ? <Section>
    <Content id="mainstreamSection">
      <ParallaxWrapper>
        <LeftSideArtist id="mainstreamSectionArtistSide-1">
          <ArtistSide>
            <ArtistName>
              {
                ordered[0].name
              }
            </ArtistName>
            <ArtistImage src={ordered[0].image}/>
            is your most popular artist, with <b>{ordered[0].popularity}%</b> popularity
          </ArtistSide>
        </LeftSideArtist>

        <MainstreamPercent>
          <MainstreamPercentNumberWrapper>
            <MainstreamPercentNumber id="mainstreamSectionNumber">
              {~~average}%
            </MainstreamPercentNumber>
          </MainstreamPercentNumberWrapper>
          <ProgressBar id="mainstreamSectionBar">
            <ProgressBarInside percent={average}/>
          </ProgressBar>
          <span id="mainstreamSectionSubtext">
            is how much mainstream you are*
          </span>
        </MainstreamPercent>

        <RightSideArtist id="mainstreamSectionArtistSide-2">
          <ArtistSide>
            <ArtistName>
              {
                last.name
              }
            </ArtistName>
            <ArtistImage src={last.image}/>
            is your least popular artist, with <b>{last.popularity}%</b> popularity
          </ArtistSide>
        </RightSideArtist>
        <Notice id="mainstreamSectionNotice">
          * Based on an average of your top 100 artists' popularity from Spotify
        </Notice>
      </ParallaxWrapper>
    </Content>
  </Section> : null
})

export default Mainstream
