import axios from "axios";
class Api {
  async get<T>(url: string, params?: any) {
    let fullUrl: string = url;
    if (params) {
      fullUrl += "?" + new URLSearchParams(params).toString();
    }
    return (await axios(fullUrl))?.data as T;
  }
  async addSettings(settings: any) {
    console.log(settings)
    return await axios.post(`/api/settings`, settings);
  }
}
export default new Api();
