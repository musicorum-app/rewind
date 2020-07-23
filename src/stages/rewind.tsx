import React, {forwardRef, MouseEventHandler, useEffect, useRef, Ref, useState} from "react";
import {RewindData} from "../api/interfaces";
import Grid from "@material-ui/core/Grid/Grid";
import Box from "@material-ui/core/Box/Box";
import Container from "@material-ui/core/Container/Container";
import Typography from "@material-ui/core/Typography/Typography";
import Link from "@material-ui/core/Link/Link";
import {gsap} from 'gsap'
import {ScrollTrigger} from 'gsap/ScrollTrigger'
import {convertRange} from "../utils";

const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']

const RewindStage: React.FC<{
  data: RewindData,
}> = forwardRef(({data}) => {
  const [firstTrackTimeline, setFirstTrackTimeline] = useState<TimelineMax | null>(null)
  const [firstTrackAnimated, setFirstTrackAnimated] = useState(true)
  const [scrobbleCount, setScrobbleCount] = useState(0)
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

  useEffect(() => {
    if (firstTrackAnimated) return
    const {height, width, mobile, imgMargin} = getResponsiveness()
    const sizeInverted = mobile ? height : width
    // @ts-ignore
    const imgSize = firstTrackImageRef.current.clientHeight
    // @ts-ignore
    const imgY = (height / 2) - ((imgSize + (imgMargin * 2)) / 2)
    const imgX = (width / 2) - ((imgSize + (imgMargin * 2)) / 2)
    console.log(height, imgSize, imgY);

    // @ts-ignore
    const textHeight = () => firstTrackInfo.current.clientHeight
    // @ts-ignore
    firstTrackTimeline.fromTo(firstTrackImageRef.current, {
      opacity: 0,
      position: 'absolute',
      left: mobile ? imgX : 0,
      top: mobile ? 0 : imgY,
      x: -50
    }, {
      opacity: 1,
      duration: 4,
      x: 0
    }, "-=8")
      .fromTo(firstTrackInfo.current, {
        opacity: 0,
        position: 'absolute',
        left: mobile ? imgMargin : imgSize + (imgMargin * 2),
        top: mobile ? (imgSize + imgMargin * 2) : (height / 2) - (textHeight() / 2),
        x: -50
      }, {
        opacity: 1,
        x: 0
      }, "-=5")
    setFirstTrackAnimated(true)
  }, [firstTrackAnimated, firstTrackTimeline])

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger)

    if (disclaimerRef && disclaimerRef.current) {
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
          onRefresh: self => console.log(self)
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
          scrub: 2,
          opacity: 0.7
        })
        .to(firstTrackSecondTextRef.current, {
          x: '-150vw',
          duration: 9,
          scrub: 2,
          opacity: 0.7
        }, "-=9")
      setFirstTrackTimeline(firstTrackTL)

      animateScrobbleCount()
      animateGraphs()
    }
  }, [disclaimerRef])

  const animateScrobbleCount = () => {
    const scrobbles = data.stats.scrobbles - 1
    let counter = {
      scrobbles: 0
    }
    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: scrobbleSectionRef.current!,
        start: 'top 0%',
        end: 'bottom 20%',
        // markers: true,
        pin: true,
        scrub: .2
      }
    })
      .to(counter, {
        scrobbles: scrobbles,
        duration: 2,
        onUpdate: () => setScrobbleCount(counter.scrobbles)
      })
      .to({}, {
        duration: 1
      })
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
      .fromTo(graphWelcomeTextRef.current, {
        opacity: 0,
        y: -30,
      }, {
        opacity: 1,
        y: 0,
        duration: .1
      })
      .fromTo([graphYear0Ref.current, graphYear1Ref.current], {
        width: 0,
      }, {
        width: 75,
        stagger: .4
      }, "0.4")
      .from('.monthBar', {
        height: 0,
        stagger: .08,
        duration: .2
      })
      .from('.monthName', {
        opacity: 0,
        y: 17,
        duration: .2,
        stagger: 0.08 * 2
      }, `-=${.2 * 12}`)
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

  const calculateBarHeight = (scrobbles: number) => {
    const lastScrobbles = data.months.last.map(m => m.scrobbles)
    const totalScrobbles = [...lastScrobbles, ...data.months.actual.map(m => m.scrobbles)]
    const maxScrobble = Math.max.apply(Math, totalScrobbles)
    return convertRange(scrobbles, [0, maxScrobble], [0, maxBarHeight])
  }

  return <div style={{
    height: '100%',
    width: '100%'
  }}>
    <Box mx={1}>
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
          }}
          ref={firstTrackImageRef}
          src={data.firstTrack.image}
          alt="first track"
          onLoad={animateFirstTrackImage}
        />

      </Grid>

      <div ref={firstTrackInfo}>
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
        height: '100vh',
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
              <Box fontWeight={900} color="primary.main" fontSize={mobile ? 90 : 150}>
                {parseInt(scrobbleCount.toFixed()).toLocaleString()}
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
          <Typography variant="h4" ref={graphWelcomeTextRef}>
            <Box ml={3} mt={3} fontWeight={700}>
              This was your whole year on music
            </Box>
          </Typography>
        </Grid>
        <Grid item xs={12}>
          <Grid container spacing={3} alignItems="flex-end" className="graphs">

            {
              data.months.actual.map((m, i) => <Grid item xs={1}>
                <div className="monthItem">
                  <div className="monthBar actual" style={{
                    height: calculateBarHeight(m.scrobbles)
                  }}>

                  </div>
                  <div className="monthBar last" style={{
                    height: calculateBarHeight(data.months.last[i].scrobbles)
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
  </div>
})

export default RewindStage
