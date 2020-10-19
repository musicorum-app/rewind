import React, {forwardRef, useEffect, useImperativeHandle, useState} from "react";
import Section from "../components/Section";
import {RewindData} from "../api/interfaces";
import styled from "styled-components";
import {gsap, TimelineMax} from 'gsap';
import CustomEase from 'gsap/CustomEase'
import ParallaxWrapper from "../components/ParallaxWrapper";
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
  transform-style: preserve-3d;
  perspective: 9000px;
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
            <Typography variant="h6" className="albumMemeFade" style={{
              marginRight: 32
            }}>
              Art made by <Link
              target="_blank"
              href="https://musc.pw"
              rel="nofollow nofollow"
            >artista</Link>
            </Typography>
          </ButtonSide>
        </Middle>
      </ParallaxWrapper>
    </Content>
  </Section> : null
})

export default AlbumMeme
