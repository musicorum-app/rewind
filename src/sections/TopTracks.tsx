import React, {forwardRef, useEffect, useImperativeHandle, useState} from "react";
import Section from "../components/Section";
import {Typography, Box} from "@material-ui/core";
import {FormattedAlbum, RewindData} from "../api/interfaces";
import logo from '../assets/logo.svg'
import styled from "styled-components";
import {gsap, TimelineMax} from 'gsap';
import CustomEase from 'gsap/CustomEase'
import ParallaxWrapper from "../components/ParallaxWrapper";
import Header from "../components/Header";
import {handleAlbumImage} from "../utils";
import {THEME_COLOR} from "../Constants";
import {on} from "cluster";

gsap.registerPlugin(CustomEase)

const TopTracksSection = styled.div`
  position: absolute;
  top: 100vh;
  opacity: 0;
`

const TopTracks: React.FC<{
  data: RewindData,
  ref?: React.Ref<HTMLDivElement>,
  onEnd?: () => void;
}> = forwardRef(({onEnd, data}, ref) => {

  const [show, setShow] = useState(false)
  const [currentTrack, setCurrentTrack] = useState<FormattedAlbum>(data.topAlbums[0])

  useEffect(() => {
    if (show) {
      const tl = new TimelineMax()
        .to('#topTracksSection', {
          top: 0,
          duration: 0
        })
        .to('#topTracksSection', {
          opacity: 1
        }, 0)
    }
  }, [show])

  const start = () => {
    setShow(true)
  }

  const animateEnd = () => {
    return new Promise(resolve => {
      new TimelineMax().to('#topTracksSection', {
        opacity: 0
      })
        .to('#topTracksSection', {
          top: '100vh',
          duration: 0,
          onComplete: resolve
        })
    })
  }

  // @ts-ignore
  useImperativeHandle(ref, () => ({
    start,
    animateEnd
  }))


  const tracks = data.topTracks.slice(0, 8)

  return show ? <Section center>
    <TopTracksSection id="topTracksSection">
      <ParallaxWrapper>
        <Header title="THE TRACKS">
        </Header>

      </ParallaxWrapper>
    </TopTracksSection>
  </Section> : null
})

TopTracks.defaultProps = {
  onEnd: () => {
  }
}

export default TopTracks
