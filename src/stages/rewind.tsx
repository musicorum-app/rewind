import React, {forwardRef, MouseEventHandler, useEffect, useRef, Ref, useState} from "react";
import {MonthData, RewindData} from "../api/interfaces";
import Grid from "@material-ui/core/Grid/Grid";
import Box from "@material-ui/core/Box/Box";
import Container from "@material-ui/core/Container/Container";
import Typography from "@material-ui/core/Typography/Typography";
import Link from "@material-ui/core/Link/Link";
import {gsap} from 'gsap'
import {ScrollTrigger} from 'gsap/ScrollTrigger'
import {convertRange, handleArtistImage} from "../utils";
// @ts-ignore
import Odometer from 'odometer';

interface MonthState {
  actual: MonthData,
  last: MonthData,
  index: number
}

const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']

const RewindStage: React.FC<{
  data: RewindData,
}> = forwardRef(({data}) => {
  const [firstTrackTimeline, setFirstTrackTimeline] = useState<TimelineMax | null>(null)
  const [firstTrackAnimated, setFirstTrackAnimated] = useState(true)
  const [scrobbleCount, setScrobbleCount] = useState(0)
  const [refresh, setRefresh] = useState(1)
  const [graphAnimationsLoaded, setGraphAnimationsLoaded] = useState(false)
  const [selectedMonth, _setSelectedMonth] = useState<MonthState | null>(null)
  const selectedMonthRef = useRef(selectedMonth)
  const setSelectedMonth = (m: MonthState | null) => {
    selectedMonthRef.current = m
    _setSelectedMonth(m)
  }

  // Animation refs
  const disclaimerRef = useRef(null)
  const firstTrackRef = useRef(null)
  const dateRef = useRef(null)
  const firstTrackSecondTextRef = useRef(null)
  const firstTrackImageRef = useRef(null)
  const firstTrackInfo = useRef(null)

  const scrobbleSectionRef = useRef(null)

  const graphSectionRef = useRef(null)
  const graphWelcomeTextRef = useRef(null)
  const graphYear0Ref = useRef(null)
  const graphYear1Ref = useRef(null)

  const getResponsiveness = () => {
    const height = window.innerHeight
    const width = window.innerWidth
    const mobile = height > width
    const imgMargin = mobile ? 30 : 70
    const maxBarHeight = height * 0.4
    return {height, width, mobile, imgMargin, maxBarHeight}
  }

  const getFirstTrackImagePosition = () => {
    if (!firstTrackImageRef.current || !firstTrackImageRef.current) return [0, 0, 0, 0]
    const {height, width, mobile, imgMargin} = getResponsiveness()
    const sizeInverted = mobile ? height : width
    // @ts-ignore
    const imgSize = firstTrackImageRef.current.clientHeight
    // @ts-ignore
    const textHeight = () => firstTrackInfo.current.clientHeight
    // @ts-ignore
    const imgY = (height / 2) - ((imgSize + (imgMargin * 2)) / 2)
    const imgX = (width / 2) - ((imgSize + (imgMargin * 2)) / 2)
    const left = mobile ? imgX : 0
    const top = mobile ? 0 : imgY

    const textLeft = mobile ? imgMargin : imgSize + (imgMargin * 2)
    const textTop = mobile ? (imgSize + imgMargin * 2) : (height / 2) - (textHeight() / 2)
    return [left, top, textLeft, textTop]
  }

  useEffect(() => {
    if (firstTrackAnimated) return
    console.log('loaded')
    // @ts-ignore
    firstTrackTimeline.fromTo(firstTrackImageRef.current, {
      opacity: 0,
      position: 'absolute',
      x: -50
    }, {
      opacity: 1,
      duration: 3.5,
      x: 0,
    }, "-=8")
      .fromTo(firstTrackInfo.current, {
        opacity: 0,
        position: 'absolute',

        x: -50
      }, {
        opacity: 1,
        x: 0,
      }, "-=6")
    setFirstTrackAnimated(true)
  }, [firstTrackAnimated, firstTrackTimeline])

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger)

    if (disclaimerRef && disclaimerRef.current) {
      window.addEventListener('mousemove', ev => handleMouseMove(ev))
      window.addEventListener('resize', () => setRefresh(Math.random()))
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: disclaimerRef.current!,
          start: "top 20%",
          end: "bottom 20%",
          scrub: 1,
          onRefresh: self => console.log(self)
        },
      })
      tl.to(disclaimerRef.current, {
        opacity: 0,
      })
      const firstTrackTL = gsap.timeline({
        scrollTrigger: {
          trigger: firstTrackRef.current!,
          markers: false,
          start: "top 0%",
          end: "bottom -160%",
          scrub: .4,
          pin: true,
        },
      })
        .fromTo(dateRef.current, {
          scale: 60,
          ease: 'power4'
        }, {
          duration: 8,
          scale: 1,
        })
        .fromTo(firstTrackSecondTextRef.current, {
          opacity: 0,
        }, {
          duration: 3,
          opacity: 1,
        })
        .to(dateRef.current, {
          x: '150vw',
          duration: 9,
          opacity: 0.7
        })
        .to(firstTrackSecondTextRef.current, {
          x: '-150vw',
          duration: 9,
          // scrub: 2,
          opacity: 0.7
        }, "-=9")
      setFirstTrackTimeline(firstTrackTL)

      animateScrobbleCount()
      animateGraphs()
    }
  }, [disclaimerRef])

  const animateScrobbleCount = () => {
    const scrobbles = data.stats.scrobbles - 1
    // let counter = {
    //   scrobbles: 0
    // }
    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: scrobbleSectionRef.current!,
        start: 'top 20%',
        end: 'top 20%',
        markers: true,
        // pin: true,
        // scrub: .2
      }
    })
      .to({}, {
        onStart: () => {
          const od = new Odometer({
            el: document.getElementById('scrobbleCount'),
            value: 0,
            duration: 5000
          })
          console.log(od)
          od.render()
          od.update(scrobbles)
        },
        // onUpdate: () => {
        //   document.getElementById('scrobbleCount').innerHTML = counter.scrobbles
        //   // setScrobbleCount(counter.scrobbles)
        // }
      })
      // .to({}, {
      //   duration: 1
      // })
  }

  const animateFirstTrackImage = () => {
    setFirstTrackAnimated(false)
  }

  const animateGraphs = () => {
    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: graphSectionRef.current!,
        start: "top 0%",
        // markers: true,
        end: "bottom 80%",
        pin: true,
        // scrub: .7,

      }
    })
      .fromTo('.graphSectionWelcomeText', {
        opacity: 0,
        y: -30,
      }, {
        opacity: 1,
        y: 0,
        stagger: .23,
        duration: .3
      })
      .fromTo([graphYear0Ref.current, graphYear1Ref.current], {
        width: 0,
      }, {
        width: 75,
        duration: .7,
        stagger: .2
      }, "0.4")
      .from('.monthBar', {
        height: 0,
        stagger: .05,
        duration: .2,
        onComplete: () => setGraphAnimationsLoaded(true)
      })
      .from('.monthName', {
        opacity: 0,
        y: 17,
        duration: .2,
        stagger: 0.03 * 2
      }, `-=${.1 * 12}`)
  }

  const getFormatted = () => {
    return data.firstTrack.listenedAt.toLocaleDateString("en-US", {
      weekday: 'long',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  let {maxBarHeight, width, mobile, imgMargin} = getResponsiveness()
  const [ftLeft, ftTop, ftTextLeft, ftTextTop] = getFirstTrackImagePosition()

  const calculateBarHeight = (scrobbles: number) => {
    // console.log(maxBarHeight)
    const lastScrobbles = data.months.last.map(m => m.scrobbles)
    const totalScrobbles = [...lastScrobbles, ...data.months.actual.map(m => m.scrobbles)]
    const maxScrobble = Math.max.apply(Math, totalScrobbles)
    // return convertRange(scrobbles, [0, maxScrobble], [0, maxBarHeight])
    return ((100 * scrobbles) / maxScrobble) + '%';
  }

  const handleSelectMonth = (month: MonthData, i: number) => {
    return
    const tl = gsap.timeline()
    if (selectedMonth) {
      tl.fromTo('.selectedMonth', {
        x: 0,
        opacity: 1
      }, {
        opacity: 0,
        x: 20,
        duration: .5,
        onComplete: () => setSelectedMonth({
          actual: month,
          last: data.months.last[i],
          index: i
        })
        // y: 20
      })
    } else {
      setSelectedMonth({
        actual: month,
        last: data.months.last[i],
        index: i
      })
    }
    tl.fromTo('.selectedMonth', {
      x: 20,
      opacity: 0
    }, {
      x: 0,
      duration: .5,
      opacity: 1
    })

  }

  const handleMouseOver = (event: React.MouseEvent<HTMLElement>, month: MonthData, i: number) => {
    setSelectedMonth({
      actual: month,
      index: i,
      last: data.months.last[i]
    })
    // const el = document.getElementsByClassName('selectedMonth').item(0)
    // el.style.x
    // gsap.fromTo('.selectedMonth', {
    //   y: 5,
    //   opacity: 0
    // }, {
    //   opacity: 1,
    //   y: 0,
    //   duration: .2,
    //   // y: 20
    // })
  }

  const handleMouseMove = (event: MouseEvent) => {
    if (selectedMonthRef.current) {
      const x = event.clientX.toString()
      const y = event.clientY.toString()
      const el = document.getElementById('tooltipGraph')
      if (el) {
        gsap.set(el, {
          css: {
            top: y,
            left: x,
            position: 'fixed',
          }
        })
      }
    }
  }

  const handleMouseExit = (event: React.MouseEvent<HTMLElement>) => {
    setSelectedMonth(null)
    gsap.to('.selectedMonth', {
      y: 5,
      opacity: 0,
      duration: .2
    })
  }

  const handleMouseEnter = (event: React.MouseEvent<HTMLElement>, month: MonthData, i: number) => {
    if (!graphAnimationsLoaded) return
    setSelectedMonth({
      actual: month,
      index: i,
      last: data.months.last[i]
    })
    gsap.fromTo('#tooltipGraph', {
      opacity: 0,
      // y: -9
    }, {
      opacity: 1,
      // y: 0,
      duration: .2
    })
  }

  return <div style={{
    height: '100%',
    width: '100%'
  }}>
    <Box mx={1}>
      {
        refresh ? ' ' : ''
      }
      <Container maxWidth="md">
        <section
          style={{
            height: '100vh',
          }}
        >
          <Grid container justify='center' alignItems='center' style={{
            height: '100%'
          }}>
            <Grid item>
              <div
                style={{
                  backgroundColor: 'rgb(253, 15, 87, 16%)',
                  borderRadius: 15,
                  textAlign: 'center',
                  padding: '1px 12px 12px 12px',
                }}
                ref={disclaimerRef}>
                <Box fontSize={28} my={3} color="primary.main" fontWeight={600}>
                  Disclaimer
                </Box>
                <Typography>
                  This is a third party app. We are not a partner nor related in a way with Last.fm. All the data
                  presented here
                  were obtained from the <Link href="https://www.last.fm/api/" target="_blank" rel="noreferrer">Last.fm
                  public api</Link>. Some
                  information <strong>will</strong> be different from the one seen on your Last.year since we need to
                  grab from scratch
                  and
                  it may not be accurate.
                </Typography>
                <Typography>
                  TODO
                </Typography>
              </div>
            </Grid>
          </Grid>
        </section>
      </Container>
    </Box>
    <section
      style={{
        height: '100vh',
        width: '100%',
        overflow: 'hidden',
        whiteSpace: 'nowrap'
      }}
      ref={firstTrackRef}
    >
      <Grid container justify='center' alignItems="center" style={{
        height: '100%'
      }}>

        <Grid item>
          <Typography ref={firstTrackSecondTextRef}>
            <Box textAlign="center" mb={2}>
              Your 2020 journey started on
            </Box>
          </Typography>
          <Typography ref={dateRef}>
            <Box fontWeight={600} fontSize={mobile ? 17 : 23} component="span">
              <span>
              {getFormatted()}
              </span>
            </Box>
          </Typography>
        </Grid>
      </Grid>
      <Grid container justify='center' alignItems="center">
        <img
          style={{
            margin: imgMargin,
            maxWidth: width > 400 ? 300 : 150,
            position: 'absolute',
            left: ftLeft,
            top: ftTop
          }}
          ref={firstTrackImageRef}
          src={data.firstTrack.image}
          alt="first track"
          onLoad={animateFirstTrackImage}
        />

      </Grid>

      <div ref={firstTrackInfo} style={{
        position: "absolute",
        left: ftTextLeft,
        top: ftTextTop
      }}>
        <Typography component="h4" variant="h4" style={{
          maxWidth: mobile ? width - (imgMargin * 2) : width - 300 - (imgMargin * 2)
        }}>
          <Box className="textCenter" color="primary.main" fontWeight={900}>
            {data.firstTrack.name}
          </Box>
        </Typography>
        <Typography>
          <Box className="textCenter" my={2} fontSize={24}>
            {data.firstTrack.artist}
          </Box>
        </Typography>
        <Typography>
          <Box className="textCenter" mt={3} fontWeight={800} fontSize={13}>
            FIRST SCROBBLE OF THE YEAR
          </Box>
        </Typography>
      </div>
    </section>

    <section
      style={{
        height: '90vh',
        width: '100%',
        overflow: 'hidden',
      }}
      ref={scrobbleSectionRef}
    >
      <Grid container justify='center' alignItems="center" style={{height: '100%'}}>
        <Grid item>
          <Typography style={{}}>
            <Box my={4} textAlign="center">
              And then, you scrobbled more
              <Box component="p" fontWeight={900} id="scrobbleCount" className="odometer" color="primary.main" fontSize={mobile ? 90 : 150}>
                {/*{parseInt(scrobbleCount.toFixed()).toLocaleString()}*/}
                0
                {/*<Odometer value={scrobbleCount.toFixed()} animation={graphAnimationsLoaded} />*/}
              </Box>
              times through the year.
            </Box>
          </Typography>
        </Grid>
      </Grid>

    </section>

    <section
      style={{
        height: '30vh',
        width: '100%',
        overflow: 'hidden',
      }}
    >
      <Grid container justify='center' alignItems="center" style={{height: '100%'}}>
        <Grid item>
          <Typography align="center">
            And it was like that...
          </Typography>
        </Grid>
      </Grid>
    </section>

    <section
      style={{
        height: '100vh',
        width: '100%',
        overflow: 'hidden',
      }}
      ref={graphSectionRef}
    >
      <Grid container spacing={3}>
        <Grid item xs={12}>
          <Grid container justify="space-between">
            <Grid item>
              <Typography variant="h4" className="graphSectionWelcomeText">
                <Box ml={3} mb={1} mt={3} fontWeight={700}>
                  This was your whole year on music
                </Box>
              </Typography>
              <Typography className="graphSectionWelcomeText">
                <Box ml={3}>
                  You can click on some month to see more details
                </Box>
              </Typography>
            </Grid>
            <Grid item>

            </Grid>
          </Grid>
        </Grid>
        <Grid item xs={12}>
          <Grid
            container
            spacing={3}
            alignItems="flex-end"
            className="graphs"
            // onMouseMove={handleMouseMove}
          >

            {
              data.months.actual.map((m, i) => <Grid
                item
                className={(graphAnimationsLoaded ? 'monthSection ' : ' ')}
                xs={1}
                onMouseEnter={event => handleMouseEnter(event, m, i)}
                // onMouseMove={event => handleMouseMove(event)}
                onMouseOut={event => handleMouseExit(event)}
              >
                <div
                  className="monthItem"
                  style={{
                    height: maxBarHeight
                  }}

                >
                  <div className="monthBar last" style={{
                    height: calculateBarHeight(data.months.last[i].scrobbles)
                  }}>

                  </div>
                  <div className="monthBar actual" style={{
                    height: calculateBarHeight(m.scrobbles)
                  }}>

                  </div>
                </div>
                <p className="monthName">{months[i]}</p>
              </Grid>)
            }
          </Grid>
        </Grid>
        <Grid item xs={12}>
          <div className="yearBoxes">
            <div className="outBox" ref={graphYear0Ref}>
              <Box className="yearBox" fontWeight={800} bgcolor="white" color="black" mb={2}>
                2019
              </Box>
            </div>
            <div className="outBox" ref={graphYear1Ref}>
              <Box className="yearBox" fontWeight={800} bgcolor="primary.main" color="black">
                2020
              </Box>
            </div>
          </div>
        </Grid>

      </Grid>
    </section>
    {
      selectedMonth ? <div id="tooltipGraph" className="selectedMonth">
        <div className="monthTooltipSection last">
          <img
            src={handleArtistImage(selectedMonth.last.artists[0])}
            className="selectedMonthTooltipImage"
            alt="Top artist from this month"
          />
          <Box component="p">
            {selectedMonth.last.scrobbles}
          </Box>
        </div>
        <div className="monthTooltipSection actual">
          <Box component="p">
            {selectedMonth.actual.scrobbles}
          </Box>
          <img
            src={handleArtistImage(selectedMonth.actual.artists[0])}
            className="selectedMonthTooltipImage"
            alt="Top artist from this month"
          />
        </div>


      </div> : null
    }
  </div>
})

export default RewindStage
