import React, {forwardRef, useEffect, useImperativeHandle, useLayoutEffect, useState} from "react";
import Section from "../components/Section";
import {Nullable, RewindData} from "../api/interfaces";
import styled from "styled-components";
import {gsap, TimelineMax} from 'gsap';
import CustomEase from 'gsap/CustomEase'
import ParallaxWrapper from "../components/ParallaxWrapper";
import Header from "../components/Header";
import {ReactComponent as ScrollerArrow} from '../assets/scrollerArrow.svg'
import {ReactComponent as PlayIcon} from '../assets/playIcon.svg'
import {ReactComponent as PauseIcon} from '../assets/pauseIcon.svg'
import {THEME_COLOR} from "../Constants";
import {handleTrackImage} from "../utils";

gsap.registerPlugin(CustomEase)

// TODO: change by props based on window size
const imageSize = 480

const TopTracksSection = styled.div`
  position: absolute;
  top: 100vh;
  opacity: 0;
`

const TrackItem = styled.div`
  position: absolute;
  top: 50vh;
  left: 50vw;
  transform: translateZ(-90px);
  display: flex;
  justify-content: center;
  opacity: 0;
  //margin-left: calc(50vw - 430px);
  //margin-right: calc(50vw - 430px);
`

const TrackCover = styled.img`
  border-radius: 4px;
  width: ${imageSize}px;
`

const TrackData = styled.div`
  margin-top: 7px;
  position: absolute;
  left: 50vw;
  top: 50vh;
  transform: translateX(-50%) translateY(${imageSize / 2}px) translateZ(-20px);
  text-align: center;
  width: ${imageSize}px;
  font-size: 18px;
`

const TrackDataTitle = styled.span`
  display: block;
  font-weight: 900;
  font-size: 26px;
  color: ${THEME_COLOR};
`

interface NavigationArrowProps {
  available?: boolean
}

const RightNavigationArrow = styled.div`
  position: absolute;
  top: 50vh;
  right: 26px;
  transform: translateY(-50%) translateZ(25px);
  opacity: ${(p: NavigationArrowProps) => p.available ? .6 : 0};
  transition: opacity 0.5s;
  padding: 0px 20px;
  
  &:hover {
    cursor: ${(p: NavigationArrowProps) => p.available ? 'pointer' : 'auto'};
    opacity: ${(p: NavigationArrowProps) => p.available ? 1 : 0};
  }
  
  & > svg {
    width: 60px;
  }
`

const LeftNavigationArrow = styled(RightNavigationArrow)`
  right: auto;
  left: 26px;
  transform: translateY(-50%) translateZ(25px) rotateZ(180deg);
`

const TrackPreview = styled.div`
  width: 100%;
  display: flex;
  justify-content: center;
  margin-top: 20px;
`

const PlayButton = styled.div`
  & > svg {
    width: 42px;
    height: 42px;
    transform: scale(1);
    transition: transform .2s;
    
    &:hover {
      transform: scale(1.18);
      cursor: pointer;
    }
  }
`


const centerImageParams: gsap.TweenVars = {
  translateX: '-50%',
  translateY: '-50%',
  translateZ: -90,
  filter: 'brightness(1)',
  left: '50vw',
  scale: 1
}

const borderImageParams: gsap.TweenVars = {
  translateX: '-50%',
  translateY: '-50%',
  translateZ: -280,
  filter: 'brightness(.3)',
  scale: .92,
  left: '100vw'
}

const TopTracks: React.FC<{
  data: RewindData,
  ref?: React.Ref<HTMLDivElement>,
  onEnd?: () => void;
}> = forwardRef(({onEnd, data}, ref) => {
  const tracks = data.topTracks.slice(0, 16)

  const [show, setShow] = useState(false)
  const [currentTrack, setCurrentTrack] = useState<number>(0)
  const [previewPlaying, setPreviewPlaying] = useState(false)
  const [windowSize, setWindowSize] = useState<number[]>([0, 0])
  const [audio, setAudio] = useState<Nullable<HTMLAudioElement>>(null)

  useLayoutEffect(() => {
    function updateSize() {
      setWindowSize([window.innerWidth, window.innerHeight]);
    }

    window.addEventListener('resize', updateSize);
    updateSize();
    return () => window.removeEventListener('resize', updateSize);
  }, []);

  useEffect(() => {
    if (show) {
      setupScroll()
      const tl = new TimelineMax()
        .from('.topTracksItem', {
          scale: .7
        })
        .to('#topTracksSection', {
          top: 0,
          duration: 0
        }, 0)
        .to('#topTracksSection', {
          opacity: 1
        }, 0)
    }
  }, [show])

  const setupScroll = () => {
    gsap.set('.topTracksItem', {
      ...borderImageParams,
      left: '150vw',
      opacity: 1
    })
    gsap.set('#topTracksItem-0', {
      ...centerImageParams,
      opacity: 1
    })
    gsap.set('#topTracksItem-1', {
      ...borderImageParams,
      left: '100vw',
      opacity: 1,
    })
  }

  const updateOrder = (newOrder: number) => {
    if (audio) {
      audio.pause()
      setPreviewPlaying(false)
    }

    console.log(newOrder)
    if (newOrder >= tracks.length) return
    if (newOrder < 0) return

    if (newOrder - 2 >= 0) {
      gsap.to(`#topTracksItem-${newOrder - 2}`, {
        // ...borderImageParams,
        left: '-50vw',
      })
    }

    gsap.to(`#topTracksItem-${newOrder - 1}`, {
      ...borderImageParams,
      left: '0vw',
    })

    if (newOrder <= tracks.length - 1) {
      gsap.to(`#topTracksItem-${newOrder}`, {
        ...centerImageParams,
      })
    }

    gsap.to(`#topTracksItem-${newOrder + 1}`, {
      ...borderImageParams,
      // left: '0vw',
    })

    if (newOrder <= tracks.length - 1) {
      gsap.to(`#topTracksItem-${newOrder + 2}`, {
        ...borderImageParams,
        left: '150vw',
      })
    }

    setCurrentTrack(newOrder)

  }

  const start = () => {
    setShow(true)
  }

  const animateEnd = () => {
    return new Promise(resolve => {
      new TimelineMax().to('#topTracksSection', {
        opacity: 0
      })
        .to('#topTracksSection', {
          top: '100vh',
          duration: 0,
          onComplete: resolve
        })
    })
  }

  // @ts-ignore
  useImperativeHandle(ref, () => ({
    start,
    animateEnd
  }))

  // console.log(tracks)

  const handlePreviewButtonClick = () => {
    const track = tracks[currentTrack]
    if (!track) console.error('Track not found!')
    if (!track.preview) console.error('Preview not found!')

    // Pause
    if (previewPlaying) {
      if (audio) audio.pause()
      // Play
    } else {
      if (!audio) {
        const audioObject = new Audio(track.preview)
        setAudio(audioObject)
        audioObject.addEventListener('canplaythrough', () => {
          audioObject.play()
        })
        audioObject.addEventListener('ended', () => {
          audioObject.pause()
          setPreviewPlaying(false)
        })
      } else {
        audio.src = track.preview || ''

      }
    }

    setPreviewPlaying(!previewPlaying)
  }

  return show ? <Section center>
    <TopTracksSection id="topTracksSection">
      <ParallaxWrapper>
        <Header title="THE TRACKS">
        </Header>
        {/*<TracksScroller>*/}
        {tracks.map((track, index) => (
          <TrackItem className="topTracksItem" id={`topTracksItem-${index}`} key={track.url}>
            <TrackCover draggable={false} src={handleTrackImage(track.image)}/>
          </TrackItem>
        ))}
        {/*</TracksScroller>*/}

        <TrackData>
          <TrackDataTitle>
            {tracks[currentTrack].name}
          </TrackDataTitle>
          {tracks[currentTrack].artist}
          <TrackPreview>
            {
              tracks[currentTrack].preview ? <PlayButton
                onClick={handlePreviewButtonClick}
              >
                {
                  previewPlaying ? <PauseIcon/> : <PlayIcon/>
                }
              </PlayButton> : tracks[currentTrack].spotify ?
                <iframe
                  src={`https://open.spotify.com/embed/track/${tracks[currentTrack].spotify}`}
                  width="100%"
                  height="80"
                  frameBorder="0"
                  allowTransparency={true}
                  allow="encrypted-media"
                /> : null
            }
          </TrackPreview>
        </TrackData>

        <LeftNavigationArrow available={currentTrack > 0}
                             onClick={() => updateOrder(currentTrack - 1)}>
          <ScrollerArrow/>
        </LeftNavigationArrow>

        <RightNavigationArrow available={currentTrack !== tracks.length - 1}
                              onClick={() => updateOrder(currentTrack + 1)}>
          <ScrollerArrow/>
        </RightNavigationArrow>
      </ParallaxWrapper>
    </TopTracksSection>
  </Section> : null
})

TopTracks.defaultProps = {
  onEnd: () => {
  }
}

export default TopTracks
