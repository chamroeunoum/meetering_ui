/**
 * Abstract API Plugin — Holiday lookup via Abstract API
 *
 * Fetches public holiday data for a given country/date from the Abstract API service.
 * Used by the meeting scheduling features to avoid scheduling meetings on holidays.
 *
 * @module plugins/abstractapi
 */
import axios from "axios"

/**
 * Fetch a holiday for the given country, year, month, and day.
 *
 * @param {string}  country - ISO 3166-1 alpha-2 country code (e.g., "KH")
 * @param {string}  year    - Four-digit year (e.g., "2025")
 * @param {string}  month   - Two-digit month (e.g., "01")
 * @param {string}  day     - Two-digit day (e.g., "01")
 * @returns {Promise<Object>} Axios response with holiday data
 */
export const getHoliday = async (country, year, month, day) => {
    try {
        let params = Array()
        country != undefined && country.length > 0 ? params.push({ name : 'country' , value : country}) : false
        year != undefined && year.length > 0 ? params.push({ name : 'year' , value : year}) : false
        month != undefined && month.length > 0 ? params.push({ name : 'month' , value : month}) : false
        day != undefined && day.length > 0 ? params.push({ name : 'day' , value : day}) : false
        console.log( ( params.length > 0 ? '&' + ( params.map( p => p.name + "=" + p.value ) ).join('&') : '' ) )
        return await axios({
            method: 'get' ,
            url: 'https://holidays.abstractapi.com/v1/?api_key=' + import.meta.env.VITE_ABSTRACTAPI_KEY + ( params.length > 0 ? '&' + ( params.map( p => p.name + "=" + p.value ) ).join('&') : '' ) , // UPDATED: API key from env var instead of hardcoded
            data: params
        })
    } catch (error) {
      console.log(error)
    }
}
