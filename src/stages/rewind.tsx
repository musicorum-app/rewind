import React, {forwardRef, UIEventHandler, useEffect, useRef, useState, WheelEventHandler} from "react";
import {MonthData, RewindData} from "../api/interfaces";
import Section from "../components/Section";
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

interface MonthState {
  actual: MonthData,
  last: MonthData,
  index: number
}


const RewindStage: React.FC<{
  data: RewindData,
}> = forwardRef(({data}) => {
  const [started, setStarted] = useState(false)
  const [stage, setStage] = useState(0)
  const [showDownButton, setShowDownButton] = useState(false)
  const [canChangeSlide, setCanChangeSlide] = useState(false)

  // Section refs
  const splashRef = useRef(null)
  const beginningRef = useRef(null)
  const scrobbleCountRef = useRef(null)
  const topArtistsCountRef = useRef(null)
  const topAlbumsCountRef = useRef(null)
  const topTracksCountRef = useRef(null)
  const favoriteTracksRef = useRef(null)
  const topTagsRef = useRef(null)
  const mainstreamRef = useRef(null)


  useEffect(() => {
    // @ts-ignore
    if (!splashRef.current || started) return
    setStarted(true)
    start()
  }, [started, splashRef.current, beginningRef.current])


  const start = async () => {
    // @ts-ignore
    splashRef.current.start()
    // @ts-ignore
    // topTracksCountRef.current.start()
    // setTimeout(() => mainstreamRef.current.start(), 600)
  }

  const handleSplashEnd = () => {
    // @ts-ignore
    beginningRef.current.start()
  }

  const handleStageEnd = () => {
    setShowDownButton(true)
    setCanChangeSlide(true)
  }

  const handleNextSlideClick = () => {
    if (canChangeSlide) {
      setCanChangeSlide(false)
      setShowDownButton(false)
      const newStage = stage + 1
      setStage(newStage)
      updateStages(newStage, true)
    }
  }

  const handleBackSlideClick = () => {
    if (canChangeSlide && stage > 0) {
      setCanChangeSlide(false)
      setShowDownButton(false)
      const newStage = stage - 1
      setStage(newStage)
      updateStages(newStage, false)
    }
  }

  const updateStages = (stage: number, isNext: boolean) => {
    // @ts-ignore
    // return topArtistsCountRef.current.animateEnd()
    console.log(stage, isNext)

    if (stage === 0) {
      // @ts-ignore
      scrobbleCountRef.current.animateEnd()
        // @ts-ignore
        .then(() => beginningRef.current.start())
    } else if (stage === 1) {
      if (isNext) {
        // @ts-ignore
        beginningRef.current.animateEnd()
          // @ts-ignore
          .then(() => scrobbleCountRef.current.start())
      } else {
        // @ts-ignore
        topArtistsCountRef.current.animateEnd()
          // @ts-ignore
          .then(() => scrobbleCountRef.current.start())
      }
    } else if (stage === 2) {
      if (isNext) {
        // @ts-ignore
        scrobbleCountRef.current.animateEnd()
          // @ts-ignore
          .then(() => topArtistsCountRef.current.start())
      } else {
        console.log('going back huh')

      }
    } else if (stage === 3 && isNext) {
      // @ts-ignore
      topArtistsCountRef.current.animateEnd()
        // @ts-ignore
        .then(() => topAlbumsCountRef.current.start())
    } else if (stage === 4 && isNext) {
      // @ts-ignore
      topAlbumsCountRef.current.animateEnd()
        // @ts-ignore
        .then(() => topTracksCountRef.current.start())
    } else if (stage === 5 && isNext) {
      // @ts-ignore
      topTracksCountRef.current.animateEnd()
        // @ts-ignore
        .then(() => favoriteTracksRef.current.start())
    } else if (stage === 6 && isNext) {
      // @ts-ignore
      favoriteTracksRef.current.animateEnd()
        // @ts-ignore
        .then(() => topTagsRef.current.start())
    } else if (stage === 7 && isNext) {
      // @ts-ignore
      topTagsRef.current.animateEnd()
        // @ts-ignore
        .then(() => mainstreamRef.current.start())
    } else if (stage === 8 && isNext) {
      // @ts-ignore
      mainstreamRef.current.animateEnd()
        // @ts-ignore
        .then(() => scrobbleCountRef.current.start())
    }
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
    <TopTracks data={data} ref={topTracksCountRef} onEnd={handleStageEnd}/>
    <FavoriteTracks data={data} ref={favoriteTracksRef} onEnd={handleStageEnd}/>
    <TopTags data={data} ref={topTagsRef} onEnd={handleStageEnd}/>
    <Mainstream data={data} ref={mainstreamRef} onEnd={handleStageEnd} />

    <SlideController
      stage={stage}
      showBottomIcon={showDownButton}
      onClick={handleNextSlideClick}
      onClickBack={handleBackSlideClick}
    />
  </div>
})

export default RewindStage
