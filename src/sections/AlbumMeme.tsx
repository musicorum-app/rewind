import React, {forwardRef, useEffect, useImperativeHandle, useState} from "react";
import Section from "../components/Section";
import {RewindData} from "../api/interfaces";
import styled from "styled-components";
import {gsap, TimelineMax} from 'gsap';
import CustomEase from 'gsap/CustomEase'
import ParallaxWrapper from "../components/ParallaxWrapper";
import RoundedButton from "../RoundedButton";
import {Typography, useMediaQuery} from "@material-ui/core";
import Link from "@material-ui/core/Link";
import {generateAlbumMeme} from "../image";
import Box from "@material-ui/core/Box";
import {Trans} from "react-i18next";

gsap.registerPlugin(CustomEase)


const Content = styled.div`
  opacity: 0;
  height: 100%;
  top: 200vh;
  transform-style: preserve-3d;
  perspective: 1000px;
`

const Middle = styled.div`
  transform-style: preserve-3d;
  perspective: 9000px;
  position: absolute;
  left: 50vw;
  top: 50vh;
  transform: translateX(-50%) translateY(-50%) translateZ(-30px) scale(.85);
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  width: 100vw;
`

const MemeImage = styled.img`
  border-radius: 4px;
  width: 100%;
`

const ButtonSide = styled.div`
  width: 100%;
  display: flex;
  align-items: center;
  flex-direction: column;
`


const AlbumMeme: React.FC<{
  data: RewindData,
  ref?: React.Ref<HTMLDivElement>,
  onEnd?: () => void;
}> = forwardRef(({data, onEnd}, ref) => {

  const [show, setShow] = useState(false)
  const smol = useMediaQuery(`(max-width: 480px)`)

  useEffect(() => {
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
          y: -120,
          rotateY: -70,
          opacity: 0
        }, {
          y: 0,
          opacity: 1,
          rotateY: 0,
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
            setShow(false)
          }
        })

      console.log('ALbum meme section end')
    })
  }

  const download = () => {
    const a = document.createElement('a')
    if (data.images) {
      a.href = data.images.albumMeme
      a.download = 'Musicorum rewind 2020 - Loved album'
      a.click()
    }
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
          <MemeImage
            id="albumMemeImage"
            src={data.images?.albumMeme}/>
          <ButtonSide className="albumMemeFade">
            <Box my={3}>
              <Typography variant={smol ? 'subtitle1' : 'h6'} className="albumMemeFade">
              <Trans
                i18nKey='sections.albumMeme.artMadeBy'
                values={{
                  artist: 'Luana Barros'
                }}
                components={[
                  <Link
                    key={0}
                    target="_blank"
                    href="https://www.instagram.com/spiritrika"
                    rel="nofollow nofollow"
                  />
                ]}
                />
              </Typography>
            </Box>

            <Box>
              <RoundedButton
                color="primary"
                size="large"
                onClick={download}
                style={{
                  fontSize: 27
                }}
              >
                <Trans i18nKey='sections.albumMeme.download' />
              </RoundedButton>
            </Box>
          </ButtonSide>
        </Middle>
      </ParallaxWrapper>
    </Content>
  </Section> : null
})

export default AlbumMeme
