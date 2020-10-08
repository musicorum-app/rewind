import React, {forwardRef, useEffect, useImperativeHandle, useState} from "react";
import Section from "../components/Section";
import {Typography, Box} from "@material-ui/core";
import {FormattedArtist, Nullable, RewindData, TopTag} from "../api/interfaces";
import logo from '../assets/logo.svg'
import styled from "styled-components";
import {gsap, TimelineMax} from 'gsap';
import CustomEase from 'gsap/CustomEase'
import ParallaxWrapper from "../components/ParallaxWrapper";
import Header from "../components/Header";
import chroma from 'chroma-js'
import {THEME_COLOR} from "../Constants";

gsap.registerPlugin(CustomEase)


const TopTagsSection = styled.div`
  position: absolute;
  top: 100vh;
  opacity: 0;
`

const AnimationWrapperLeft = styled.div`
  position: absolute;
  width: 50%;
  top: 0;
  left: 0;
  display: flex;
  justify-content: center;
  align-content: center;
  flex-direction: column;
  align-items: flex-end;
  height: 100%;
  font-weight: 900;
  transform: translateZ(-200px);
  text-align: end;
  color: ${THEME_COLOR};
  white-space: nowrap;
  padding: 0 10px 0 0;
`

const AnimationWrapperRight = styled(AnimationWrapperLeft)`
  left: 50%;
  align-items: flex-start;
  text-align: start;
  color: white;
  transform: translateZ(-140px);
  padding: 0 0 0 10px;
`

const AnimationText = styled.span`
  font-size: 90px;
  line-height: 90px;
  opacity: 0;
`

const TopTagsContent = styled.div`
  display: flex;
  height: 100%;
  width: 100%;
  justify-content: center;
  align-items: center;
  transform: translateZ(-70px);
`

const TopTagsText = styled.div`
  display: flex;
  color: white;
  font-weight: 800;
  flex-direction: column;
  align-items: flex-end;
  font-size: 50px;
  line-height: 90px;
`

const TopTagsBars = styled.div`
  display: flex;
  flex-direction: column;
`

const BarWrapper = styled.div`
  display: flex;
  width: 50vw;
  align-items: center;
  padding-left: 45px;
`

const TagPercent = styled.div`
  font-weight: 300;
  font-size: 40px;
  text-align: end;
  width: 130px;
`

const ProgressBar = styled.div`
  background-color: ${chroma(THEME_COLOR).alpha(0.2).css()};
  height: 54px;
  margin: 17px 19px;
  width: 100%;
`

const ProgressBarInside = styled.div`
  background-color: ${THEME_COLOR};
  width: 30%;
  height: 100%;
`

const Notice = styled.div`
  position: absolute;
  left: 0;
  bottom: 0;
  padding: 24px;
`


const TAG_SPLITS = 25
const TAG_SPLIT_MIDDLE = ~~(TAG_SPLITS / 2)

const TopTags: React.FC<{
  data: RewindData,
  ref?: React.Ref<HTMLDivElement>,
  onEnd?: () => void;
}> = forwardRef(({onEnd, data}, ref) => {

  const [show, setShow] = useState(false)
  const [randomTags, setRandomTags] = useState<TopTag[]>([])

  useEffect(() => {
    if (show) {
      const animationStagger = 0.05
      const tl = new TimelineMax()
        .to('#topTagsSection', {
          top: 0,
          duration: 0
        })
        .to('#topTagsSection', {
          opacity: 1
        }, 0)
        .to('.tagsAnimationLeft', {
          opacity: 1,
          duration: 0,
          stagger: animationStagger
        }, 0)
        .to('.tagsAnimationRight', {
          opacity: 1,
          duration: 0,
          stagger: -animationStagger
        }, 0)


      const getNodes = (side: string) => new Array(TAG_SPLITS)
        .fill('')
        .map((_, i) => `#tagsAnimation${side}Node-${i}`)
        .filter((_, i) => i !== TAG_SPLIT_MIDDLE)

      tl
        .to(getNodes('Left'), {
          opacity: 0,
          duration: 0,
          stagger: animationStagger
        }, 1)
        .to(getNodes('Right'), {
          opacity: 0,
          duration: 0,
          stagger: -animationStagger
        }, 1)
        .to(['.tagsAnimationLeft', '.tagsAnimationRight'], {
          opacity: 0
        }, 2.8)
        .fromTo('.topTagsTextNode', {
          x: 40,
          opacity: 0,
        }, {
          x: 0,
          opacity: 1,
          stagger: .04,
          duration: 1.4,
          ease: 'expo.out'
        }, 3.2)
        .from('.topTagsPercentNode', {
          opacity: 0,
          x: -30,
          stagger: .04,
          duration: 1.4,
          ease: 'expo.out'
        }, 3.2)
        .from('.topTagsProgressBarNode', {
          width: 0,
          stagger: .04,
          duration: 1.4,
          ease: 'expo.out'
        }, 3.4)
        .from('.topTagsNotice', {
          opacity: 0
        }, 4.2)
        .from('#topTagsSectionHeader', {
          opacity: 0
        }, 4.2)

      tl
        .to({}, {
          duration: 1,
          onComplete: () => {
            if (onEnd) onEnd()
          }
        })
    }
  }, [show])

  const start = () => {
    setRandomTags([...data.topTags].sort(() => .5 - Math.random()))
    setShow(true)
  }

  const animateEnd = () => {
    return new Promise(resolve => {
      new TimelineMax()
        .to(['.topTagsTextNode', '.topTagsPercentNode', '.topTagsProgressBarNode'], {
          x: -40,
          opacity: 0,
          stagger: .07
        })
        .to('#topTagsSection', {
          opacity: 0
        }, 0.3)
        .to('#topTagsSection', {
          top: '100vh',
          duration: 0,
          onComplete: resolve
        })
    })
  }

  const getPercent = (count: number): number => {
    const total = data.topTags
      .slice(0, 6)
      .map(({count}) => count)
      .reduce((a, b) => a + b, 0)

    return (100 * count) / total
  }

  const tagsLeft = randomTags.slice(0, TAG_SPLITS)
  const tagsRight = randomTags.slice(-TAG_SPLITS)

  // @ts-ignore
  useImperativeHandle(ref, () => ({
    start,
    animateEnd
  }))

  return show ? <Section center>
    <TopTagsSection id="topTagsSection">
      <ParallaxWrapper>
        <div id="topTagsSectionHeader">
          <Header title="TOP TAGS">
            These are your most listened tags, A.K.A. genres
          </Header>
        </div>
        <AnimationWrapperLeft>
          {
            tagsLeft.map(({tag}, index) => <AnimationText
              key={tag}
              className="tagsAnimationLeft"
              id={`tagsAnimationLeftNode-${index}`}
            >
              {
                index === TAG_SPLIT_MIDDLE ? 'top' : tag
              }
            </AnimationText>)
          }
        </AnimationWrapperLeft>
        <AnimationWrapperRight>
          {
            tagsRight.map(({tag}, index) => <AnimationText
              key={tag}
              className="tagsAnimationRight"
              id={`tagsAnimationRightNode-${index}`}
            >
              {
                index === TAG_SPLIT_MIDDLE ? 'tags' : tag
              }
            </AnimationText>)
          }
        </AnimationWrapperRight>
        <TopTagsContent>
          <TopTagsText>
            {
              data.topTags.slice(0, 6).map(({tag}) => <span
                className="topTagsTextNode"
                style={{
                  opacity: 0
                }}
                key={tag}
              >
                {tag}
              </span>)
            }
          </TopTagsText>
          <TopTagsBars>
            {
              data.topTags.slice(0, 6).map(({tag, count}) => <BarWrapper key={tag}>
                  <TagPercent className="topTagsPercentNode">{~~getPercent(count)}%</TagPercent>
                  <ProgressBar className="topTagsProgressBarNode">
                    <ProgressBarInside
                      style={{
                        width: `${getPercent(count)}%`
                      }}
                    />
                  </ProgressBar>
                </BarWrapper>
              )
            }
          </TopTagsBars>
        </TopTagsContent>
        <Notice className="topTagsNotice">
          This chart is based on your top 100 tracks, and then isolating the first 6.
        </Notice>
      </ParallaxWrapper>
    </TopTagsSection>
  </Section> : null
})

TopTags.defaultProps = {
  onEnd: () => {
  }
}

export default TopTags
