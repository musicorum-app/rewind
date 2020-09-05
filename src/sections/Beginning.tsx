import React, {forwardRef, useImperativeHandle} from "react";
import Section from "../components/Section";
import {Typography, Box} from "@material-ui/core";
import {RewindData} from "../api/interfaces";
import logo from '../assets/logo.svg'
import styled from "styled-components";
import {gsap, TimelineMax} from 'gsap';
import CustomEase from 'gsap/CustomEase'
import Header from "../components/Header";
import {handleArtistImage, handleTrackImage} from "../utils";
import {Emphasized, Title} from '../common'
import ParallaxWrapper from "../components/ParallaxWrapper";
import {on} from "cluster";

gsap.registerPlugin(CustomEase)

const Content = styled.div`
  opacity: 0;
  height: 100%
`

const TrackWrapper = styled.div`
  position: fixed;
  right: 80px;
  top: 50vh;
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: -20;
  height: 85vh;
  max-height: 45vw;
  transform: translateZ(-100px) translateY(-50%);
  perspective: 1500px;
`

const TrackData = styled.div`
  flex-direction: column;
  justify-content: flex-end;
  display: flex;
  text-align: right;
  height: 100%;
  padding-right: 16px;
  padding-left: 28px;
  font-size: 17px;
  transform: translateZ(50px);
`

const TrackCoverWraper = styled.div`
  height: 100%;
  max-width: 45vw;
`

const TrackCover = styled.img`
  border-radius: 4px;
  height: 100%;
`

const BeginningSection: React.FC<{
  data: RewindData,
  ref?: React.Ref<HTMLDivElement>,
  onEnd?: () => void;
}> = forwardRef(({data, onEnd}, ref) => {

  const start = () => {
    const tl = new TimelineMax()
      .fromTo('#beginningContent', {
        opacity: 0
      }, {
        opacity: 1,
        scale: 1,
        duration: 0
      })
      .fromTo('#beginningContent', {
        y: '100vh'
      }, {
        y: '0px',
        // ease: 'expo.out',
        duration: 1.6,
      }, 0)
      .to({}, {
       duration: .5,
       onComplete: () => {
         if (onEnd) onEnd()
       }
      })
  }

  const animateEnd = () => {
    return new Promise(resolve => {
      const tl = new TimelineMax()
      tl.to('#beginningContent', {
        scale: .8,
        opacity: 0,
        duration: .6,
        onComplete: () => {
          resolve()
        }
      })
        .to('#beginningContent', {
          top: '100vh',
          duration: 0
        })
      console.log('Beginning end')
    })
  }

  // @ts-ignore
  useImperativeHandle(ref, () => ({
    start,
    animateEnd
  }))

  const date = new Date(data.firstTrack.listenedAt).toLocaleDateString()

  return <Section>
    <Content id="beginningContent">
      <ParallaxWrapper>
        <Header title="THE BEGINNING">
          This was your first scrobble of <strong>2020</strong>
        </Header>
        <TrackWrapper>
          <TrackData>
            <div>
              <Title>{data.firstTrack.name}</Title>
              by <Emphasized>{data.firstTrack.artist}</Emphasized>,
              listened at <Emphasized>{date}</Emphasized>
            </div>
          </TrackData>
          <TrackCoverWraper>
            <TrackCover src={handleTrackImage(data.firstTrack.image)}/>
          </TrackCoverWraper>
        </TrackWrapper>
      </ParallaxWrapper>
    </Content>
  </Section>
})

export default BeginningSection
