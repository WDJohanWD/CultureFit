import React, { useState } from "react"
import { useKeenSlider } from "keen-slider/react"
import "keen-slider/keen-slider.min.css"
import { useTranslation } from "react-i18next";
import { IoBarbellOutline, IoCar, IoFitnessOutline, IoRestaurantOutline, IoAnalytics } from "react-icons/io5";
import { Link } from "react-router-dom";

function Home() {
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
    "fondo1.webp",
    "fondo2.webp",
    "fondo3.webp"
  ];

  return (
    <div className="montserrat">
      <div className="relative w-full mx-auto -mt-20">
        <div ref={sliderRef} className="keen-slider mb-15 shadow-xl">
          {[...Array(3)].map((_, idx) => (
            <div
              key={idx}
              className={`keen-slider__slide flex items-center justify-center text-white text-4xl font-medium h-72`}
              style={{ backgroundImage: `url(${slideImgs[idx]})`, backgroundSize: 'cover', height: '100vh', width: '100vh', backgroundPosition: 'center' }}
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
                  className={`w-4 h-4 rounded-full transition-colors duration-300 ${currentSlide === idx ? "bg-primary" : "bg-white opacity-50"
                    }`}
                ></button>
              )
            )}
          </div>
        )}
        <div className="text-white text-4xl font-medium h-72 absolute top-1/2 left-1/2 -translate-x-1/2 select-none pointer-events-none">
          {t("welcome")}
        </div>
      </div>
      <div className="flex flex-col items-center justify-center px-4 py-8 sm:py-12 md:px-12 lg:px-24 lg:gap-y-10 mb-18">
        <h2 className="text-3xl font-semibold">{t("find")}</h2>
        <hr className="h-px mb-4 -mt-2 w-100 sm:w-24 lg:w-100 bg-dark border-1" />
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 w-full max-w-5xl text-dark text-center">
          <div className="flex flex-col items-center">
            <IoBarbellOutline className="text-7xl mb-4" />
            <p>{t("machines")}</p>
          </div>
          <div className="flex flex-col items-center">
            <IoAnalytics className="text-7xl mb-4" />
            <p>{t("progress")}</p>
          </div>
          <div className="flex flex-col items-center">
            <IoRestaurantOutline className="text-7xl mb-4" />
            <p>{t("diet")}</p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 w-full max-w-5xl text-dark text-center mt-8 mb-8">
          <div className="flex flex-col items-center px-10 lg:ms-40">
            <IoFitnessOutline className="text-7xl mb-4" />
            <p>{t("monitor")}</p>
          </div>
          <div className="flex flex-col items-center px-10 lg:me-40">
            <IoCar className="text-7xl mb-4" />
            <p>{t("parking")}</p>
          </div>
        </div>
        <Link to="/memberships">
          <button className="text-white bg-gradient-to-r from-light-primary to-primary 
                            transition hover:ring-6 hover:outline-none hover:ring-orange-300 shadow-lg 
                            shadow-red-500/50 dark:shadow-lg font-semibold rounded-lg cursor-pointer
                            text-lg px-5 py-2.5 text-center me-2 mb-2 mt-2">
            {t("memberships")}
          </button>
        </Link>
        
      </div>
    </div>
  );
}

export default Home;