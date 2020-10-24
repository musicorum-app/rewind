import React, {useState} from "react";
import styled from 'styled-components'
import {THEME_COLOR} from "../Constants";
import {ReactComponent as NavigationIcon} from '../assets/navigation.svg'
import {ReactComponent as DownNavigationIcon} from '../assets/navigateDown.svg'
import {ReactComponent as FullscreenIcon} from '../assets/fullscreen.svg'
import {ReactComponent as ExitFullScreenIcon} from '../assets/exitFullscreen.svg'
import {ReactComponent as ConfigIcon} from '../assets/config.svg'
import {FullScreenHandle} from "react-full-screen/dist";
import ConfigDialog from "./ConfigDialog";

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
  opacity: .4;
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
  
  @media(max-width: 800px) {
   width: 20px;
  }
`

const NavigationDown = styled(Navigation)`
  transform: rotateZ(180deg);
`

const NavigationText = styled.span`
  color: ${THEME_COLOR};
  font-weight: 600;
  text-align: center;
  font-size: 14px;
  //margin: 2px 0px 2px 0px;
  
  @media(max-width: 800px) {
  font-size: 11px;
  }
`

interface DownIconProps {
  show?: boolean
}

const DownIcon = styled(DownNavigationIcon)`
  position: absolute;
  bottom: 20px;
  left: 50vw;
  transform: translateX(-50%) scale(1);
  opacity: ${(props: DownIconProps) => props.show ? '.4' : '0'};
  transition: opacity .2s, transform .2s;
  &:hover {
    opacity: ${(props: DownIconProps) => props.show ? '.9' : '0'};
    cursor: ${(props: DownIconProps) => props.show ? 'pointer' : ''};;
  }
  
  @media(max-width: 800px) {
    bottom: 20px;
  }
`

const ConfigIconButton = styled(ConfigIcon)`
  position: absolute;
  left: 22px;
  bottom: 22px;
  width: 20px;
  height: 20px;
  transition: transform .18s, opacity .18s;
  opacity: .4; 
  
  &:hover {
    transform: scale(1.3);
    cursor: pointer;
    opacity: .9;
  }
`


const SlideController: React.FC<{
  showBottomIcon?: boolean,
  onClick?: () => void,
  onClickBack?: () => void,
  stage?: number,
  handle?: FullScreenHandle,
  sectionCount: number
}> = ({showBottomIcon, stage, onClick, onClickBack, handle, sectionCount}) => {
  const [dialogOpen, setDialogOpen] = useState(false)

  return <div>
    <ConfigIconButton onClick={() => setDialogOpen(true)} />

    <Controller>
      <Navigation onClick={onClickBack}/>
      <NavigationText>
        {(stage || 0) + 1} / 9
      </NavigationText>
      <NavigationDown onClick={showBottomIcon ? onClick : () => {
      }}/>
    </Controller>
    {
      stage !== (sectionCount - 1)
        ? <DownIcon show={showBottomIcon} onClick={onClick}/>
        : null
    }

    <ConfigDialog open={dialogOpen} onClose={() => setDialogOpen(false)}/>
  </div>
}


export default SlideController
