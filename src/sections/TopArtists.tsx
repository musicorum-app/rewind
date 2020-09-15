import React, {forwardRef, useEffect, useImperativeHandle, useState} from "react";
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
import {on} from "cluster";

gsap.registerPlugin(CustomEase)

const TopArtistsSection = styled.div`
  position: absolute;
  top: 100vh;
  opacity: 0;
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
  display: flex;
  flex-direction: column;
  justify-content: space-around;
  height: 100%;
  padding-bottom: 100px;
`

interface ListItemProps {
  hovered?: boolean
}

const ListItem = styled.span`
  color: ${(props: ListItemProps) => props.hovered ? 'white' : THEME_COLOR};
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
  transform: translateZ(-290px);
  top: 4vh;
  right: calc(55vw - ${backgroundImageSize}px);
`

const CenterImage = styled(ImageBase)`
  transform: translateZ(-80px);
  top: 40vh;
  right: calc(20vw - ${backgroundImageSize}px);
`

const BottomImage = styled(ImageBase)`
  transform: translateZ(-180px);
  bottom: calc(40vh - ${backgroundImageSize}px);
  right: calc(45vw - ${backgroundImageSize}px);
`

const ScrobbleCount = styled.div`
  position: absolute;
  bottom: 30px;
  left: 60px;
  transform: translateZ(100px);
  & > h3 {
    color: ${THEME_COLOR};
    font-weight: 900;
    font-size: 90px;
    margin: 0px;
    line-height: 70px;
  }
`

const TopArtists: React.FC<{
  data: RewindData,
  ref?: React.Ref<HTMLDivElement>,
  onEnd?: () => void;
}> = forwardRef(({onEnd, data}, ref) => {

  const [show, setShow] = useState(false)
  const [hoveredArtist, setHoveredArtist] = useState<FormattedArtist>(data.topArtists[0])

  useEffect(() => {
    if (show) {
      console.log('AAaa')
      const tl = new TimelineMax()
        .to('#topArtistsSection', {
          top: 0,
          duration: 0
        })
        .to('#topArtistsSection', {
          opacity: 1
        }, 0)
        .from('#bigImage', {
          x: -200,
          opacity: 0,
          ease: 'expo.out',
          duration: 3
        }, 0)
        .from('.topArtistsBackgroundImage', {
          opacity: 0,
          y: 120,
          ease: 'expo.out',
          duration: 3,
          stagger: .2
        }, 0)
        .from('.topArtistsListNode', {
          x: -120,
          opacity: 0,
          ease: 'expo.out',
          duration: 3,
          stagger: .1,
          onComplete: () => {
            if (onEnd) onEnd()
          }
        }, 0)
    }
  }, [show])

  const start = () => {
    setShow(true)
  }

  const animateEnd = () => {
    return new Promise(resolve => {
      new TimelineMax().to('#topArtistsSection', {
        opacity: 0
      })
        .to('#topArtistsSection', {
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


  const artists = data.topArtists.slice(0, 5)

  return show ? <Section center>
    <TopArtistsSection id="topArtistsSection">
      <ParallaxWrapper>
        <Header title="THE ARTISTS">
        </Header>
        <ImageWraper id="bigImage">
          <Image src={handleArtistImage(hoveredArtist)} style={{
            backgroundImage: `url(${handleArtistImage(hoveredArtist)})`
          }}/>
        </ImageWraper>
        <ScrobbleCount>
          <h3>{Number(hoveredArtist.playcount).toLocaleString()}</h3>
          scrobbles
        </ScrobbleCount>

        <ArtistList>
          Your most listened artists were
          <List>
            {
              artists.map((a, i) => <ListItem
                hovered={hoveredArtist === a}
                onMouseEnter={() => setHoveredArtist(a)}
                className="topArtistsListNode"
                key={i}
              >
                {a.name}
              </ListItem>)
            }
          </List>
        </ArtistList>
        <TopImage
          className="topArtistsBackgroundImage"
          src={handleArtistImage(data.topArtists[5])}
        />
        <CenterImage
          className="topArtistsBackgroundImage"
          src={handleArtistImage(data.topArtists[6])}
        />
        <BottomImage
          className="topArtistsBackgroundImage"
          src={handleArtistImage(data.topArtists[7])}
        />
      </ParallaxWrapper>
    </TopArtistsSection>
  </Section> : null
})

TopArtists.defaultProps = {
  onEnd: () => {
  }
}

export default TopArtists
