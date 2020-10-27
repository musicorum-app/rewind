import React, {forwardRef, useEffect, useImperativeHandle, useState} from "react";
import Section from "../components/Section";
import {Nullable, RewindData} from "../api/interfaces";
import styled from "styled-components";
import {gsap, TimelineMax} from 'gsap';
import CustomEase from 'gsap/CustomEase'
import RoundedButton from "../RoundedButton";
import {Typography, useMediaQuery} from "@material-ui/core";
import Grid from "@material-ui/core/Grid";
import {generateNormalShare, generateStoriesShare} from "../image";
import Box from "@material-ui/core/Box";
import BigColoredButton from "../components/BigColoredButton";

import {ReactComponent as TwitterLogo} from '../assets/logos/twitter.svg'
import {ReactComponent as PatreonLogo} from '../assets/logos/patreon.svg'

gsap.registerPlugin(CustomEase)

const mediaQueryBreak = 1280

const Content = styled.div`
  opacity: 0;
  height: 100%;
  top: 200vh;
  transform-style: preserve-3d;
  perspective: 1000px;
`

const Middle = styled.div`
  position: absolute;
  width: 100vw;
  //height: 80vh;
  //margin-top: 120px;
  //top: 15vh;
  height: 100%;
  padding-bottom: 80px;
`

const FlexMiddle = styled.div`
  display: flex;
  width: 100%;
  height: 100%;
  justify-content: center;
  align-items: center;
`


const Image = styled.img`
  height: 520px;
  box-shadow: 0 0 50px 20px rgba(255, 255, 255, 0.13);
  border-radius: 4px;
  backface-visibility: hidden;
  position: relative;
  left: 18%;
  
  @media(max-width: ${mediaQueryBreak}px) {
    height: 340px;
  }
  
  @media(max-width: 580px) {
    height: 270px;
  }
  
  @media(max-width: 420px) {
  height: 200px;
  }
`

const ImageWrapper = styled(FlexMiddle)`
  transform-style: preserve-3d;
  perspective: 5300px;
`


const ImageShare: React.FC<{
  data: RewindData,
  ref?: React.Ref<HTMLDivElement>,
  onEnd?: () => void;
}> = forwardRef(({data, onEnd}, ref) => {

  const [show, setShow] = useState(false)
  const [images, setImages] = useState<Nullable<string[]>>(null)
  const [isStoriesSelected, setStoriesSelected] = useState(false)
  const [isAnimating, setAnimating] = useState(false)

  const small = useMediaQuery(`(max-width: ${mediaQueryBreak}px)`)

  useEffect(() => {
    if (show) {
      animate()
    }
  }, [show])

  const animate = async () => {
    if (!images) await repaint()
    const tl = new TimelineMax()
      .to('#imageShareSection', {
        // opacity: 1,
        // scale: 1,
        top: 0,
        duration: 0
      })
      .fromTo('#imageShareSection', {
        opacity: 0
      }, {
        scale: 1,
        opacity: 1,
        duration: .1
      })
      .from('#imageShareSectionActions', {
        y: 17,
        opacity: 0,
        duration: 1.7,
        ease: 'expo.out'
      }, 1)
      .from('#imageShareSectionImage', {
        x: -200,
        opacity: 0,
        duration: 2,
        ease: 'expo.out'
      }, 0)
      .from('#imageShareSectionHelp', {
        x: 200,
        opacity: 0,
        duration: 2,
        ease: 'expo.out'
      }, 0)


    tl.to({}, {
      duration: .5,
      onComplete: () => {
        if (onEnd) onEnd()
      }
    })
  }

  const repaint = async () => {
    const stories = URL.createObjectURL(await generateStoriesShare(data))
    const image = URL.createObjectURL(await generateNormalShare(data))
    setImages([image, stories])
  }

  const switchStories = () => {
    if (isAnimating) return
    setAnimating(true)
    const newState = !isStoriesSelected
    setStoriesSelected(newState)
    const tl = new TimelineMax()
    const duration = .7
    tl
      .to('#shareImage-stories', {
        rotateY: '-=180',
        duration,
        // ease: 'expo.inOut'
      })
      .to('#shareImage-normal', {
        rotateY: '-=180',
        duration,
        // ease: 'expo.inOut',
        onComplete: () => setAnimating(false)
      }, 0)
      .fromTo(['#shareImage-normal', '#shareImage-stories'], {
        translateZ: 0
      }, {
        translateZ: -540,
        duration: duration / 2,
      }, 0)
      .fromTo(['#shareImage-normal', '#shareImage-stories'], {
        translateZ: -540
      }, {
        translateZ: 0,
        duration: duration / 2,
      }, duration / 2)

  }

  const animateEnd = () => {
    return new Promise(resolve => {
      const tl = new TimelineMax()
      tl.to('#imageShareSection', {
        opacity: 0,
        y: 80
      })
        .to('#imageShareSection', {
          top: '100vh',
          duration: 0,
          onComplete: () => {
            setShow(false)
            resolve()
          }
        })

      console.log('ALbum meme section end')
    })
  }

  const start = () => {
    console.log('Album meme section')
    if (data.images) {
      setImages([data.images.normalShare, data.images.storyShare])
    } else repaint()
    setShow(true)
  }

  const download = () => {
    const a = document.createElement('a')
    if (images) {
      a.href = isStoriesSelected ? images[1] : images[0]
      a.download = 'Musicorum rewind 2020 - ' + (isStoriesSelected ? 'Stories' : 'Normal')
      a.click()
    }
  }

  // @ts-ignore
  useImperativeHandle(ref, () => ({
    start,
    animateEnd,
  }))

  return show ? <Section>
    <Content id="imageShareSection">
      <Middle>
        <Grid style={{height: '100%'}} container spacing={small ? 1 : 3}>
          <Grid item xs={12} lg={6} id="imageShareSectionImage">
            <Grid container direction="column" justify="center" alignItems="center"
                  style={{width: '100%', height: '100%'}}>
              <Grid item>
                <ImageWrapper>
                  {
                    images ? [
                      <Image id="shareImage-normal" src={images[0]} alt="Rewind share image"/>,
                      <Image id="shareImage-stories" src={images[1]} alt="Rewind share image"
                             style={{
                               transform: 'rotateY(180deg)',
                               right: '32%',
                               left: 'auto'
                             }}/>
                    ] : null
                  }
                </ImageWrapper>
              </Grid>
              <Grid item id="imageShareSectionActions">
                <Grid container alignItems="center" direction="column">
                  <Box mt={4} mb={2}>
                    <RoundedButton disabled={!images} size="large" onClick={download} color="primary" style={{
                      fontSize: small ? 14 : 20
                    }}>
                      Download
                    </RoundedButton>
                  </Box>
                  <RoundedButton disabled={!images} onClick={switchStories} color="primary" outlined style={{
                    fontSize: small ? 11 : 17
                  }}>
                    {isStoriesSelected ? 'Normal' : 'Stories'} version
                  </RoundedButton>
                </Grid>
              </Grid>
            </Grid>
          </Grid>
          <Grid item xs={12} lg={6} id="imageShareSectionHelp">
            <Grid container direction="column" justify="center" alignItems="center"
                  style={{width: '100%', height: small ? 'auto' : '100%'}}>
              <Grid item>
                <Typography align="center" variant={small ? 'h5' : 'h4'}>
                  <b>Share your rewind!</b>
                </Typography>
                <Box mt={1} paddingX={small ? 4 : 6} fontSize={small ? 17 : 21}>
                  <Typography align="center" style={{fontSize: 'inherit'}}>
                    Before we end, take a souvenir from this year's rewind!
                  </Typography>
                </Box>

              </Grid>
            </Grid>
          </Grid>
        </Grid>
      </Middle>
    </Content>
  </Section> : null
})

export default ImageShare
