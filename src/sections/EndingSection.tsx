import React, {forwardRef, useEffect, useImperativeHandle, useState} from "react";
import Section from "../components/Section";
import {Nullable, RewindData} from "../api/interfaces";
import styled from "styled-components";
import {gsap, TimelineMax} from 'gsap';
import CustomEase from 'gsap/CustomEase'
import RoundedButton from "../RoundedButton";
import {Typography, useMediaQuery} from "@material-ui/core";
import Grid from "@material-ui/core/Grid";
import {generateNormalShare, generateStoriesShare} from "../image";
import Box from "@material-ui/core/Box";
import BigColoredButton from "../components/BigColoredButton";

import {ReactComponent as TwitterLogo} from '../assets/logos/twitter.svg'
import {ReactComponent as PatreonLogo} from '../assets/logos/patreon.svg'
import {ReactComponent as GithubLogo} from '../assets/logos/github.svg'
import {ReactComponent as LastfmLogo} from '../assets/logos/lastfm.svg'
import {ReactComponent as MediumLogo} from '../assets/logos/medium.svg'
import {ReactComponent as MusicorumLogo} from '../assets/logos/musicorum.svg'
import {ReactComponent as HeartSVG} from '../assets/heart.svg'
import Container from "@material-ui/core/Container";
import IconButton from "@material-ui/core/IconButton";
import Dialog from "@material-ui/core/Dialog";
import DialogTitle from "@material-ui/core/DialogTitle";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import Link from "@material-ui/core/Link";
import {TransitionProps} from "@material-ui/core/transitions";
import Slide from "@material-ui/core/Slide";
import {FORM_URL, THEME_COLOR} from "../Constants";
import {useTranslation} from "react-i18next";

const Transition = React.forwardRef((
  props: TransitionProps & { children?: React.ReactElement<any, any> },
  ref: React.Ref<unknown>,
  ) => <Slide direction="up" ref={ref} {...props} />
)

gsap.registerPlugin(CustomEase)

const mediaQueryBreak = 760

const Content = styled.div`
  opacity: 0;
  height: 100%;
  width: 100%;
  top: 200vh;
  transform-style: preserve-3d;
  perspective: 1000px;
`

const Middle = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 100px 20px 80px;
  
  @media(max-width: ${mediaQueryBreak}px) {
    padding: 50px 6px 80px;
  }
`

const Year = styled.span`
  -webkit-text-stroke: 2px #FD0F57;
  font-weight: 900;
  font-style: italic;
  position: absolute;
  left: 50vw;
  transform: translateX(-50%);
  color: transparent;
  font-size: 70px;
  width: 100%;
  text-align: center;
  
  @media(max-width: ${mediaQueryBreak}px) {
    font-size: 40px;
    -webkit-text-stroke: 1px #FD0F57;
  }
`

const CreditName = styled.div`
  width: 100%;
  text-align: center;
  font-size: 20px;
  color: ${THEME_COLOR};
  font-weight: 700;
`

const CreditTitle = styled.div`
  width: 100%;
  text-align: center;
  font-size: 17px;
  color: white;
  font-weight: 400;
`

const HeartIcon = styled(HeartSVG)`
  fill: ${THEME_COLOR};
  width: 20px;
  height: 20px;
  vertical-align: middle;
`

const EndingSection: React.FC<{
  data: RewindData,
  ref?: React.Ref<HTMLDivElement>,
  onEnd?: () => void;
}> = forwardRef(({data, onEnd}, ref) => {

  const {t} = useTranslation()
  const [dialogOpen, setDialogOpen] = useState(false)
  const [show, setShow] = useState(false)

  const small = useMediaQuery(`(max-width: ${mediaQueryBreak}px)`)
  const smallHeight = useMediaQuery(`(max-width: ${mediaQueryBreak}px) and (max-height: 560px)`)
  const biglHeight = useMediaQuery(`(max-width: ${mediaQueryBreak}px) and (min-height: 760px)`)

  useEffect(() => {
    if (show) {
      animate()
    }
  }, [show])

  const animate = async () => {
    const tl = new TimelineMax()
      .to('#endingSection', {
        // opacity: 1,
        // scale: 1,
        top: 0,
        duration: 0
      })
      .fromTo('#endingSection', {
        opacity: 0
      }, {
        scale: 1,
        opacity: 1,
        duration: .1
      })
      .from('#endingSectionYear', {
        y: 60,
        scale: .7,
        opacity: 0,
        duration: .6
      })
      .from('#endingSectionText', {
        y: -50,
        opacity: 0,
        scale: .8,
        duration: .6
      }, 0)
      .from('.endingSectionIcon', {
        scale: .7,
        opacity: 0,
        duration: .5,
        stagger: .08
      })


    tl.to({}, {
      duration: .5,
      onComplete: () => {
        if (onEnd) onEnd()
      }
    })
  }

  const animateEnd = () => {
    return new Promise(resolve => {
      const tl = new TimelineMax()
      tl.to('#endingSection', {
        opacity: 0,
        y: 80
      })
        .to('#endingSection', {
          top: '100vh',
          duration: 0,
          onComplete: () => {
            resolve()
          }
        })

      console.log('Ending section end')
    })
  }

  const start = () => {
    console.log('Ending section')
    setShow(true)
  }

  const tweet = () => {
    const params = {
      text: t('sections.ending.tweet', { user: 'musicorumapp' }),
      url: 'https://rewind.musc.pw',
      hashtags: 'MusicorumRewind'
    }
    const url = 'https://twitter.com/intent/tweet?' + new URLSearchParams(params).toString()

    window.open(url, 'popup', 'width=680, height=350')
  }

  // @ts-ignore
  useImperativeHandle(ref, () => ({
    start,
    animateEnd
  }))

  const iconsSize = small ? 18 : 24

  return show ? <Section>
    <Content id="endingSection">
      <Year id="endingSectionYear">
        2020
      </Year>
      <Middle>
        <Container maxWidth="md" style={{}}>
          <Grid container direction="column" justify="space-between" alignItems="center" style={{
            width: '100%'
          }}>
            <Grid item id="endingSectionText">
              <Typography variant="h3" align="center" style={{fontSize: small ? 30 : 40}}>
                <b>
                  {t('sections.ending.title')}
                </b>
              </Typography>
             <Box fontSize={small ? 13 : 16}>
               <Typography align="center" style={{fontSize: 'inherit'}}>
                 {t('sections.ending.text1')}
               </Typography>
               <br/>
               <Typography align="center" style={{fontSize: 'inherit'}}>
                 {t('sections.ending.text2')}
               </Typography>
             </Box>
              <br/>
              <Box mt={small ? 1 : 2} mb={small ? 1 : 7}>
                <Typography align="center" variant="h5">
                  {t('sections.ending.text3')}
                </Typography>
              </Box>

              <Grid container justify="center" style={{
                width: '100%'
              }}>
                <Grid item>
                  <Grid container spacing={small ? 1 : 2}>
                    <Grid item xs={6} sm={6}>
                      <BigColoredButton
                        icon={<PatreonLogo width={small ? 16 : 18} height={small ? 16 : 18}/>}
                        fullWidth
                        color="#FF424D"
                        style={{
                          fontSize: small ? 14 : 18
                        }}
                        href="https://www.patreon.com/musicorumapp"
                        prps={{
                          target: '_blank'
                        }}
                      >
                        {t('sections.ending.patreon')}
                      </BigColoredButton>
                    </Grid>

                    <Grid item xs={6} sm={6}>
                      <BigColoredButton
                        icon={<TwitterLogo width={small ? 16 : 18} height={small ? 16 : 18}/>}
                        fullWidth
                        textColor="#ffffff"
                        color="#1DA1F2"
                        onClick={tweet}
                        style={{
                          fontSize: small ? 14 : 18,
                        }}>
                        {t('sections.ending.tweetButton')}
                      </BigColoredButton>
                    </Grid>
                  </Grid>
                </Grid>
              </Grid>
            </Grid>
            <Grid item style={{width: '100%', marginTop: smallHeight ? biglHeight ? 60 : 20 : 50}}>
              <Grid container spacing={small ? 0 : 1} direction="column" alignItems="center" style={{width: '100%'}}>
                <Grid item>
                  <Grid container spacing={small ? 0 : 1} justify="center">
                    <Grid item className="endingSectionIcon">
                      <IconButton component="a" target="_blank" href="https://twitter.com/MusicorumApp">
                        <TwitterLogo width={iconsSize} height={iconsSize}/>
                      </IconButton>
                    </Grid>
                    <Grid item className="endingSectionIcon">
                      <IconButton component="a" target="_blank" href="https://www.patreon.com/musicorumapp">
                        <PatreonLogo width={iconsSize} height={iconsSize}/>
                      </IconButton>
                    </Grid>
                    <Grid item className="endingSectionIcon">
                      <IconButton component="a" target="_blank" href="https://github.com/musicorum-app/">
                        <GithubLogo width={iconsSize} height={iconsSize}/>
                      </IconButton>
                    </Grid>
                    <Grid item className="endingSectionIcon">
                      <IconButton component="a" target="_blank" href="https://www.last.fm/user/metye">
                        <LastfmLogo width={iconsSize} height={iconsSize}/>
                      </IconButton>
                    </Grid>
                    <Grid item className="endingSectionIcon">
                      <IconButton component="a" target="_blank" href="https://medium.com/musicorum">
                        <MediumLogo width={iconsSize} height={iconsSize}/>
                      </IconButton>
                    </Grid>
                    <Grid item className="endingSectionIcon">
                      <IconButton component="a" target="_blank" href="https://musicorumapp.com">
                        <MusicorumLogo width={iconsSize} height={iconsSize}/>
                      </IconButton>
                    </Grid>
                  </Grid>
                </Grid>
                <Grid item style={{width: '100%'}}>
                  <Grid container spacing={2} justify="center">
                    <Grid item className="endingSectionIcon">
                      <RoundedButton outlined color="primary" onClick={() => setDialogOpen(true)}>
                        {t('sections.ending.credits')}
                      </RoundedButton>
                    </Grid>
                    <Grid item className="endingSectionIcon">
                      <RoundedButton outlined color="primary" href={FORM_URL}>
                        {t('sections.ending.feedback')}
                      </RoundedButton>
                    </Grid>
                  </Grid>
                </Grid>
              </Grid>
            </Grid>
          </Grid>
        </Container>
      </Middle>
    </Content>
    <Dialog
      open={dialogOpen}
      TransitionComponent={Transition}
      keepMounted
      fullWidth
      maxWidth="sm"
      style={{
        minHeight: 300
      }}
      onClose={() => setDialogOpen(false)}
    >
      <DialogTitle>{t('sections.ending.credits')}</DialogTitle>
      <DialogContent>
        <DialogContentText>
          <Grid container justify="center">
            <Typography align="center" variant="subtitle2">
              {t('sections.ending.creditsText')}
            </Typography>
            <Box mt={2}>
              <Grid container spacing={2}>
                <Grid item xs={12} sm={6}>
                  <CreditName>{t('sections.ending.creditsNames.designDev')}</CreditName>
                  <CreditTitle>Matheus Dias</CreditTitle>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <CreditName>{t('sections.ending.creditsNames.artist')}</CreditName>
                  <CreditTitle>Luana Barros</CreditTitle>
                </Grid>
                <Grid item xs={12}>
                  <CreditName>{t('sections.ending.creditsNames.patrons')} <HeartIcon /></CreditName>
                  <CreditTitle>Micael Guerriero</CreditTitle>
                </Grid>
                <Grid item xs={12}>
                  <CreditName>{t('sections.ending.creditsNames.special')}</CreditName>
                  <CreditTitle>Pedro Fracassi and Raphael Sousa Lima</CreditTitle>
                </Grid>
                <Grid item xs={12}>
                  <CreditName>{t('sections.ending.creditsNames.betaTesters')}</CreditName>
                  <CreditTitle><em>Soon™</em></CreditTitle>
                </Grid>
              </Grid>
            </Box>
          </Grid>
        </DialogContentText>
      </DialogContent>
    </Dialog>
  </Section> : null
})

export default EndingSection
