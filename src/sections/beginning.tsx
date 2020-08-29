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

gsap.registerPlugin(CustomEase)

const Content = styled.div`
  scale: .7;
  opacity: 0;
`

const TrackWrapper = styled.div`
  position: fixed;
  height: 100vh;
  right: 80px;
  top: 0px;
  display: flex;
  justify-content: center;
    align-items: center;

`

const TrackCover = styled.img`
  border-radius: 4px;
  z-index: -20;
  height: 68%;
`

const BeginningSection: React.FC<{
  data: RewindData,
  ref?: React.Ref<HTMLDivElement>,
  onEnd?: () => void;
}> = forwardRef(({data, onEnd}, ref) => {

  const start = () => {
    gsap.fromTo('#beginningContent', {
      scale: .9
    },{
      scale: 1,
      opacity: 1
    })
  }

  // @ts-ignore
  useImperativeHandle(ref, () => ({
    start
  }))

  return <Section>
    <Content id="beginningContent">
      <Header title="THE BEGINNING">
        This was your first scrobble of <strong>2020</strong>
      </Header>
      <TrackWrapper>
        <TrackCover src={handleTrackImage(data.firstTrack.image)} />
      </TrackWrapper>
    </Content>
  </Section>
})

export default BeginningSection
