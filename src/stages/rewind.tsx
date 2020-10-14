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


const RewindStage: React.FC<{
  data: RewindData,
}> = forwardRef(({data}) => {
  const [started, setStarted] = useState(false)
  const [sections, setSections] = useState<Section[]>([])
  const [isAnimating, currentSection, prev, next, handleStageEnd] = useSectionController(sections)
  const [generationStarted, setGenerationStarted] = useState(false)

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


  useEffect(() => {
    // @ts-ignore
    if (!splashRef.current || started) return
    const refs = [
      beginningRef,
      scrobbleCountRef,
      topArtistsCountRef,
      topAlbumsCountRef,
      // albumMemeRef,
      topTracksCountRef,
      favoriteTracksRef,
      topTagsRef,
      mainstreamRef,
      analysisRef,
      splashEnd,
      playlistRef,
      imageShareRef
    ]

    setSections(refs.map(r => (r.current as unknown as Section)))
    setStarted(true)
  }, [started, splashRef.current, beginningRef.current])

  useEffect(() => {
    if (started) {
      // @ts-ignore
      // document.documentElement.requestFullscreen()

      (splashRef.current as unknown as Section).start()
      // (mainstreamRef.current as unknown as Section).start()
    }
  }, [started])

  if (currentSection === 9 && !generationStarted && started) {
    setGenerationStarted(true)
    // @ts-ignore
    playlistRef.current.generateImage()
    // @ts-ignore
    imageShareRef.current.generateImage()
  }

  const handleSplashEnd = () => {
    // @ts-ignore
    beginningRef.current.start()
    next()
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


  return <div onWheel={handleScrollEvent}>
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

    <SlideController
      stage={currentSection}
      showBottomIcon={!isAnimating}
      onClick={handleNextSlideClick}
      onClickBack={handleBackSlideClick}
    />
  </div>
})

export default RewindStage
