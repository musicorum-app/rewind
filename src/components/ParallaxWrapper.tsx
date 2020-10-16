import styled from "styled-components";
import React, {forwardRef, useEffect, useLayoutEffect, useState} from "react";
import {gsap} from 'gsap';
import {useMediaQuery} from "@material-ui/core";
// import {RelativeOrientationSensor} from 'motion-sensors-polyfill'
import {Nullable} from "../api/interfaces";
import {convertRange} from "../utils";

const Wrapper = styled.div`
  perspective: 2500px;
  width: 100vw;
  height: 100vh;
  transform-style: preserve-3d; 
`

const Parallax = styled.div`
  transform-style: preserve-3d; 
  width: 100%;
  height: 100%;
`

const ParallaxWrapper: React.FC<{
  ref?: React.Ref<HTMLDivElement>,
  center?: boolean
}> = forwardRef(({children, center}) => {
  const [windowSize, setWindowSize] = useState<number[]>([0, 0])
  const [sensorData, setSensorData] = useState<number[]>([0, 0])
  // const [sensor, setSensor] = useState<Nullable<AbsoluteOrientationSensor>>(null)
  const smol = useMediaQuery(`(max-width: 800px)`)

  useEffect(() => {
    const sensor = [sensorData[0] || 0, sensorData[1] || 0]
    const center = [windowSize[0] / 2, windowSize[1] / 2]
    const sensorRange = 100
    update(
      convertRange(sensor[1], [-sensorRange, sensorRange], [-center[0], center[0]]),
      convertRange(sensor[0], [-sensorRange, sensorRange], [-center[1], center[1]]),
      false
    )
  }, [sensorData, windowSize])

  useLayoutEffect(() => {
    function updateOrientation(x: Nullable<number>, y: Nullable<number>) {
      setSensorData([x || 0, y || 0])
    }

    window.addEventListener('devicemotion', ev => updateOrientation(ev.rotationRate!.beta, ev.rotationRate!.alpha))
    // @ts-ignore
    return () => window.removeEventListener('devicemotion', updateOrientation)
  }, []);

  useLayoutEffect(() => {
    function updateSize() {
      setWindowSize([window.innerWidth, window.innerHeight]);
    }

    window.addEventListener('resize', updateSize);
    updateSize();
    return () => window.removeEventListener('resize', updateSize);
  }, []);

  const updateMouse = (event: React.MouseEvent<HTMLElement>) => {
    if (smol) return
    const position = [event.pageY, event.pageX]
    update(event.pageY, event.pageX)
  }

  const update = (x: number, y: number, tween = true) => {
    const center = [windowSize[0] / 2, windowSize[1] / 2]
    const position = [x, y]
    const tilt = [
      (position[0] - (center[0] * 2)) / center[0],
      (position[1] - (center[1])) / center[1]
    ]
    const radius = Math.sqrt(Math.pow(tilt[0], 2) + Math.pow(tilt[1], 2))
    const degree = radius * 3
    gsap.to('.parallax', {
      transform: `rotate3d(${tilt[0]}, ${tilt[1]}, 0, ${degree}deg)`,
      duration: tween ? 1 : 0
    })
  }

  return <Wrapper style={{
    height: windowSize[1],
    ...(
      center ? {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
      } : {}
    )
  }} onMouseMove={updateMouse}>
    <Parallax className="parallax" style={center ? {
      height: 'auto'
    } : {}}>
      {
        children
      }
    </Parallax>
    <h1 style={{
      position: "absolute",
      left: 30,
      top: 30,
      zIndex: 200,
      transform: 'translateY(100px)'
    }}>

      {
        sensorData.map(d => d.toFixed(2)).toString()
      }

    </h1>
  </Wrapper>
})

export default ParallaxWrapper
