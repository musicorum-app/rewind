import styled from "styled-components";
import React, {forwardRef, MouseEventHandler, useLayoutEffect, useState} from "react";
import {gsap} from 'gsap';

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
}> = forwardRef(({children}, ref) => {
  const [windowSize, setWindowSize] = useState<number[]>([0, 0])

  useLayoutEffect(() => {
    function updateSize() {
      setWindowSize([window.innerWidth, window.innerHeight]);
    }
    window.addEventListener('resize', updateSize);
    updateSize();
    return () => window.removeEventListener('resize', updateSize);
  }, []);

  const update = (event: React.MouseEvent<HTMLElement>) => {
    const center = [windowSize[0] / 2, windowSize[1] / 2]
    const position = [event.pageY, event.pageX]
    const tilt = [
      (position[0] - center[0]) / center[0],
      (position[1] - center[1]) / center[1]
    ]
    const radius = Math.sqrt(Math.pow(tilt[0], 2) + Math.pow(tilt[1], 2))
    const degree = radius * 6
    gsap.to('.parallax', {
      transform: `rotate3d(${tilt[0]}, ${tilt[1]}, 0, ${degree}deg)`
    })
  }

  return <Wrapper onMouseMove={update}>
    <Parallax className="parallax" >
      {
        children
      }
    </Parallax>
  </Wrapper>
})

export default ParallaxWrapper
