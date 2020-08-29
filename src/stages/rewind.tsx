import React, {forwardRef, useEffect, useRef, useState} from "react";
import {MonthData, RewindData} from "../api/interfaces";
import Section from "../components/Section";
import SplashSection from "../sections/splash";
import SideController from "../components/SideController";
import BeginningSection from "../sections/beginning";

interface MonthState {
  actual: MonthData,
  last: MonthData,
  index: number
}

const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']

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
    setTimeout(() => splashRef.current.start(), 1000)
  }

  const handleSplashEnd = () => {
    // @ts-ignore
    beginningRef.current.start()
  }


  return <div>
    <SplashSection data={data} ref={splashRef} onEnd={handleSplashEnd} />
    <BeginningSection data={data} ref={beginningRef} />

    <SideController />
  </div>
})

export default RewindStage
