import React, {forwardRef, useEffect, useImperativeHandle, useState} from "react";
import Section from "../components/Section";
import {FormattedAlbum, RewindData} from "../api/interfaces";
import styled from "styled-components";
import {gsap, TimelineMax} from 'gsap';
import CustomEase from 'gsap/CustomEase'
import ParallaxWrapper from "../components/ParallaxWrapper";
import Header from "../components/Header";
import {handleAlbumImage, handleArtistImage} from "../utils";
import {THEME_COLOR} from "../Constants";
import {useMediaQuery} from "@material-ui/core";
import Grid from "@material-ui/core/Grid";

gsap.registerPlugin(CustomEase)

const mediaQueryBreak = 860

const TopAlbumsSection = styled.div`
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
  
  @media(max-width: ${mediaQueryBreak}px) {
    margin-top: 20px;
    width: 50vw;
    height: 50vw;
    padding: 0;
  }
  
  @media(max-width: ${mediaQueryBreak}px) and (min-height: 680px) {
    width: 70vw;
    height: 70vw;
  }
`

const AlbumList = styled.div`
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
    cursor:default;
  }
  
  
  @media(max-width: ${mediaQueryBreak}px) {
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    font-size: 28px;
    margin-bottom: 6px;
    &:hover {
      padding-left: 0;
    }
  }
  
  @media(max-width: ${mediaQueryBreak}px) and (max-height: 680px) {
    font-size: 15px;
    margin-bottom: 3px;
  }
`

const backgroundImageSize = 240
const backgroundImageSizeSmall = 120

const ImageBase = styled.img`
  opacity: 0.4;
  border-radius: 4px;
  position: absolute;
  width: ${backgroundImageSize}px;
  height: ${backgroundImageSize}px;
  background: black;
  
  @media(max-width: ${mediaQueryBreak}px) {
     width: ${backgroundImageSizeSmall}px;
     height: ${backgroundImageSizeSmall}px;
  }
`

const TopImage = styled(ImageBase)`
  transform: translateZ(-70px);
  top: 4vh;
  right: calc(25vw - ${backgroundImageSize}px);
  
  @media(max-width: ${mediaQueryBreak}px) {
    top: 6vh;
    right: 70vw;
  }
`

const CenterImage = styled(ImageBase)`
  transform: translateZ(-220px);
  top: 30vh;
  right: calc(50vw - ${backgroundImageSize}px);
  
  @media(max-width: ${mediaQueryBreak}px) {
    bottom: calc(50vh - ${backgroundImageSizeSmall}px);
    top: auto;
    right: 2vw;
    left: auto;
  }
`

const BottomImage = styled(ImageBase)`
  transform: translateZ(-170px);
  bottom: calc(30vh - ${backgroundImageSize}px);
  right: calc(25vw - ${backgroundImageSize}px);
  
  @media(max-width: ${mediaQueryBreak}px) {
    bottom: 9vh;
    right: 65vw;
  }
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

const TopAlbums: React.FC<{
  data: RewindData,
  ref?: React.Ref<HTMLDivElement>,
  onEnd?: () => void;
}> = forwardRef(({onEnd, data}, ref) => {

  const smol = useMediaQuery(`(max-width: ${mediaQueryBreak}px)`)
  const [show, setShow] = useState(false)
  const [hoveredAlbum, setHoveredAlbum] = useState<FormattedAlbum>(data.topAlbums[0])

  useEffect(() => {
    if (show) {
      const tl = new TimelineMax()
        .to('#topAlbumsSection', {
          top: 0,
          duration: 0
        })
        .to('#topAlbumsSection', {
          opacity: 1
        }, 0)
        .from('#bigImageAlbums', {
          x: -200,
          opacity: 0,
          ease: 'expo.out',
          duration: 3
        }, 0)
        .from('.topAlbumsBackgroundImage', {
          opacity: 0,
          y: 120,
          ease: 'expo.out',
          duration: 3,
          stagger: .2
        }, 0)
        .from('.topAlbumsListNode', {
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
      new TimelineMax().to('#topAlbumsSection', {
        opacity: 0
      })
        .to('#topAlbumsSection', {
          top: '100vh',
          duration: 0,
          onComplete: () => {
            resolve()
            setShow(false)
          }
        })
    })
  }

  // @ts-ignore
  useImperativeHandle(ref, () => ({
    start,
    animateEnd
  }))


  const Albums = data.topAlbums.slice(0, 5)

  return show ? <Section center>
    <TopAlbumsSection id="topAlbumsSection">
      <ParallaxWrapper>
        <Header title="THE ALBUMS" notAbsolute={smol}>
          {smol ? 'Your most listened albums were' : null}
        </Header>

        {
          smol ? <>


            <Grid container justify="center">
              <Grid item>
                <Image id="bigImageAlbums" src={handleAlbumImage(hoveredAlbum)} style={{
                  backgroundImage: `url(${handleAlbumImage(hoveredAlbum)})`
                }}/>
              </Grid>
              <Grid item xs={10} style={{paddingTop: 28}}>
                <List>
                  {
                    Albums.map((a, i) => <ListItem
                      hovered={hoveredAlbum === a}
                      onMouseEnter={() => setHoveredAlbum(a)}
                      className="topArtistsListNode"
                      key={i}
                    >
                      {a.name}
                    </ListItem>)
                  }
                </List>
              </Grid>
            </Grid>

          </> : [
            <ImageWraper id="bigImageAlbums">
              <Image src={handleAlbumImage(hoveredAlbum)} style={{
                backgroundImage: `url(${handleAlbumImage(hoveredAlbum)})`
              }}/>
            </ImageWraper>,
            <ScrobbleCount>
              <h3>{hoveredAlbum.playCount.toLocaleString()}</h3>
              scrobbles
            </ScrobbleCount>,

            <AlbumList>
              {!smol ? 'Your most listened albums were' : null}
              <List>
                {
                  Albums.map((a, i) => <ListItem
                    hovered={hoveredAlbum === a}
                    onMouseEnter={() => setHoveredAlbum(a)}
                    className="topAlbumsListNode"
                    key={i}
                  >
                    {a.name}
                  </ListItem>)
                }
              </List>
            </AlbumList>
          ]
        }

        <TopImage
          className="topAlbumsBackgroundImage"
          src={handleAlbumImage(data.topAlbums[5])}
        />
        <CenterImage
          className="topAlbumsBackgroundImage"
          src={handleAlbumImage(data.topAlbums[6])}
        />
        <BottomImage
          className="topAlbumsBackgroundImage"
          src={handleAlbumImage(data.topAlbums[7])}
        />
      </ParallaxWrapper>
    </TopAlbumsSection>
  </Section> : null
})

TopAlbums.defaultProps = {
  onEnd: () => {
  }
}

export default TopAlbums
