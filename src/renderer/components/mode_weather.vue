<template>
    <div class="mode_weather">
        <div class="top">
            <span class="now_time">{{year}}年{{month}}月</span>
            <span class="countday">今年第<i>{{dayCount}}</i>天</span>

            <div class="search_box">
                <select name="city" id="city" v-model="cityInfo" @change="changeCity()">
                    <option :value="{cityId: item.id, cityName: item.name}" v-for="(item, index) in cityList" :key="index">{{item.name}}</option>
                </select>
                <input class="vir_input" type="text" :placeholder="cityInfo.cityName" @keyup="search()">
            </div>
        </div>

        <ul class="week">
            <li v-for="(item, index) in weekArr" :key="index">{{item}}</li>
        </ul>
        <ul class="days">
            <li class="day_item" 
                :class="{'today_item': item.date === day}"
                v-for="(item, index) in daysArr" 
                :key="index" 
                @mouseenter="showGuidInfo(item.date)" 
                @mouseleave="hideGuidInfo()">
                {{item.date}}
                <span v-for="(itm, idx) in weatherData" :key="idx" v-if="new Date(itm.date).getDate() === item.date">
                    <i>{{itm.tmp_min}}℃ ~ {{itm.tmp_max}}℃</i>
                    <i>白天：{{itm.cond_txt_d}}</i>
                    <i>夜间：{{itm.cond_txt_n}}</i>
                    <!-- <i>降水概率：{{itm.pop}}</i> -->
                </span>

                 <!-- 弹窗 -->
                <div class="day_detail" v-if="item.date === day && showDialog" @mouseenter="showGuidInfo(item.date)" @mouseleave="hideGuidInfo()">
                    <P>生活指数</P>
                    <ul v-for="(item, index) in guidData" :key="index">
                        <li>
                            <span v-if="item.type === 'comf'">舒适度指数</span>
                            <span v-else-if="item.type === 'cw'">洗车指数</span>
                            <span v-else-if="item.type === 'drsg'">穿衣指数</span>
                            <span v-else-if="item.type === 'flu'">感冒指数</span>
                            <span v-else-if="item.type === 'sport'">运动指数</span>
                            <span v-else-if="item.type === 'trav'">旅游指数</span>
                            <span v-else-if="item.type === 'uv'">紫外线指数</span>
                            <span v-else-if="item.type === 'air'">空气污染扩散条件指数</span>
                            <span v-else-if="item.type === 'ac'">空调开启指数</span>
                            <span v-else-if="item.type === 'ag'">过敏指数</span>
                            <span v-else-if="item.type === 'gl'">太阳镜指数</span>
                            <span v-else-if="item.type === 'mu'">化妆指数</span>
                            <span v-else-if="item.type === 'airc'">晾晒指数</span>
                            <span v-else-if="item.type === 'ptfc'">交通指数</span>
                            <span v-else-if="item.type === 'fsh'">钓鱼指数</span>
                            <span v-else-if="item.type === 'spi'">防晒指数</span>
                            <span>{{item.brf}}</span>
                            <span>{{item.txt}}</span>
                        </li>
                        <!-- <li>湿度：</li>
                        <li>降水概率：{{item.pop}}</li> -->
                    </ul>
                </div>

                
            </li>
        </ul>

       
    </div>
</template>

<script>

import API from '../../API'

const NOW = new Date()

export default {
    name: 'mode_weather',
    data() {
        return {
            day: NOW.getDate(),
            week: NOW.getDay(),                
            month: NOW.getMonth() + 1,
            year: NOW.getFullYear(),
            dayType1: [31,29,31,30,31,30,31,31,30,31,30,31],
            dayType2: [31,28,31,30,31,30,31,31,30,31,30,31],
            weekArr: ['周日', '周一', '周二', '周三', '周四', '周五', '周六'],
            cityList: [],
            weatherData: [],
            guidData: {},
            showDialog: false, // 是否展示弹框
            cityInfo: {},
        }
    },
    mounted() {
        this.init()
        this.getCityList()
    },
    computed: {
        dayCount() {
            let sum = 0
            this.dayType(this.year).forEach((item, index) => {
                if (index < this.month) {
                    sum += item
                }
            })
            return sum + this.day
        },
        daysArr() {
            let finalArr = []
            const days = this._getDaysArrbyGivenMonth(this.year, this.month)
            days.forEach(item => {
                finalArr.push({
                    date: item,
                    weatherInfo: this.weatherData
                })
            })
            // console.log(finalArr)
            return finalArr
        },
    },
    watch: {
        cityInfo(newVal, oldVal) {
            console.log(newVal, oldVal)
            localStorage.setItem('cityId', newVal.cityId)
            localStorage.setItem('cityName', newVal.cityName)
            this.getWeather(newVal.cityId)
        }
    },
    methods: {
        init() {
            this.cityInfo.cityId = localStorage.getItem('cityId') || 101020100
            this.cityInfo.cityName = localStorage.getItem('cityName') || '上海'
        },
        isLeapYear(year) {
            return ( year % 4 == 0 || year % 400 == 0 ) && year % 100 != 0 
        },
        dayType(year) {
            return this.isLeapYear(year) ? this.dayType2 : this.dayType1
        },
        getCityList() {
            const path = require('path').resolve() + '/src/city.json'
            require('fs').readFile(path, 'utf-8', (err, data) => {
                // console.log(JSON.parse(data).list)
                this.cityList = JSON.parse(data).list

                const storeId = localStorage.getItem('cityId') || this.cityId
                this.getWeather(storeId)
            })
        },
        getWeather(cityId) {
            // console.log('get weather:', cityId)
            API.getWeatherGuid({
                location: 'CN' + cityId
            }).then(res => {
                this.weatherData = res.HeWeather6[0].daily_forecast
                // console.log(this.weatherData)
                this.guidData = res.HeWeather6[0].lifestyle
            })
        },
        showGuidInfo(val, event) {
            if (val === this.day) {
                // console.log(val)
                this.showDialog = true
            }
        },
        hideGuidInfo() {
            this.showDialog = false
        },
        changeCity() {
            console.log('changeval')
        },
        search() {
            // 事件节流
            // 可根据拼音、汉字查询
            console.log('keyup')
        },
        _getDaysArrbyGivenMonth(year, month) {
            const dayType = this.dayType(year),
                preMonthDays = dayType[month - 2],
                thisMonthDays = dayType[month - 1],
                nextMonthDays = dayType[month]

            let daysArr = [], preDaysArr = [], nextDaysArr = []
            for (let i = 1; i <= thisMonthDays; i++) {
                daysArr.push(i)
            }
            for (let i = 1; i <= preMonthDays; i++) {
                preDaysArr.push(i)
            }
            for (let i = 1; i <= nextMonthDays; i++) {
                nextDaysArr.push(i)
            }

            const tWeek = new Date(`${year}-${month}`).getDay()

            // 补上 上个月的天数
            if (tWeek !== 0) {
                const pDaysArr = preDaysArr.slice(preDaysArr.length - tWeek, preDaysArr.length)
                daysArr = pDaysArr.concat(daysArr)
            }

            // 补上 下个月的天数
            if (daysArr.length % 7 > 0) {
                const nDaysArr = nextDaysArr.slice(0, daysArr.length % 7)
                daysArr.push(nDaysArr)
            }
            
            return daysArr
        }
    }
}
</script>

<style lang="scss" scoped>

.mode_weather{

    .week{
        display: flex;
        line-height: 30px;
        justify-content: space-around;
        border-bottom: 1px solid #ddd;
    }

    .top{

        .search_box{
            position: relative;
            display: inline-block;

            select{
                width: 80px;
            }

            .vir_input{
                position: absolute;
                top: 0;
                left: 0;
                display: inline-block;
                width: 56px;
                background-color: #fff;
                height: 13px;
                z-index: 2;
            }
        }

    }

    .days{
        position: fixed;
        display: flex;
        top: 84px;
        width: 100%;
        bottom: 0;
        justify-content: space-around;
        flex-wrap: wrap;
        align-items: center;
        text-align: center;

        .day_item{
            position: relative;
            display: inline-block;
            width: 14.2857%;
            color: #fff;
            // width: 14.1%;
            // border-right: 1px solid #ddd;
            // border-bottom: 1px solid #ddd;

            &:nth-child(7n){
                // border-right: 0;
            }
        }

        .today_item{
            background-color: rgba($color: #000000, $alpha: .3);
        }
    }

    .day_detail{
        position: absolute;
        top: 0;
        left: 60px;
        background-color: rgba($color: #000000, $alpha: .5);
        z-index: 1;
        width: 200px;
        height: 200px;
        overflow-y: scroll;
    }
}

</style>

