import {useState} from "react";
import {Section} from "../api/interfaces";


const useSectionController = (sections: Section[]): [boolean, number, () => void, () => void, () => void] => {
  const [isAnimating, setAnimating] = useState(false)
  const [currentSection, setCurrentSection] = useState<number>(-1)

  const getNearSections = () => [sections[currentSection - 1], sections[currentSection], sections[currentSection + 1]]

  const prev = async () => {
    const [prevSection, current] = getNearSections()

    if (prevSection && !isAnimating) {
      setAnimating(true)
      if (current) await current.animateEnd()
      if (prevSection) prevSection.start()
      setCurrentSection(currentSection - 1)
    }
  }

  const next = async () => {
    const [, current, nextSection] = getNearSections()

    if (nextSection && !isAnimating) {
      setAnimating(true)
      if (current) await current.animateEnd()
      if (nextSection) nextSection.start()
      setCurrentSection(currentSection + 1)
    }
  }

  const handleEnd = () => {
    setAnimating(false)
  }

  return [isAnimating, currentSection, prev, next, handleEnd]
}

export default useSectionController