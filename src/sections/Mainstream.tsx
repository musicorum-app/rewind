import React, {forwardRef, useEffect, useImperativeHandle, useState} from "react";
import Section from "../components/Section";
import {RewindData, SpotifyArtistBase} from "../api/interfaces";
import styled from "styled-components";
import {gsap, TimelineMax} from 'gsap';
import CustomEase from 'gsap/CustomEase'
import ParallaxWrapper from "../components/ParallaxWrapper";
import {THEME_COLOR} from "../Constants";

gsap.registerPlugin(CustomEase)

const Content = styled.div`
  opacity: 0;
  height: 100%;
  top: 200vh;
`

const LeftSideArtist = styled.div`
  position: absolute;
  top: 50vh;
  left: 6vw;
  transform: translateY(-50%);
  width: 25vw;
  text-align: center;
`

const RightSideArtist = styled(LeftSideArtist)`
  right: 6vw;
  left: auto;
`

const ArtistImage = styled.img`
  width: 100%;
  border-radius: 4px;
`

const ArtistName = styled.span`
  color: ${THEME_COLOR};
  font-size: 18px;
  margin-bottom: 10px;
  font-weight: 700;
`


const Mainstream: React.FC<{
  data: RewindData,
  ref?: React.Ref<HTMLDivElement>,
  onEnd?: () => void;
}> = forwardRef(({data, onEnd}, ref) => {

  const [show, setShow] = useState(false)
  const [ordered, setOrdered] = useState<SpotifyArtistBase[]>([])

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
          duration: 1
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
      tl.to('#mainstreamSection', {
        scale: .8,
        opacity: 0,
        duration: .6,
        onComplete: () => {
          resolve()
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
        <LeftSideArtist>
          <ArtistName>
            {
              ordered[0].name
            }
          </ArtistName>
          <ArtistImage src={ordered[0].image}/>
        </LeftSideArtist>
        <RightSideArtist>
          <ArtistName>
            {
              last.name
            }
          </ArtistName>
          <ArtistImage src={last.image}/>
        </RightSideArtist>
      </ParallaxWrapper>
    </Content>
  </Section> : null
})

export default Mainstream
