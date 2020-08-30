import React, {forwardRef, useEffect, useRef, useState} from "react";
import {MonthData, RewindData} from "../api/interfaces";
import Section from "../components/Section";
import MonthsAnimation from "../sections/MonthsAnimation";
import SideController from "../components/SideController";
import BeginningSection from "../sections/Beginning";

interface MonthState {
  actual: MonthData,
  last: MonthData,
  index: number
}


const RewindStage: React.FC<{
  data: RewindData,
}> = forwardRef(({data}) => {

  const [started, setStarted] = useState(false)

  // Section refs
  const splashRef = useRef(null)
  const beginningRef = useRef(null)


  useEffect(() => {
    // @ts-ignore
    if (!splashRef.current || started) return
    setStarted(true)
    start()
  }, [started, splashRef.current, beginningRef.current])


  const start = async () => {
    // @ts-ignore
    splashRef.current.start()
  }

  const handleSplashEnd = () => {
    // @ts-ignore
    beginningRef.current.start()
  }


  return <div>
    <MonthsAnimation data={data} ref={splashRef} onEnd={handleSplashEnd} />
    <BeginningSection data={data} ref={beginningRef} />

    <SideController />
  </div>
})

export default RewindStage
