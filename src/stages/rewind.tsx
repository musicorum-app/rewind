import React, {forwardRef, useEffect, useRef, useState} from "react";
import {MonthData, RewindData, Section} from "../api/interfaces";
import MonthsAnimation from "../sections/MonthsAnimation";
import SlideController from "../components/SlideController";
import BeginningSection from "../sections/Beginning";
import ScrobbleCount from "../sections/ScrobbleCount";
import TopArtists from "../sections/TopArtists";
import TopAlbums from "../sections/TopAlbums";
import TopTracks from "../sections/TopTracks";
import FavoriteTracks from "../sections/FavoriteTracks";
import TopTags from "../sections/TopTags";
import Mainstream from "../sections/Mainstream";
import Analysis from "../sections/Analysis";
import useSectionController from "../hooks/sectionController";
import AlbumMeme from "../sections/AlbumMeme";
import SplashEnd from "../sections/SplashEnd";
import PlaylistSection from "../sections/PlaylistSection";
import ImageShare from "../sections/ImageShare";
import {FullScreen, useFullScreenHandle} from "react-full-screen/dist";
import EndingSection from "../sections/EndingSection";
import {useSwipeable} from 'react-swipeable'
import {generateAlbumMeme, generateNormalShare, generatePlaylistCover, generateStoriesShare} from "../image";

const RewindStage: React.FC<{
  data: RewindData,
  useSensor?: boolean,
  onSensorChange?: (use: boolean) => void
}> = forwardRef(({data, useSensor, onSensorChange}) => {
  const [started, setStarted] = useState(false)
  const [sections, setSections] = useState<Section[]>([])
  const [isAnimating, currentSection, prev, next, handleStageEnd] = useSectionController(sections)
  const [generationStarted, setGenerationStarted] = useState(false)

  const swipeableHandlers = useSwipeable({
    onSwipedDown: prev,
    onSwipedUp: next
  })

  const handle = useFullScreenHandle()

  // Section refs
  const splashRef = useRef(null)
  const beginningRef = useRef(null)
  const scrobbleCountRef = useRef(null)
  const topArtistsCountRef = useRef(null)
  const topAlbumsCountRef = useRef(null)
  const albumMemeRef = useRef(null)
  const topTracksCountRef = useRef(null)
  const favoriteTracksRef = useRef(null)
  const topTagsRef = useRef(null)
  const mainstreamRef = useRef(null)
  const analysisRef = useRef(null)
  const splashEnd = useRef(null)
  const playlistRef = useRef(null)
  const imageShareRef = useRef(null)
  const endingSectionRef = useRef(null)

  const refs = [
    beginningRef,
    scrobbleCountRef,
    topArtistsCountRef,
    topAlbumsCountRef,
    albumMemeRef,
    topTracksCountRef,
    favoriteTracksRef,
    topTagsRef,
    mainstreamRef,
    analysisRef,
    splashEnd,
    playlistRef,
    imageShareRef,
    endingSectionRef
  ]


  useEffect(() => {
    // @ts-ignore
    if (!splashRef.current || started) return

    setSections(refs.map(r => (r.current as unknown as Section)))
    setStarted(true)

    preGenerate().then(() => {
      setGenerationStarted(true)
    })
  }, [started, splashRef.current, beginningRef.current])

  useEffect(() => {
    if (started && generationStarted) {
      (splashRef.current as unknown as Section).start()
      // (albumMemeRef.current as unknown as Section).start()
      // (endingSectionRef.current as unknown as Section).start()
    }
  }, [started, generationStarted])

  const handleSplashEnd = () => {
    // @ts-ignore
    beginningRef.current.start()
    next()
  }

  const preGenerate = async () => {
    data.images = {
      playlist: localStorage.getItem('image.playlist') || '',
      normalShare: localStorage.getItem('image.normalShare') || '',
      storyShare: localStorage.getItem('image.storyShare') || '',
      albumMeme: localStorage.getItem('image.albumMeme') || ''
    }
  }

  const handleNextSlideClick = () => {
    next()
  }

  const handleBackSlideClick = () => {
    prev()
  }

  const handleScrollEvent = (event: React.WheelEvent<HTMLDivElement>) => {
    // return 0
    if (event.deltaY > 0) handleNextSlideClick()
    else handleBackSlideClick()
  }




  return <div onWheel={handleScrollEvent} {...swipeableHandlers}>
    <FullScreen handle={handle}>
      <MonthsAnimation data={data} ref={splashRef} onEnd={handleSplashEnd}/>
      <BeginningSection data={data} ref={beginningRef} onEnd={handleStageEnd}/>
      <ScrobbleCount data={data} ref={scrobbleCountRef} onEnd={handleStageEnd}/>
      <TopArtists data={data} ref={topArtistsCountRef} onEnd={handleStageEnd}/>
      <TopAlbums data={data} ref={topAlbumsCountRef} onEnd={handleStageEnd}/>
      <AlbumMeme data={data} ref={albumMemeRef} onEnd={handleStageEnd}/>
      <TopTracks data={data} ref={topTracksCountRef} onEnd={handleStageEnd}/>
      <FavoriteTracks data={data} ref={favoriteTracksRef} onEnd={handleStageEnd}/>
      <TopTags data={data} ref={topTagsRef} onEnd={handleStageEnd}/>
      <Mainstream data={data} ref={mainstreamRef} onEnd={handleStageEnd}/>
      <Analysis data={data} ref={analysisRef} onEnd={handleStageEnd}/>
      <SplashEnd data={data} ref={splashEnd} onEnd={handleStageEnd}/>
      <PlaylistSection data={data} ref={playlistRef} onEnd={handleStageEnd}/>
      <ImageShare data={data} ref={imageShareRef} onEnd={handleStageEnd}/>
      <EndingSection data={data} ref={endingSectionRef} onEnd={handleStageEnd}/>

      <SlideController
        stage={currentSection}
        showBottomIcon={!isAnimating}
        onClick={handleNextSlideClick}
        onClickBack={handleBackSlideClick}
        handle={handle}
        sectionCount={sections.length}
        useSensor={useSensor}
        onSensorChange={onSensorChange}
      />
    </FullScreen>
  </div>
})

export default RewindStage
