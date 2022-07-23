import hotBg from "./assets/hot.jpg";
import coldBg from "./assets/cold.jpg";
import Descriptions from "./components/Descriptions";
import { useEffect, useState } from "react";
import { getFormattedWeatherData } from "./components/weatherService";


function App() {
  const [city, setCity] = useState("Paris")
  const [weather, setWeather] = useState(null);
  const [units, setUnits] = useState("metric");
  const [bg, setBg] = useState(hotBg);

  useEffect(() => {
    const fetchWeatherData = async () => {
      const data = await getFormattedWeatherData(city, units);
      setWeather(data);

      //dynamic bg
      const threshold = units === 'metric' ? 20 : 60;
      if (data.temp <= threshold) setBg(coldBg)
      else setBg(hotBg)
    }
    fetchWeatherData();
  }, [units, city])

  const handleUnitsClick = (e) => {
    const button = e.currentTarget;
    const currentUnit = button.innerText.slice(1)

    const isCelsius = currentUnit === 'C'
    button.innerText = isCelsius ? '\u00b0F' : '\u00b0C'
    setUnits(isCelsius ? 'metric' : 'imperial');
  }

  const enterKeyPressed = (e) => {
    if (e.keyCode === 13) {
      setCity(e.currentTarget.value)
      e.currentTarget.blur()
    }
  }

  return (
    <div className="app" style={{ backgroundImage: `url(${bg})` }}>
      <div className="overlay">
        {
          weather && (
            <div className="container">
              <div className="section section__inputs">
                <input onKeyDown={enterKeyPressed} type="text" name="city" placeholder="Введите город..." />
                <button onClick={(e) => handleUnitsClick(e)}>&deg;C</button>
              </div>
              <div className="section section__temperature">
                <div className="icon">
                  <h3>{`${weather.name}, ${weather.country}`}</h3>
                  <img src={weather.iconURL} alt="weatherIcon" />
                  <h3>{weather.description}</h3>
                </div>
                <div className="temperature">
                  <h1>{`${weather.temp.toFixed()} \u00b0${units === 'metric' ? 'C' : 'F'}`}</h1>
                </div>
              </div>
              <Descriptions weather={weather} units={units} />
            </div>
          )}
      </div>
    </div>
  );
}

export default App;



// https://api.openweathermap.org/data/2.5/weather?q={city name}&appid=7ad9d3ac441a364d80bde27f979005e6
