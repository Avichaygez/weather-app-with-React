
import axios from "axios";
import './weather.css';
import React, { SyntheticEvent } from "react";

interface WeatherData {
    cityName: string;
    cityTemp: string;
    humidity: string;
    visibility: string;
    cityTempMinMax: string;
    weatherLogo: string;
    validation: string;
}

class Weather extends React.Component<{}, WeatherData>{

    constructor() {
        super({});
        this.state = {
            cityName: "",
            cityTemp: "",
            cityTempMinMax: "",
            visibility: "",
            humidity: "",
            weatherLogo: "",
            validation: "",
        }
    }
    public cityNameChange: string
    public searchVal: Boolean = true


    public response: any;

    render() {
        return (
            <div className="wheater">
                <input type="text" placeholder="Enter city here" id="search" value={this.state.cityName} onChange={this.changeName} />
                <button onClick={this.getLongAndAlt}>search</button>
                <div className="cityName" >{this.cityNameChange}</div>
                <div className="degree">{this.state.cityTemp}</div>
                <div className="TempMinMax">{this.state.cityTempMinMax}</div>
                <div className="visibility">{`${this.state.visibility} ${this.state.weatherLogo}`}</div>
                <div className="humidity">{this.state.humidity}</div>
                <div className="validation">{this.state.validation}</div>
            </div>

        )
    }

    changeName = (event: SyntheticEvent) => {
        this.setState({ cityName: (event.target as any).value });
        console.log(this.state.cityName);

    }

    getLongAndAlt = async () => {
        try {
            this.clear()
            let x = await axios.get(`http://api.openweathermap.org/geo/1.0/direct?q='${this.state.cityName}'&limit=5&appid=0080abdfa0b6fd6e517e953ed451d0c1`)
            console.log(x.data.length);

            if (x.data.length != 0) {
                this.cityNameChange = this.state.cityName;
            }
            else {
                this.setState({ validation: `There is no city named ${this.state.cityName}, please try again` })
            }
            this.response = x.data
            this.getWeather(this.response)
            this.setState({});

        }
        catch (err: any) {
            this.searchVal = false

            console.log(err.response.data);

        }
    }
    getWeather = async (cityData: any) => {
        try {

            let x = await axios.get<WeatherData>(`https://api.openweathermap.org/data/2.5/weather?lat=${cityData[0].lat}&lon=${cityData[0].lon}&appid=0080abdfa0b6fd6e517e953ed451d0c1`)

            this.response = x.data
            console.log(this.response);
            this.weatherVal(this.response.clouds.all)
            this.setState({
                cityTemp: `${(this.response.main.temp - 273.15).toFixed(0)}º`,
                cityTempMinMax: `Max/Min: ${(this.response.main.temp_max - 273.15).toFixed(0)}º / ${(this.response.main.temp_min - 273.15).toFixed(0)}º`,
                visibility: `visibility: ${this.response.weather[0].description}`,
                humidity: `humidity: ${this.response.main.humidity}%💧`
            })



        }
        catch (err: any) {
            this.searchVal = false
            // console.log(err.response.data);

        }
    }


    weatherVal = (clouds: any) => {
        if (clouds == 0) {
            this.setState({ weatherLogo: "☀" })
        }
        else if (clouds == 20) {
            this.setState({ weatherLogo: "🌤" })
        }
        else if (clouds == 40) {
            this.setState({ weatherLogo: "🌥" })
        }
        else if (clouds == 60) {
            this.setState({ weatherLogo: "☁" })
        }
        else if (clouds == 80) {
            this.setState({ weatherLogo: "☁" })
        }
        else {
            this.setState({ weatherLogo: "☁" })
        }

    }
    clear = () => {
        if (this.searchVal == false) {
            this.setState({
                cityTemp: ``,
                cityTempMinMax: ``,
                visibility: ``,
                humidity: ``,
                weatherLogo: ``,

            })
            this.cityNameChange = ``
        }
    }


}




export default Weather;
