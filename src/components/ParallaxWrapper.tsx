import styled from "styled-components";
import React, {forwardRef, useContext, useEffect, useLayoutEffect, useState} from "react";
import {gsap} from 'gsap';
import {useMediaQuery} from "@material-ui/core";
import {Nullable} from "../api/interfaces";
import {convertRange} from "../utils";
// @ts-ignore
import Quaternion from 'quaternion'
import OrientationSensorContext from "../context/orientationSensor";

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
  const useSensor = useContext(OrientationSensorContext)
  const [windowSize, setWindowSize] = useState<number[]>([0, 0])
  const [sensorData, setSensorData] = useState<number[]>([0, 0])
  const [orientationSensor, setSensor] = useState<Nullable<any>>(null)
  const smol = useMediaQuery(`(max-width: 800px)`)

  useEffect(() => {
    if (!orientationSensor) return
    if (useSensor) {
      orientationSensor.start()
    } else {
      orientationSensor.stop()
    }
  }, [useSensor, orientationSensor])

  useEffect(() => {
    const sensor = [sensorData[1] || 0, sensorData[0] || 0]
    const center = [windowSize[0] / 2, windowSize[1] / 2]
    const sensorRange = .3
    // update(
    //   // convertRange(sensor[1], [-sensorRange, sensorRange], [-windowSize[0], windowSize[0]]),
    //   // convertRange(sensor[0], [-sensorRange, sensorRange], [-windowSize[1], windowSize[1]]),
    //   (sensor[1] < 0 ? -sensor[1] : sensor[1]) * windowSize[1],
    //   (sensor[0] < 0 ? -sensor[0] : sensor[0]) * windowSize[0],
    //   true
    // )
    const qt = new Quaternion(sensorData[3], sensorData[0], sensorData[1], sensorData[2])

    const tilt = [
      sensorData[0],
      sensorData[1]
    ]
    const radius = Math.sqrt(Math.pow(tilt[0], 2) + Math.pow(tilt[1], 2))
    const degree = radius * 18

    gsap.to('.parallax', {
      transform: `rotateX(${tilt[0] * degree}deg) rotateY(${tilt[1] * degree}deg)`,
    })

  }, [sensorData, windowSize])

  useLayoutEffect(() => {
    function updateOrientation(v: number[]) {
      setSensorData(v)
    }

    // TODO: sensor opt in
    if ('AbsoluteOrientationSensor' in window) {
    // @ts-ignore
    const sensor = new AbsoluteOrientationSensor({ frequency: 60 });
    Promise.all([navigator.permissions.query({ name: "accelerometer" }),
      navigator.permissions.query({ name: "magnetometer" }),
      navigator.permissions.query({ name: "gyroscope" })])
      .then(results => {
        if (results.every(result => result.state === "granted")) {
          sensor.addEventListener('reading', () => {
            updateOrientation(sensor.quaternion)
          });
          sensor.start()
          setSensor(sensor)
        } else {
          console.log("No permissions to use RelativeOrientationSensor.");
        }
      });
    }

   // window.addEventListener('devicemotion', ev => updateOrientation(ev.rotationRate!.beta, ev.rotationRate!.alpha))
    // @ts-ignore
    //return () => window.removeEventListener('devicemotion', updateOrientation)
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
    const degree = radius * 4
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

      <pre>

      {/*{*/}
      {/*  sensorData.map(d => d.toFixed(2)).toString()*/}
      {/*}*/}

      {/*  {" - "}*/}
      {/*  {((sensorData[1] < 0 ? -sensorData[1] : sensorData[1]) * windowSize[1]).toFixed(2)}*/}
      {/*  ,*/}
      {/*  {((sensorData[0] < 0 ? -sensorData[0] : sensorData[0]) * windowSize[0]).toFixed(2)}*/}

      </pre>
    </h1>
  </Wrapper>
})

export default ParallaxWrapper
