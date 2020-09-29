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

gsap.registerPlugin(CustomEase)


interface ProgressBarInsideProps {
  percent: number
}

interface Analysis {
  average: number,
  top: FormattedTrack[]
}

interface NumberProps {
  size: number
}

interface BackgroundTrack {
  z: number
}


const Content = styled.div`
  opacity: 0;
  height: 100%;
  top: 200vh;
  transform-style: preserve-3d;
  perspective: 1000px;
`

const ValenceCenter = styled.div`
  position: absolute;
  left: 50vw;
  top: 50vh;
  transform: translateX(-50%) translateY(-50%) translateZ(-100px);
  display: flex;
  transform-style: preserve-3d;
`

const ValenceSection = styled.div`
  height: 100%;
  transform-style: preserve-3d;
`

const ValenceNumber = styled.span`
  color: ${THEME_COLOR};
  display: block;
  font-size: ${(p: NumberProps) => p.size}px;
  line-height: ${(p: NumberProps) => p.size - 6}px;
  font-weight: 900;
`

const ValenceText = styled.span`
  position: absolute;
  left: 50vw;
  top: calc(50vh + 90px);
  transform: translateX(-50%) translateY(-50%) translateZ(80px);
`

const Notice = styled.div`
  position: absolute;
  left: 0;
  bottom: 0;
  padding: 24px;
`

const BackgroundTrackImage = styled.img`
  position: absolute;
  filter: brightness(50%);
  border-radius: 4px;
  object-fit: contain;
  object-position: center;
  width: 210px;
  height: 210px;
  transform: translateZ(${(p: BackgroundTrack) => p.z}px);
`


const Analysis: React.FC<{
  data: RewindData,
  ref?: React.Ref<HTMLDivElement>,
  onEnd?: () => void;
}> = forwardRef(({data, onEnd}, ref) => {

  const [show, setShow] = useState(false)
  const [analysis, setAnalysis] = useState<Nullable<Analysis>>(null)

  useEffect(() => {
    const textEase = CustomEase.create("textEase", "M0,0,C0,0.658,0.084,0.792,0.15,0.846,0.226,0.908,0.272,0.976,1,1")

    if (show && analysis) {
      const tl = new TimelineMax()
        .to('#analysisSection', {
          // opacity: 1,
          // scale: 1,
          top: 0,
          duration: 0
        })
        .fromTo('#analysisSection', {
          opacity: 0
        }, {
          scale: 1,
          opacity: 1,
          duration: .1
        })

      const odd = [1, 3]
      const even = [0, 2]

      console.log(even.map(n => `#analysisValenceSection-${n}`))
      const all = new Array(21).fill(1)
        .map((_, i) => i)
        .filter(i => i !== 10)
        .map(i => `.analysisValenceLine-${i}`)

      const durr = 3

      tl.from(even.map(n => `#analysisValenceSection-${n}`), {
        y: '100%',
        ease: 'expo.out',
        duration: durr
      }, 0.4)
        .from(odd.map(n => `#analysisValenceSection-${n}`), {
          y: '-100%',
          ease: 'expo.out',
          duration: durr
        }, 0.4)
        .to('.analysisValenceLine-10', {
          translateZ: 290,
          scale: 1.06,
        }, durr + .3)
        .to(all, {
          opacity: 0
        }, durr + .3)
        .from('.analysisSectionBackgroundImage', {
          opacity: 0,
          y: 90,
          stagger: .08
        })
        .from('.analysisFinalText', {
          opacity: 0,
          y: 10,
          stagger: .1
        })


      tl.to({}, {
        duration: .5,
        onComplete: () => {
          if (onEnd) onEnd()
        }
      })
    }
  }, [show, analysis])

  const animateEnd = () => {
    return new Promise(resolve => {
      const tl = new TimelineMax()
      tl.to('.analysisSectionBackgroundImage', {
        opacity: 0,
        y: -90,
        stagger: .05
      })
        .to('.endText', {
          y: -30,
          opacity: 0,
          duration: .6,
          stagger: .001
        }, 0.3)
        .to('#analysisSection', {
          top: '100vh',
          duration: 0,
          onComplete: () => {
            resolve()
          }
        })

      console.log('Analysis end')
    })
  }

  const start = () => {
    doAnalysis()
    console.log('Analysis favorites')
    setShow(true)
  }

  const doAnalysis = () => {
    const tracks = data.topTracks.filter(t => t.analysis)
    const topValence = tracks.sort((a, b) => b.analysis!.valence - a.analysis!.valence)
    const getAvg = (arr: number[]) => arr.reduce((a, b) => a + b) / arr.length

    setAnalysis({
      top: topValence.slice(0, 6),
      average: ~~(getAvg(topValence.map(t => t.analysis!.valence)) * 100)
    })
  }

  // @ts-ignore
  useImperativeHandle(ref, () => ({
    start,
    animateEnd
  }))

  console.log(analysis)

  const size = 120

  const fragments = (analysis?.average + '%').split('')
  const repeat = new Array(21).fill(1)


  return show ? <Section>
    <Content id="analysisSection">
      <ParallaxWrapper>

        <BackgroundTrackImage className="analysisSectionBackgroundImage" src={handleTrackImage(analysis?.top[1].image)}
                              style={{left: '10vw', top: '12vh'}} z={10}/>
        <BackgroundTrackImage className="analysisSectionBackgroundImage" src={handleTrackImage(analysis?.top[2].image)}
                              style={{left: '40vw', top: '17vh'}} z={-200}/>
        <BackgroundTrackImage className="analysisSectionBackgroundImage" src={handleTrackImage(analysis?.top[3].image)}
                              style={{right: '2vw', top: ' 0vh'}} z={-100}/>
        <BackgroundTrackImage className="analysisSectionBackgroundImage" src={handleTrackImage(analysis?.top[4].image)}
                              style={{left: '60vw', bottom: '12vh'}} z={-40}/>
        <BackgroundTrackImage className="analysisSectionBackgroundImage" src={handleTrackImage(analysis?.top[5].image)}
                              style={{left: '15vw', top: '53vh'}} z={-250}/>

        {
          analysis && <ValenceCenter>
            {
              fragments?.map((f, i) => <ValenceSection key={i} id={`analysisValenceSection-${i}`}>
                {
                  repeat.map((_, i) =>
                    <ValenceNumber key={i} className={`analysisValenceLine-${i} endText`} size={size}>{f}</ValenceNumber>
                  )
                }
              </ValenceSection>)
            }
          </ValenceCenter>
        }

        <ValenceText className="analysisFinalText endText">
          is how positive your songs were
        </ValenceText>

        <Notice className="analysisFinalText endText">
          * Based on an average of your top 150 tracks' valence analysis from Spotify
        </Notice>
      </ParallaxWrapper>
    </Content>
  </Section> : null
})

export default Analysis
