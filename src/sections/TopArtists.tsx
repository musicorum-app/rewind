import React, {forwardRef, useImperativeHandle, useState} from "react";
import Section from "../components/Section";
import {Typography, Box} from "@material-ui/core";
import {FormattedArtist, RewindData} from "../api/interfaces";
import logo from '../assets/logo.svg'
import styled from "styled-components";
import {gsap, TimelineMax} from 'gsap';
import CustomEase from 'gsap/CustomEase'
import ParallaxWrapper from "../components/ParallaxWrapper";
import Header from "../components/Header";
import {handleArtistImage} from "../utils";
import {THEME_COLOR} from "../Constants";

gsap.registerPlugin(CustomEase)

const Perspective = styled.div`

`

const ImageWraper = styled.div`
  height: 100%;
  max-width: 65vh;
  transform: translateZ(-130px);
  display: flex;
  align-items: center;
    //max-height: 500px;
`

const Image = styled.img`
  border-radius: 4px;
  width: 100%;
  height: 0px;
  padding: 50% 0;
  /* reset just in case */
  background-clip: border-box;
  background-position: center;
  background-repeat: space;
  background-size: cover;
`

const ArtistList = styled.div`
  position: absolute;
  right: 0px;
  top: 0px;
  width: 50vw;
  height: 100%;
  padding-top: calc(40px + 80px);
  transform: translateZ(-50px);
  font-size: 30px;
`

const List = styled.div`
  color: ${THEME_COLOR};
  display: flex;
  flex-direction: column;
  justify-content: space-around;
  height: 100%;
  padding-bottom: 100px;
`

const ListItem = styled.span`
  //margin-top: 20px;
  font-weight: 800;
  font-size: 45px;
  width: 100%;
  transition: padding-left .2s;
  &:hover {
    padding-left: 20px;
    cursor:pointer;
  }
`

const backgroundImageSize = 240

const ImageBase = styled.img`
  opacity: 0.4;
  border-radius: 4px;
  position: absolute;
  width: ${backgroundImageSize}px;
  height: ${backgroundImageSize}px;
  background: black;
`

const TopImage = styled(ImageBase)`
  transform: translateZ(-90px);
  top: 4vh;
  right: calc(55vw - ${backgroundImageSize}px);
`

const CenterImage = styled(ImageBase)`
  transform: translateZ(-270px);
  top: 40vh;
  right: calc(20vw - ${backgroundImageSize}px);
`

const BottomImage = styled(ImageBase)`
  transform: translateZ(-180px);
  bottom: calc(40vh - ${backgroundImageSize}px);
  right: calc(45vw - ${backgroundImageSize}px);
`

const TopArtists: React.FC<{
  data: RewindData,
  ref?: React.Ref<HTMLDivElement>,
  onEnd?: () => void;
}> = forwardRef(({onEnd, data}, ref) => {

  const [hoveredArtist, setHoveredArtist] = useState<FormattedArtist>(data.topArtists[0])

  const start = () => {
    console.log('Starting')
    const tl = new TimelineMax()

  }

  // @ts-ignore
  useImperativeHandle(ref, () => ({
    start
  }))

  const artists = data.topArtists.slice(1, 6)

  return <Section center>
    <ParallaxWrapper>
      <Header title="THE ARTISTS">
      </Header>
      <ImageWraper>
        <Image src={handleArtistImage(data.topArtists[0])} style={{
          backgroundImage: `url(${handleArtistImage(data.topArtists[0])})`
        }} />
      </ImageWraper>
      <ArtistList>
        Your most listened artists were
        <List>
          {
            artists.map((a, i) => <ListItem key={i}>
              {a.name}
            </ListItem>)
          }
        </List>
      </ArtistList>
      <TopImage src={handleArtistImage(data.topArtists[1])} />
      <CenterImage src={handleArtistImage(data.topArtists[2])} />
      <BottomImage src={handleArtistImage(data.topArtists[3])} />
    </ParallaxWrapper>
  </Section>
})

TopArtists.defaultProps = {
  onEnd: () => {
  }
}

export default TopArtists
