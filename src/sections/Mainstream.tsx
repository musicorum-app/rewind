import React, {forwardRef, useEffect, useImperativeHandle, useState} from "react";
import Section from "../components/Section";
import {RewindData, SpotifyArtistBase} from "../api/interfaces";
import styled from "styled-components";
import {gsap, TimelineMax} from 'gsap';
import CustomEase from 'gsap/CustomEase'
import ParallaxWrapper from "../components/ParallaxWrapper";
import {THEME_COLOR} from "../Constants";
import chroma from "chroma-js";
import {useMediaQuery} from "@material-ui/core";
import {Trans, useTranslation} from "react-i18next";

gsap.registerPlugin(CustomEase)

const mediaQueryBreak = 800

const Content = styled.div`
  opacity: 0;
  height: 100%;
  top: 200vh;
  transform-style: preserve-3d;
  perspective: 1000px;
`

const LeftSideArtist = styled.div`
  position: absolute;
  top: 50vh;
  left: 0;
  transform: translate3d(0, -50%, -130px);
  width: 25vw;
  text-align: center;
  transform-style: preserve-3d;
  //transform-origin: top;
  backface-visibility: hidden;
  font-size: 20px;
`

const RightSideArtist = styled(LeftSideArtist)`
  right: 0;
  left: auto;
  //transform-origin: bottom;
`

const ArtistSide = styled.div`
  @media(max-width: ${mediaQueryBreak}px) {
    width: 90%;
    text-align: center;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    
    font-size: 14px;
  }
`

const ArtistImage = styled.img`
  width: 100%;
  border-radius: 4px;
  
  @media(max-width: ${mediaQueryBreak}px) {
    width: 180px;
    height: 180px;
  }
  
  @media(max-width: ${mediaQueryBreak}px) and (max-height: 850px) {
    width: 80px;
    height: 80px;
  }
`

const ArtistName = styled.span`
  color: ${THEME_COLOR};
  font-size: 24px;
  margin-bottom: 10px;
  font-weight: 800;
  
  @media(max-width: ${mediaQueryBreak}px) {
    font-size: 20px;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    margin-bottom: 6px;
  }
  
  @media(max-width: ${mediaQueryBreak}px) and (max-height: 700px) {
  font-size: 17px;
  }
`

const MainstreamPercent = styled.div`
  position: absolute;
  left: 50vw;
  top: 50vh;
  transform: translateZ(30px) translateX(-50%) translateY(-50%);
  width: calc(50vw - 12vw - 50px);
  height: 25vw;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  
  
  @media(max-width: ${mediaQueryBreak}px) {
    position: unset;
    left: unset;
    top: unset;
    transform: unset;
    width: 270px;
    height: auto;
    margin: 38px 4px;
    text-align: center;
  }
  
  @media(max-width: ${mediaQueryBreak}px) and (max-height: 700px) {
    margin: 26px 4px;  
  }
`

const MainstreamPercentNumberWrapper = styled.div`
  overflow: hidden;
`

const MainstreamPercentNumber = styled.span`
  color: ${THEME_COLOR};
  font-size: 100px;
  font-weight: 900;
  position: relative;
  line-height: 80px;
  padding-bottom: 20px;
  
  @media(max-width: ${mediaQueryBreak}px) {
    font-size: 50px;
    line-height: 40px;
  }
`

const ProgressBar = styled.div`
  background-color: ${chroma(THEME_COLOR).darken(4).css()};
  height: 16px;
  width: 100%;
  margin-bottom: 10px;
  @media(max-width: ${mediaQueryBreak}px) {
  height: 8px;
  }
`

interface ProgressBarInsideProps {
  percent: number
}

const ProgressBarInside = styled.div`
  background-color: ${THEME_COLOR};
  width: ${(p: ProgressBarInsideProps) => p.percent}%;
  height: 100%;
`

const Notice = styled.div`
  position: absolute;
  left: 0;
  bottom: 0;
  padding: 48px 7px;
  font-size: 13px;
  
  @media(max-width: ${mediaQueryBreak}px) {
    font-size: 11px;
  }
`

const SmallContentWrapper = styled.div`
  display: flex;
  width: 100%;
  height: 90%;
  position: absolute;
  left: 0;
  top: 50vh;
  transform: translateY(-50%);
  flex-direction: column;
  justify-content: center;
  align-items: center;
  transform-style: preserve-3d;
  perspective: 1000px;
  padding-bottom: 40px;
`

const SmallContentBottomText = styled.span`
  font-size: 13px;
  
  @media(max-width: ${mediaQueryBreak}px) and (max-height: 700px) {
    font-size: 10px;
  }
`


const Mainstream: React.FC<{
  data: RewindData,
  ref?: React.Ref<HTMLDivElement>,
  onEnd?: () => void;
}> = forwardRef(({data, onEnd}, ref) => {

  const {t} = useTranslation()
  const [show, setShow] = useState(false)
  const [ordered, setOrdered] = useState<SpotifyArtistBase[]>([])
  const small = useMediaQuery(`(max-width: ${mediaQueryBreak}px)`)

  const average = ordered
    .map(a => a.popularity)
    .reduce((a, b) => a + b, 0) / ordered.length

  useEffect(() => {
    if (show) {
      const tl = new TimelineMax()
        .to('#mainstreamSection', {
          // opacity: 1,
          // scale: 1,
          top: 0,
          duration: 0
        })
        .fromTo('#mainstreamSection', {
          opacity: 0
        }, {
          scale: 1,
          opacity: 1,
          duration: 0
        })
        .from('#mainstreamSectionBar', {
          width: 0
        }, .5)
        .from('#mainstreamSectionArtistSide-1', {
          opacity: 0,
          rotateX: -170,
          duration: 1.7,
          ease: 'expo.out'
        }, .8)
        .from('#mainstreamSectionArtistSide-2', {
          opacity: 0,
          rotateX: 170,
          duration: 1.7,
          ease: 'expo.out'
        }, .8)
        .from('#mainstreamSectionNumber', {
          top: 90,
          duration: 1.2,
          ease: 'expo.out'
        }, .8)
        .from('#mainstreamSectionSubtext', {
          opacity: 0
        }, 1.5)
        .from('#mainstreamSectionNotice', {
          opacity: 0
        }, 3)


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
      tl.to('#mainstreamSection', {
        scale: .8,
        opacity: 0,
        duration: .6,
        onComplete: () => {
          resolve()
          setShow(false)
        }
      })
        .to('#mainstreamSection', {
          top: '100vh',
          duration: 0
        })

      console.log('Mainstream end')
    })
  }

  const start = () => {
    setOrdered([...(data.spotifyData || [])]
      .filter(a => a)
      .sort((a, b) => b.popularity - a.popularity)
    )
    console.log('Mainstream favorites')
    setShow(true)
  }

  // @ts-ignore
  useImperativeHandle(ref, () => ({
    start,
    animateEnd
  }))

  const last = ordered[ordered.length - 1]

  return show ? <Section>
    <Content id="mainstreamSection">
      <ParallaxWrapper>

        {
          small ? <>

            <SmallContentWrapper>
              <ArtistSide id="mainstreamSectionArtistSide-1">
                <ArtistName>
                  {
                    ordered[0].name
                  }
                </ArtistName>
                <ArtistImage src={ordered[0].image}/>
                <SmallContentBottomText>
                  <Trans
                    i18nKey='sections.mainstream.popular'
                    components={[
                      <b/>
                    ]}
                    values={{
                      popularity: ordered[0].popularity
                    }}
                  />
                </SmallContentBottomText>
              </ArtistSide>

              <MainstreamPercent>
                <MainstreamPercentNumberWrapper>
                  <MainstreamPercentNumber id="mainstreamSectionNumber">
                    {~~average}%
                  </MainstreamPercentNumber>
                </MainstreamPercentNumberWrapper>
                <ProgressBar id="mainstreamSectionBar">
                  <ProgressBarInside percent={average}/>
                </ProgressBar>
                <span id="mainstreamSectionSubtext">
                  {t('sections.mainstream.text')}
                </span>
              </MainstreamPercent>

              <ArtistSide id="mainstreamSectionArtistSide-2">
                <ArtistName>
                  {
                    last.name
                  }
                </ArtistName>
                <ArtistImage src={last.image}/>
                <SmallContentBottomText>
                  <Trans
                  i18nKey='sections.mainstream.least'
                  components={[
                    <b/>
                  ]}
                  values={{
                    popularity: last.popularity
                  }}
                />
                </SmallContentBottomText>
              </ArtistSide>
            </SmallContentWrapper>

          </> : [
            <LeftSideArtist id="mainstreamSectionArtistSide-1">
              <ArtistSide>
                <ArtistName>
                  {
                    ordered[0].name
                  }
                </ArtistName>
                <ArtistImage src={ordered[0].image}/>
                <Trans
                  i18nKey='sections.mainstream.popular'
                  components={[
                    <b/>
                  ]}
                  values={{
                    popularity: ordered[0].popularity
                  }}
                />
              </ArtistSide>
            </LeftSideArtist>,

            <MainstreamPercent>
              <MainstreamPercentNumberWrapper>
                <MainstreamPercentNumber id="mainstreamSectionNumber">
                  {~~average}%
                </MainstreamPercentNumber>
              </MainstreamPercentNumberWrapper>
              <ProgressBar id="mainstreamSectionBar">
                <ProgressBarInside percent={average}/>
              </ProgressBar>
              <span id="mainstreamSectionSubtext">
                 {t('sections.mainstream.text')}
              </span>
            </MainstreamPercent>,

            <RightSideArtist id="mainstreamSectionArtistSide-2">
              <ArtistSide>
                <ArtistName>
                  {
                    last.name
                  }
                </ArtistName>
                <ArtistImage src={last.image}/>
                <Trans
                  i18nKey='sections.mainstream.least'
                  components={[
                    <b/>
                  ]}
                  values={{
                    popularity: last.popularity
                  }}
                />
              </ArtistSide>
            </RightSideArtist>
          ]
        }

        <Notice id="mainstreamSectionNotice">
          {t('sections.mainstream.notice')}
        </Notice>
      </ParallaxWrapper>
    </Content>
  </Section> : null
})

export default Mainstream
