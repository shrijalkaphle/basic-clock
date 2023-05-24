import moment from "moment";
import { useEffect, useState } from "react";
import NepaliDate from 'nepali-date-converter'

function App() {
  const element = document.documentElement
  const [isFullScreen, setIsFullScreen] = useState<boolean>(false)
  const [is24Hour, setIs24Hour] = useState<boolean>(false)
  const [time, setTime] = useState<string>(moment().format())
  const [nepaliDate, setNepaliDate] = useState(new NepaliDate())

  const fullScreenPreivew = () => {
    if(isFullScreen) {
      setIsFullScreen(false)
      //close
      if (document.exitFullscreen)
        document.exitFullscreen();
    } else {
      setIsFullScreen(true)
      if (element.requestFullscreen)
        element.requestFullscreen();
    }
  }

  const HourToggle = () => {
    if(is24Hour) {
      setIs24Hour(false)
    } else {
      setIs24Hour(true)
    }
  }

  useEffect(() => {
    const interval = setInterval(() => {
      setTime(moment().format())
      setNepaliDate(new NepaliDate())
    }, 500);
    return () => clearInterval(interval)
  }, [])

  return (
    <>
      <div className='bg-black max-h-screen max-w-screen min-h-screen min-w-screen overflow-hidden text-white'>

        <div className="h-screen w-screen flex items-center justify-center relative">
          <div className="flex gap-x-3 absolute top-1 right-1">
            <button className="border px-2 py-1 rounded-lg" onClick={fullScreenPreivew}>Toogle Fullscreen</button>
            <button className="border px-2 py-1 rounded-lg" onClick={HourToggle}>24 hour Toogle</button>
          </div>
          <div>
            <div className="flex items-end justify-center">
              <div className="text-9xl">
                {is24Hour ? moment(time).format('HH') :moment(time).format('hh') }:{moment(time).format('mm')}</div>
              <div className="text-6xl mb-3 ml-2">: {moment(time).format('ss')}</div>
              { !is24Hour && <div className="text-7xl mb-3 ml-8">{moment(time).format('A')}</div>}
            </div>
            <div className="mt-6 text-5xl text-center">
              {moment().format("dddd | MMMM DD, YYYY")} | {nepaliDate.format("DD MMMM, YYYY").toString()}
            </div>
          </div>
        </div>

      </div>
    </>
  )
}

export default App
