import React, {forwardRef, useEffect, useImperativeHandle, useState} from "react";
import Section from "../components/Section";
import {FormattedTrack, Nullable, RewindData, SpotifyArtistBase} from "../api/interfaces";
import styled from "styled-components";
import {gsap, TimelineMax} from 'gsap';
import CustomEase from 'gsap/CustomEase'
import ParallaxWrapper from "../components/ParallaxWrapper";
import {THEME_COLOR} from "../Constants";
import chroma from "chroma-js";
import {handleTrackImage} from "../utils";
import RoundedButton from "../RoundedButton";
import {Typography} from "@material-ui/core";
import Link from "@material-ui/core/Link";

gsap.registerPlugin(CustomEase)


const Content = styled.div`
  opacity: 0;
  height: 100%;
  top: 200vh;
  transform-style: preserve-3d;
  perspective: 1000px;
`

const Middle = styled.div`
  position: absolute;
  left: 50vw;
  top: 50vh;
  transform: translateX(-50%) translateY(-50%) translateZ(-100px);
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100vw;
`

const MemeImage = styled.img`
  border-radius: 4px;
  height: 75vh;
`

const ButtonSide = styled.div`
  margin-left: 32px;
`


const AlbumMeme: React.FC<{
  data: RewindData,
  ref?: React.Ref<HTMLDivElement>,
  onEnd?: () => void;
}> = forwardRef(({data, onEnd}, ref) => {

  const [show, setShow] = useState(false)

  useEffect(() => {
    const textEase = CustomEase.create("textEase", "M0,0,C0,0.658,0.084,0.792,0.15,0.846,0.226,0.908,0.272,0.976,1,1")

    if (show) {
      const tl = new TimelineMax()
        .to('#albumMemeSection', {
          // opacity: 1,
          // scale: 1,
          top: 0,
          duration: 0
        })
        .fromTo('#albumMemeSection', {
          opacity: 0
        }, {
          scale: 1,
          opacity: 1,
          duration: .1
        })
        .fromTo('#albumMemeImage', {
          y: -200,
          opacity: 0
        }, {
          y: 0,
          opacity: 1,
          duration: 2,
          ease: 'expo.out'
        })
        .from('.albumMemeFade', {
          opacity: 0
        })


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
      tl.to('#albumMemeSection', {
        opacity: 0,
        y: 80
      })
        .to('#albumMemeSection', {
          top: '100vh',
          duration: 0,
          onComplete: () => {
            resolve()
          }
        })

      console.log('ALbum meme section end')
    })
  }

  const start = () => {
    console.log('Album meme section')
    setShow(true)
  }

  // @ts-ignore
  useImperativeHandle(ref, () => ({
    start,
    animateEnd
  }))

  return show ? <Section>
    <Content id="albumMemeSection">
      <ParallaxWrapper>
        <Middle>
          <Typography variant="h6" className="albumMemeFade" style={{
            marginRight: 32
          }}>
            Art made by <Link
            target="_blank"
            href="https://musc.pw"
            rel="nofollow nofollow"
          >bomdia</Link>
          </Typography>
          <MemeImage
            id="albumMemeImage"
            src="https://cdn-2.musicorumapp.com/rewind/769229aae75c382be3d18d1dfefd4a28.jpg"/>
          <ButtonSide className="albumMemeFade">
            <RoundedButton
              color="primary"
              size="large"
              onClick={() => {
              }}
              style={{
                fontSize: 27
              }}
            >
              Download
            </RoundedButton>
          </ButtonSide>
        </Middle>
      </ParallaxWrapper>
    </Content>
  </Section> : null
})

export default AlbumMeme
