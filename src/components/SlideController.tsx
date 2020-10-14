import React from "react";
import styled from 'styled-components'
import {THEME_COLOR} from "../Constants";
import {ReactComponent as NavigationIcon} from '../assets/navigation.svg'
import {ReactComponent as DownNavigationIcon} from '../assets/navigateDown.svg'
import {ReactComponent as FullscreenIcon} from '../assets/fullscreen.svg'
import {ReactComponent as ExitFullScreenIcon} from '../assets/exitFullscreen.svg'
import {FullScreenHandle} from "react-full-screen/dist";

const Controller = styled.div`
  //height: 100vh;
  position: absolute;
  right: 0px;
  bottom: 0px;
  display: flex;
  justify-content: flex-end;
  flex-flow: column;
  align-items: center;
  padding: 0px 15px 15px 0px;
  opacity: .7;
  transition: opacity .4s;
  &:hover {
    opacity: 1;
  }
`

const Navigation = styled(NavigationIcon)`
  width: 25px;
  stroke: rgba(253, 15, 87, 0.5);
  transition: stroke .4s;
  &:hover {
    stroke: rgba(253, 15, 87, 0.8);
    cursor: pointer;
  }
`

const NavigationDown = styled(Navigation)`
  transform: rotateZ(180deg);
`

const NavigationText = styled.span`
  color: ${THEME_COLOR};
  font-weight: 600;
  text-align: center;
  font-size: 16px;
  margin: 2px 0px 2px 0px;
`

interface DownIconProps {
  show?: boolean
}

const DownIcon = styled(DownNavigationIcon)`
  position: absolute;
  bottom: 20px;
  left: 50vw;
  transform: translateX(-50%);
  opacity: ${(props: DownIconProps) => props.show ? '.4' : '0'};
  transition: opacity .4s;
  &:hover {
    opacity: ${(props: DownIconProps) => props.show ? '.7' : '0'};
    cursor: ${(props: DownIconProps) => props.show ? 'pointer' : ''};;
  }
  
  @media(max-width: 800px) {
    bottom: 10px;
  }
`

const FullScreenButtonBase = `
  position: absolute;
  left: 16px;
  bottom: 16px;
  width: 28px;
  height: 28px;
  transition: transform .18s;
  
  &: hover {
    transform: scale(1.3);
    cursor: pointer;
  }
`

const FullScreenButton = styled(FullscreenIcon)`${FullScreenButtonBase}`
const ExitFullScreenButton = styled(ExitFullScreenIcon)`${FullScreenButtonBase}`

const SlideController: React.FC<{
  showBottomIcon?: boolean,
  onClick?: () => void,
  onClickBack?: () => void,
  stage?: number,
  handle?: FullScreenHandle
}> = ({showBottomIcon, stage, onClick, onClickBack, handle}) => {


  return <div>
    {/*<button onClick={openFullScreen}>*/}
    {/*  FS*/}
    {/*</button>*/}

    {
      handle && document.documentElement.requestFullscreen ? <>
        {
          handle.active
            ? <ExitFullScreenButton onClick={handle.exit}/>
            : <FullScreenButton onClick={handle.enter}/>
        }
      </> : null
    }

    <Controller>
      <Navigation onClick={onClickBack}/>
      <NavigationText>
        {(stage || 0) + 1} / 9
      </NavigationText>
      <NavigationDown onClick={showBottomIcon ? onClick : () => {
      }}/>
    </Controller>
    {
      <DownIcon show={showBottomIcon} onClick={onClick}/>
    }
  </div>
}


export default SlideController
