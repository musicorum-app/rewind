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

gsap.registerPlugin(CustomEase)

const Content = styled.div`
  opacity: 0;
  height: 100%
`

const TrackWrapper = styled.div`
  position: fixed;
  right: 80px;
  top: 50vh;
  transform: translateY(-50%);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: -20;
  height: 85vh;
  max-height: 45vw;
`

const TrackData = styled.div`
  flex-direction: column;
  justify-content: flex-end;
  display: flex;
  text-align: right;
  height: 100%;
  padding-right: 16px;
`

const TrackCover = styled.img`
  border-radius: 4px;
  height: 100%;
  max-width: 45vw;
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
        duration: 0
      })
      .fromTo('#beginningContent', {
        y: '100vh'
      }, {
        y: '0px',
        // ease: 'expo.out',
        duration: 1.6,
      }, 0)
  }

  // @ts-ignore
  useImperativeHandle(ref, () => ({
    start
  }))

  const date = new Date(data.firstTrack.listenedAt).toLocaleDateString()

  return <Section>
    <Content id="beginningContent">
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
        <TrackCover src={handleTrackImage(data.firstTrack.image)}/>
      </TrackWrapper>
    </Content>
  </Section>
})

export default BeginningSection
