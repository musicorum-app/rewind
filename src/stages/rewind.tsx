import React, {forwardRef, useEffect, useRef, useState} from "react";
import {MonthData, RewindData} from "../api/interfaces";
import Section from "../components/Section";
import MonthsAnimation from "../sections/MonthsAnimation";
import SlideController from "../components/SlideController";
import BeginningSection from "../sections/Beginning";
import ScrobbleCount from "../sections/ScrobbleCount";
import TopArtists from "../sections/TopArtists";

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


  useEffect(() => {
    // @ts-ignore
    if (!splashRef.current || started) return
    setStarted(true)
    start()
  }, [started, splashRef.current, beginningRef.current])


  const start = async () => {
    // @ts-ignore
    // splashRef.current.start()
    // @ts-ignore
    topArtistsCountRef.current.start()
  }

  const handleSplashEnd = () => {
    // @ts-ignore
    beginningRef.current.start()
  }

  const handleBeginningEnd = () => {
    setShowDownButton(true)
    setCanChangeSlide(true)
  }

  const handleScrobblingEnd = () => {
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

  const updateStages = (stage: number, isNext: boolean) => {
    if (stage === 0) {

    } else if (stage === 1 && isNext) {
      // @ts-ignore
      beginningRef.current.animateEnd()
      // @ts-ignore
        .then(() => scrobbleCountRef.current.start())
    }
  }


  return <div>
    <MonthsAnimation data={data} ref={splashRef} onEnd={handleSplashEnd} />
    <BeginningSection data={data} ref={beginningRef} onEnd={handleBeginningEnd} />
    <ScrobbleCount data={data} ref={scrobbleCountRef} onEnd={handleScrobblingEnd} />
    <TopArtists data={data} ref={topArtistsCountRef} />

    <SlideController
      stage={stage}
      showBottomIcon={showDownButton}
      onClick={handleNextSlideClick}
    />
  </div>
})

export default RewindStage
