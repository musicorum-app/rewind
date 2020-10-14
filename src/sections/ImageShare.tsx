import React, {forwardRef, useEffect, useImperativeHandle, useState} from "react";
import Section from "../components/Section";
import {Nullable, RewindData} from "../api/interfaces";
import styled from "styled-components";
import {gsap, TimelineMax} from 'gsap';
import CustomEase from 'gsap/CustomEase'
import RoundedButton from "../RoundedButton";
import {Typography} from "@material-ui/core";
import Grid from "@material-ui/core/Grid";
import {generateNormalShare, generateStoriesShare} from "../image";
import Box from "@material-ui/core/Box";
import BigColoredButton from "../components/BigColoredButton";

import {ReactComponent as TwitterLogo} from '../assets/logos/twitter.svg'
import {ReactComponent as PatreonLogo} from '../assets/logos/patreon.svg'

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
  width: 100vw;
  height: 80vh;
  //margin-top: 120px;
  top: 15vh;
`

const FlexMiddle = styled.div`
  display: flex;
  width: 100%;
  height: 100%;
  justify-content: center;
  align-items: center;
`

const Year = styled.span`
  -webkit-text-stroke: 2px #FD0F57;
  font-weight: 900;
  font-style: italic;
  position: absolute;
  left: 50vw;
  transform: translateX(-50%);
  color: transparent;
  font-size: 70px;
`

const Image = styled.img`
  height: 520px;
  box-shadow: 0 0 50px 20px rgba(255, 255, 255, 0.13);
  border-radius: 4px;
  backface-visibility: hidden;
  position: relative;
  left: 20%;
`

const ImageWrapper = styled(FlexMiddle)`
  transform-style: preserve-3d;
  perspective: 1300px;
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

  useEffect(() => {
    if (show) {
      animate()
    }
  }, [show])

  const animate = async () => {
    await repaint()
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
      .fromTo('#imageShareSectionYear', {
        y: -100,
        opacity: 0
      }, {
        y: 0,
        opacity: 1,
        duration: 2,
        ease: 'expo.out'
      })
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
    generateImage: repaint
  }))

  return show ? <Section>
    <Content id="imageShareSection">
      <Year id="imageShareSectionYear">
        2020
      </Year>
      <Middle>
        <Grid style={{height: '100%'}} container spacing={4}>
          <Grid item xs={12} md={7}>
            <FlexMiddle id="imageShareSectionImage">
              <Grid container direction="column" justify="center" alignItems="center"
                    style={{width: '100%', height: '100%'}}>
                <Grid item>
                  <Box mb={4}>
                    <Typography align="center" variant="h4">
                      <b>Share your rewind!</b>
                    </Typography>
                  </Box>
                </Grid>
                <Grid item>
                  <ImageWrapper>
                    {
                      images ? [
                        <Image onClick={repaint} id="shareImage-normal" src={images[0]} alt="Rewind share image"/>,
                        <Image onClick={repaint} id="shareImage-stories" src={images[1]} alt="Rewind share image"
                               style={{
                                 transform: 'rotateY(180deg)',
                                 right: '30%',
                                 left: 'auto'
                               }}/>
                      ] : null
                    }
                  </ImageWrapper>
                </Grid>
                <Grid item>
                  <Grid container alignItems="center" direction="column">
                    <Grid item>
                      <Typography variant="caption" color="textSecondary">
                        (if fonts are missing, click on the image to try again)
                      </Typography>
                    </Grid>
                    <Box mt={4} mb={2}>
                      <RoundedButton disabled={!images} size="large" onClick={download} color="primary" style={{
                        fontSize: 20
                      }}>
                        Download
                      </RoundedButton>
                    </Box>
                    <RoundedButton disabled={!images} onClick={switchStories} color="primary" outlined>
                      {isStoriesSelected ? 'Normal' : 'Stories'} version
                    </RoundedButton>
                  </Grid>
                </Grid>
              </Grid>
            </FlexMiddle>
          </Grid>
          <Grid item xs={12} md={4} id="imageShareSectionHelp">
            <Grid container direction="column" justify="center" alignItems="center"
                  style={{width: '100%', height: '100%', padding: 28}}>
              <Grid item>
                <Typography align="center" variant="h4">
                  <b>Help us!</b>
                </Typography>
                <Box mb={3} mt={2}>
                  <Typography align="center">
                    The Musicorum Rewind is a open source and free project, made by one person.
                  </Typography>
                  <Typography align="center">
                    If you want to see more amazing projects in future, please consider becoming a patron and sharing
                    it!
                  </Typography>
                </Box>
                <Grid container justify="center" style={{width: '100%'}}>
                  <Grid item>
                    <Grid container spacing={2}>
                      <Grid item xs={12} sm={6}>
                        <BigColoredButton
                          icon={<PatreonLogo/>}
                          fullWidth
                          color="#FF424D"
                          style={{
                            fontSize: 18
                          }}
                          href="https://www.patreon.com/musicorumapp"
                          prps={{
                            target: '_blank'
                          }}
                        >
                          Patreon
                        </BigColoredButton>
                      </Grid>

                      <Grid item xs={12} sm={6}>
                        <BigColoredButton icon={<TwitterLogo/>} fullWidth textColor="#ffffff" color="#1DA1F2" style={{
                          fontSize: 18,
                        }}>
                          Tweet
                        </BigColoredButton>
                      </Grid>
                    </Grid>
                  </Grid>
                </Grid>
              </Grid>
            </Grid>
          </Grid>
        </Grid>
      </Middle>
    </Content>
  </Section> : null
})

export default ImageShare
