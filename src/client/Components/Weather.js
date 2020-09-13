import React from 'react';
import axios from 'axios';

class Weather extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            city: props.city,
            weather: {},
        };
    }

    handleChange = (event) => {
        this.setState({
            city: event.target.value,
        })
    }

    handleSubmit = (event) => {
        const key = 'bb96320928f968ccb0b8da40d302ab6e';
        const url = `http://api.openweathermap.org/data/2.5/weather?q=${this.state.city}&units=metric&&appid=${key}`;
        const axiosGetResponse = axios.get(url); // return Promise

        function retrieveData(axiosResponse) {
            if (axiosResponse.status === 200) {
                this.setState({
                    weather: axiosResponse.data
                });
            }
        }

        axiosGetResponse.then(retrieveData.bind(this));
    };


    render() {
        const weather = this.state.weather;
        return (
            <div>
                <div className="weather-header">
                    Weather Application
                </div>

                <div className="weather-search-toolbar">
                    <br/>
                    <input type="text" placeholder="City" onChange={this.handleChange}></input>
                    <input type="submit" value="Search" onClick={this.handleSubmit}></input>

                </div>

                <br></br>


                {weather.main ? (
                    <div className="weather-data">
                        {weather.name.toUpperCase()}, {weather.sys.country}
                        <br/><br/>
                        {weather.main.temp}&deg;
                        <br/>
                        {weather.weather[0].description.toUpperCase()}
                        <br/>
                        feels like {weather.main.feels_like}&deg;
                    </div>
                ) : (<div></div>)
                }
            </div>
        );
    }
}

export default Weather;
