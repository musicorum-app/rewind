import React, {forwardRef, useImperativeHandle} from "react";
import Section from "../components/Section";
import {RewindData} from "../api/interfaces";
import styled from "styled-components";
import {gsap, TimelineMax} from 'gsap';
import CustomEase from 'gsap/CustomEase'
import Header from "../components/Header";
import {handleTrackImage} from "../utils";
import {Emphasized, Title} from '../common'
import ParallaxWrapper from "../components/ParallaxWrapper";
import {useMediaQuery} from "@material-ui/core";
import Grid from "@material-ui/core/Grid";
import {Trans, useTranslation} from "react-i18next";

gsap.registerPlugin(CustomEase)

const mediaQueryBreak = 800

const Content = styled.div`
  opacity: 0;
  height: 100%
`

const TrackWrapper = styled.div`
  position: fixed;
  right: 80px;
  top: 50vh;
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: -20;
  height: 85vh;
  max-height: 45vw;
  transform: translateZ(-100px) translateY(-50%);
  perspective: 1500px;
`

const TrackData = styled.div`
  flex-direction: column;
  justify-content: flex-end;
  display: flex;
  text-align: right;
  height: 100%;
  padding-right: 16px;
  padding-left: 28px;
  font-size: 17px;
  transform: translateZ(50px);
`

const TrackDataSmall = styled.div`
  padding: 30px;
  padding-top: 10px;
`

const TrackCoverWraper = styled.div`
  height: 100%;
  max-width: 45vw;
`

const TrackCover = styled.img`
  border-radius: 4px;
  height: 100%;
  
  @media(max-width: ${mediaQueryBreak}px) {
    margin-top: 20px;
    width: 70vw;
    height: 70vw;
  }
  
  @media(max-width: 400px) {
    width: 82vw;
    height: 82vw;
  }
  
  @media(max-width: 400px) and (max-height: 680px) {
    margin-top: 6px;
    width: 58vw;
    height: 58vw;
  }
`

const WidthCenter = styled.div`
  width: 100%;
  display: flex;
  justify-content: center;
`

const BeginningSection: React.FC<{
  data: RewindData,
  ref?: React.Ref<HTMLDivElement>,
  onEnd?: () => void;
}> = forwardRef(({data, onEnd}, ref) => {

  const {t} = useTranslation()
  const smol = useMediaQuery(`(max-width: ${mediaQueryBreak}px)`)

  const start = () => {
    const tl = new TimelineMax()
      .fromTo('#beginningContent', {
        opacity: 0
      }, {
        opacity: 1,
        scale: 1,
        duration: 0
      })
      .fromTo('#beginningContent', {
        y: '100vh'
      }, {
        y: '0px',
        // ease: 'expo.out',
        duration: 1.6,
      }, 0)
      .to({}, {
        duration: .5,
        onComplete: () => {
          if (onEnd) onEnd()
        }
      })
  }

  const animateEnd = () => {
    return new Promise(resolve => {
      const tl = new TimelineMax()
      tl.to('#beginningContent', {
        scale: .8,
        opacity: 0,
        duration: .6,
        onComplete: () => {
          resolve()
        }
      })
        .to('#beginningContent', {
          top: '100vh',
          duration: 0
        })
      console.log('Beginning end')
    })
  }

  // @ts-ignore
  useImperativeHandle(ref, () => ({
    start,
    animateEnd
  }))

  const date = new Date(data.firstTrack.listenedAt).toLocaleDateString(undefined, {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  })

  return <Section>
    <Content id="beginningContent">
      <ParallaxWrapper center={smol}>
        <div style={{
          transform: 'translateZ(40px)'
        }}>
          <Header title={t('sections.beginning.title')} notAbsolute={smol}>
            <Trans
              i18nKey='sections.beginning.subTitle'
              components={[
                <strong key={0} />
              ]}
            />
          </Header>
        </div>
        {
          smol ? [
            <Grid container direction="column" style={{transformStyle: 'preserve-3d', transform: 'translateZ(-100px)'}}>
              <Grid item xs={12} style={{width: '100%', transformStyle: 'preserve-3d'}}>
                <WidthCenter>
                  <TrackCover src={handleTrackImage(data.firstTrack.image)}/>
                </WidthCenter>
              </Grid>
              <Grid item xs={12} style={{transformStyle: 'preserve-3d'}}>
                <TrackDataSmall>
                  <Trans
                    i18nKey='sections.beginning.text'
                    components={[
                      <Title key={0} />,
                      <Emphasized key={1} />
                    ]}
                    values={{
                      name: data.firstTrack.name,
                      artist: data.firstTrack.artist,
                      date
                    }}
                  />
                </TrackDataSmall>
              </Grid>
            </Grid>
          ] : <TrackWrapper>
            <TrackData>
              <div>
                <Trans
                  i18nKey='sections.beginning.text'
                  components={[
                    <Title key={0} />,
                    <Emphasized key={1} />
                  ]}
                  values={{
                    name: data.firstTrack.name,
                    artist: data.firstTrack.artist,
                    date
                  }}
                />
              </div>
            </TrackData>
            <TrackCoverWraper>
              <TrackCover src={handleTrackImage(data.firstTrack.image)}/>
            </TrackCoverWraper>
          </TrackWrapper>
        }
      </ParallaxWrapper>
    </Content>
  </Section>
})

export default BeginningSection
