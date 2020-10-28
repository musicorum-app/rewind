import React, {useLayoutEffect, useState} from 'react'
import styled from "styled-components";
import {THEME_COLOR} from "../Constants";
// @ts-ignore
import Quaternion from "quaternion";
import {gsap} from "gsap";
import {Grid} from "@material-ui/core";
import RoundedButton from "../RoundedButton";
import Typography from "@material-ui/core/Typography";
import {useTranslation} from "react-i18next";

const PromptWrapper = styled.div`
  opacity: 0;
  height: 100%;
  position: absolute;
  left: 0;
  top: 0;
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  background-color: black;
  padding: 10px 28px;
`

const Title = styled.span`
  font-size: 28px;
  font-weight: 700;
  text-align: center;
`

const CubeWrapper = styled.div`
  perspective: 1000px;
  transform-style: preserve-3d;
`

const cubeSize = 100

const Cube = styled.div`
  //transform: translateZ(-${cubeSize / 2}px);
  transform-style: preserve-3d;
  //animation: rotate 2s infinite linear;
`

const Face = styled.div`
  position: absolute;
  width: ${cubeSize}px;
  height: ${cubeSize}px;
  opacity: .6;
  border: 8px solid rgba(255, 255, 255, .3);
`

const Front = styled(Face)`
  transform:  translateX(-50%) rotateY(  0deg) translateZ(-${cubeSize / 2}px) translateY(-${cubeSize / 2}px);
  background: red;
`

const Right = styled(Face)`
  transform: rotateY(90deg) translateY(-${cubeSize / 2}px);
  background: yellow;
`

const Back = styled(Face)`
  transform: rotateY(180deg) translateX(50%) translateZ(-${cubeSize / 2}px) translateY(-${cubeSize / 2}px);
  background: blue;
`

const Left = styled(Face)`
  transform: rotateY(-90deg) translateZ(${cubeSize}px) translateY(-${cubeSize / 2}px);
  background: green;
`

const Top = styled(Face)`
  transform: rotateX(90deg) translateX(-50%);
  background: ${THEME_COLOR};
`

const Bottom = styled(Face)`
  transform: rotateX(-90deg) translateZ(-${cubeSize}px) translateX(-50%) ;
  background: mediumspringgreen;
`

const CubeSpacing = styled.div`
  width: 100%;
  height: 90px;
`

const Text = styled.span`
  width: 100%;
  text-align: center;
  margin: 12px 0;
`

const OrientationSensorPrompt: React.FC<{
  onContinue?: (useSensor: boolean) => void
}> = ({ onContinue }) => {

  const { t } = useTranslation()
  const [orientationSensor, setSensor] = useState<any>(null)

  useLayoutEffect(() => {
    setTimeout(() => {
      gsap.fromTo('#orientationSensor', {
        y: 80,
        opacity: 0
      }, {
        y: 0,
        opacity: 1
      })
    }, 500)


    if ('AbsoluteOrientationSensor' in window) {
      // @ts-ignore
      const sensor = new AbsoluteOrientationSensor({frequency: 60});
      Promise.all([navigator.permissions.query({name: "accelerometer"}),
        navigator.permissions.query({name: "magnetometer"}),
        navigator.permissions.query({name: "gyroscope"})])
        .then(results => {
          if (results.every(result => result.state === "granted")) {
            sensor.addEventListener('reading', () => {
              const sensorData = sensor.quaternion
              const qt = new Quaternion(sensorData[3], sensorData[0], sensorData[1], sensorData[2])

              gsap.to('#orientationCube', {
                transform: `matrix3d(${qt.toMatrix4()})`,
                duration: 0
              })
            });
            sensor.start()
            setSensor(sensor)
          } else {
            console.log("No permissions to use RelativeOrientationSensor.");
          }
        });
    }
  }, [])

  const doContinue = (useSensor: boolean) => () => {
    gsap.fromTo('#orientationSensor', {
      y: 0,
      opacity: 1
    }, {
      y: -80,
      opacity: 0,
      onComplete: () => {
        orientationSensor.stop()
        if(onContinue) onContinue(useSensor)
      }
    })
  }

  return <PromptWrapper id="orientationSensor">
    <Title>{t('sensor.title')}</Title>
    <CubeSpacing>
      {" "}
    </CubeSpacing>
    <CubeWrapper>
      <Cube id="orientationCube">
        <Front/>
        <Right/>
        <Back/>
        <Left/>
        <Top/>
        <Bottom/>
      </Cube>
    </CubeWrapper>
    <CubeSpacing>
      {" "}
    </CubeSpacing>
    <Text>
      {t('sensor.text')}
    </Text>

    <Text>
      {t('sensor.text2')}
    </Text>

    <Typography color="textSecondary" align="center" style={{
      padding: '30 10',
      fontSize: 11
    }}>
      <Text>
        <em>{t('sensor.tip')}</em>
      </Text>
    </Typography>
    <Grid container spacing={1} style={{
      padding: '10 24',
      marginTop: 17
    }}>
      <Grid item xs={12}>
        <RoundedButton
          onClick={doContinue(true)}
          fullWidth
          color="primary"
        >
          {t('sensor.continueWith')}
        </RoundedButton>
      </Grid>
      <Grid item xs={12}>
        <RoundedButton
          onClick={doContinue(false)}
          fullWidth
          outlined
        >
          {t('sensor.continueWithout')}
        </RoundedButton>
      </Grid>
    </Grid>
  </PromptWrapper>
}

export default OrientationSensorPrompt