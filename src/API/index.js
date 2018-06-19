import axios from 'axios'


const Interface = {
    
    // 老黄历 聚合数据的均需认证才能免费使用
    oldCalendar: 'https://www.juhe.cn/docs/api/id/65',

    // 历史上的今天
    todayOfHistory: 'https://www.juhe.cn/docs/api/id/63',

    // 当年节假日
    getVocation: 'https://publicholidays.cn/zh/2018-dates/',

    // 三天的天气及生活指数
    // wiki: https://www.heweather.com/documents/api/v5/suggestion
    weatherGuid: 'https://free-api.heweather.com/s6/weather?key=59af81f4baa241fd900f1a067991cb65',

    // 七天天气 国家气象局
    // wiki:https://www.jianshu.com/p/e3e04cf3fc0f
    // sevenWeather: 'http://mobile.weather.com.cn/data/forecast/101010100.html?_=1381891660081',

    // 城市列表 网络请求该接口比较慢，采用本地读取
    // wiki:https://www.jianshu.com/p/e3e04cf3fc0f
    cityList: 'http://mobile.weather.com.cn/js/citylist.xml',


}


export default {
    
    getOldCalendar(param) {
        return axios.get(Interface.oldCalendar, { params: param }).then(({data}) => data)
    },

    getTodayOfHistory(param) {
        return axios.get(Interface.todayOfHistory, { params: param }).then(({data}) => data)
    },

    getVocation(param) {
        return axios.get(Interface.getVocation, { params: param }).then(({data}) => data)
    },

    getHistoryWeather(param) {
        return axios.get(Interface.historyWeather, { params: param }).then(({data}) => data)
    },

    getSevenWeather(param) {
        // 数据均为死数据
        return axios.get(`http://mobile.weather.com.cn/data/forecast/${param.cityId}.html?_=1381891660081`).then(({data}) => data)
    },

    getWeatherGuid(param) {
        return axios.get(Interface.weatherGuid, { params: param }).then(({data}) => data)
    },

    getCityList() {
        return axios.get(Interface.cityList).then(({data}) => data)
    },
}
