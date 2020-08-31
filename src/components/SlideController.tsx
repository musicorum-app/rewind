import React, {forwardRef} from "react";
import styled from 'styled-components'
import {THEME_COLOR} from "../Constants";
import { ReactComponent as NavigationIcon } from '../assets/navigation.svg'
import { ReactComponent as DownNavigationIcon } from '../assets/navigateDown.svg'

const Controller = styled.div`
  height: 100vh;
  position: absolute;
  right: 0px;
  top: 0px;
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
    cursor: ${(props: DownIconProps) => props.show ? 'pointer': ''};;
  }
`

const SlideController: React.FC<{
  showBottomIcon?: boolean,
  onClick?: () => void,
  stage?: number
}> = ({showBottomIcon, stage, onClick}) => {

  return <div>
    <Controller>
      <Navigation />
      <NavigationText>
        {(stage || 0) + 1} / 6
      </NavigationText>
      <NavigationDown />
    </Controller>
    {
      <DownIcon show={showBottomIcon} onClick={onClick} />
    }
  </div>
}


export default SlideController
