import axios from 'axios';
import moment from "moment";
import { useEffect, useState } from "react";
import NepaliDate from 'nepali-date-converter'

interface IWeatherData {
  cloudcover: number
  conditions: string
  datetime: string
  feelslike: number
  humidity: number
  icon: string
  temp: number
  windspeed: number
}

function App() {
  const element = document.documentElement
  const [isFullScreen, setIsFullScreen] = useState<boolean>(false)
  const [is24Hour, setIs24Hour] = useState<boolean>(false)
  const [time, setTime] = useState<string>(moment().format())
  const [nepaliDate, setNepaliDate] = useState(new NepaliDate())

  const [weatherData, setWeatherData] = useState<IWeatherData>({
    cloudcover: 25,
    conditions: "Partially cloudy",
    datetime: "18:15:00",
    feelslike: 25,
    humidity: 61.2,
    icon: "partly-cloudy-day",
    temp: 25,
    windspeed: 11.2
  })

  const fullScreenPreivew = () => {
    if (isFullScreen) {
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

  const weatherApiRequest = () => {
    axios.get('https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/timeline/Kathmandu,NP?key=JT8L6SDRS5CUUM4U338CCBY7E&unitGroup=metric')
      .then((response) => {
        console.log(response)
        setWeatherData(response.data.currentConditions)
      })
  }

  const HourToggle = () => {
    if (is24Hour) {
      setIs24Hour(false)
    } else {
      setIs24Hour(true)
    }
  }

  useEffect(() => {
    weatherApiRequest()
    const interval = setInterval(() => {
      setTime(moment().format())
      setNepaliDate(new NepaliDate())
    }, 500);

    const weatherInterval = setInterval(() => {
      weatherApiRequest()
    },120000)
    return () => {
      clearInterval(interval)
      clearInterval(weatherInterval)
    }
  }, [])

  return (
    <>
      <div className='bg-black max-h-screen max-w-screen min-h-screen min-w-screen overflow-hidden text-white'>

        <div className="h-screen w-screen flex items-center justify-center relative">
          <div className="flex gap-x-3 absolute top-1 right-1">
            <button className="border px-2 py-1 rounded-lg" onClick={fullScreenPreivew}>Toogle Fullscreen</button>
            <button className="border px-2 py-1 rounded-lg" onClick={HourToggle}>24 hour Toogle</button>
            <button className="border px-2 py-1 rounded-lg" onClick={weatherApiRequest}>weather</button>
          </div>
          <div>
            <div className="flex items-end justify-center">
              <div className="text-9xl">
                {is24Hour ? moment(time).format('HH') : moment(time).format('hh')}:{moment(time).format('mm')}</div>
              <div className="text-6xl mb-3 ml-2">: {moment(time).format('ss')}</div>
              {!is24Hour && <div className="text-7xl mb-3 ml-8">{moment(time).format('A')}</div>}
            </div>
            <div className="mt-6 text-5xl text-center mb-6">
              {moment().format("dddd | MMMM DD, YYYY")} | {nepaliDate.format("DD MMMM, YYYY").toString()}
            </div>
            <hr />
            <div className='mt-6 justify-center flex items-center gap-x-4'>
              <div>
                <img src={`./svgs/${weatherData.icon}.svg`} className='h-42 w-42' />
              </div>
              <div className='text-center'>
                <div className='text-xl'>{weatherData.conditions}</div>
                <div className='text-2xl mt-2'>{weatherData.temp}&deg;C <span className='text-lg'>(Feels like {weatherData.feelslike}&deg;C)</span></div>
                <div className='text-lg mt-2'>
                  <span className='block'>Humidity: {weatherData.humidity}%</span>
                  <span className='block'>Wind Speed: {weatherData.windspeed} km/h</span>
                  <span className='block text-sm'>{weatherData.datetime}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

      </div>
    </>
  )
}

export default App