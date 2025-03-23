import React, { useState } from "react"
import { useKeenSlider } from "keen-slider/react"
import "keen-slider/keen-slider.min.css"
import { useTranslation } from "react-i18next";

function PaginaInicio() {
  const { t } = useTranslation()
  const [currentSlide, setCurrentSlide] = useState(0)
  const [loaded, setLoaded] = useState(false)

  const [sliderRef, instanceRef] = useKeenSlider(
    {
      loop: true,
      initial: 0,
      slideChanged(slider) {
        setCurrentSlide(slider.track.details.rel)
      },
      created() {
        setLoaded(true)
      },
    },
    [
      (slider) => {
        let timeout
        let mouseOver = false
        function clearNextTimeout() {
          clearTimeout(timeout)
        }
        function nextTimeout() {
          clearTimeout(timeout)
          if (mouseOver) return
          timeout = setTimeout(() => {
            slider.next()
          }, 5000)
        }
        slider.on("created", () => {
          slider.container.addEventListener("mouseover", () => {
            mouseOver = true
            clearNextTimeout()
          })
          slider.container.addEventListener("mouseout", () => {
            mouseOver = false
            nextTimeout()
          })
          nextTimeout()
        })
        slider.on("dragStarted", clearNextTimeout)
        slider.on("animationEnded", nextTimeout)
        slider.on("updated", nextTimeout)
      },
    ]
  )

  const slideImgs = [
    "fondo1.png",
    "fondo2.png",
    "fondo3.png"
  ];

  return (
    <div className="relative w-full mx-auto -mt-20">
      <div ref={sliderRef} className="keen-slider">
        {[...Array(3)].map((_, idx) => (
          <div
            key={idx}
            className={`keen-slider__slide flex items-center justify-center text-white text-4xl font-medium h-72`}
            style={{ backgroundImage: `url(${slideImgs[idx]})`, backgroundSize: 'cover', height: '100vh', width:'100vh', backgroundPosition: 'center' }}
          >
          </div>
        ))}
      </div>
      {loaded && instanceRef.current && (
        <div className="absolute top-[95%] left-1/2 transform -translate-x-1/2 flex space-x-2">
          {[...Array(instanceRef.current.track.details.slides.length).keys()].map(
            (idx) => (
              <button
                key={idx}
                onClick={() => instanceRef.current?.moveToIdx(idx)}
                className={`w-4 h-4 rounded-full transition-colors duration-300 ${
                  currentSlide === idx ? "bg-primary" : "bg-white opacity-50"
                }`}
              ></button>
            )
          )}
        </div>
      )}
      <div className="text-white text-4xl font-medium h-72 absolute top-1/2 left-1/2 -translate-x-1/2">
        {t("welcome")}
      </div>
    </div>
  );
}

export default PaginaInicio;