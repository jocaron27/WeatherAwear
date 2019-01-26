declare namespace appTypes {
    
    export type LocationResponse = {
        lat: number;
        lng: number;
        location: string;
    }

    export type User = {
        id: number;
    }

    export type WeatherResponse = WeatherForecast[];

    type WeatherForecast = {
        time: number;
        timezone: string;
        summary: string;
        icon: string;
        precip: number;
        preciptype: string;
        cloud: number;
        hi: number;
        lo: number;
    }

}


 


