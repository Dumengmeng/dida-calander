<template>
    <div class="mode_weather">
        <div class="search_box">
            <select name="city" id="city" v-model="cityInfo" @change="changeCity()">
                <option :value="{cityId: item.id, cityName: item.name}" v-for="(item, index) in cityList" :key="index">{{item.name}}</option>
            </select>
            <input class="vir_input" type="text" :placeholder="cityInfo.cityName" @keyup="search()">
        </div>

        <ul class="w_box">
            <li class="w_items" v-for="(item, index) in weatherData" :key="index">
                <span class="w_date" :class="{'today': day === new Date(item.date).getDate()}" >{{new Date(item.date).getDate()}}</span>
                <i>{{item.tmp_min}}℃ ~ {{item.tmp_max}}℃</i>
                <i>白天：{{item.cond_txt_d}}</i>
                <i>夜间：{{item.cond_txt_n}}</i>
                <i>气压：{{item.pres}}</i> 
                <i>相对湿度：{{item.hum}}%</i>
            </li>
        </ul>

        <div class="g_wrapper">
            <P class="title">今日生活指数</P>
            <div class="g_box">
                <ul class="g_item" v-for="(item, index) in guidData" :key="index">
                    <li>{{index+1}}.
                        <span v-if="item.type === 'comf'">舒适度指数：</span>
                        <span v-else-if="item.type === 'cw'">洗车指数：</span>
                        <span v-else-if="item.type === 'drsg'">穿衣指数：</span>
                        <span v-else-if="item.type === 'flu'">感冒指数：</span>
                        <span v-else-if="item.type === 'sport'">运动指数：</span>
                        <span v-else-if="item.type === 'trav'">旅游指数：</span>
                        <span v-else-if="item.type === 'uv'">紫外线指数：</span>
                        <span v-else-if="item.type === 'air'">空气污染扩散条件指数：</span>
                        <span v-else-if="item.type === 'ac'">空调开启指数：</span>
                        <span v-else-if="item.type === 'ag'">过敏指数：</span>
                        <span v-else-if="item.type === 'gl'">太阳镜指数：</span>
                        <span v-else-if="item.type === 'mu'">化妆指数：</span>
                        <span v-else-if="item.type === 'airc'">晾晒指数：</span>
                        <span v-else-if="item.type === 'ptfc'">交通指数：</span>
                        <span v-else-if="item.type === 'fsh'">钓鱼指数：</span>
                        <span v-else-if="item.type === 'spi'">防晒指数：</span>
                        <span>{{item.brf}}</span>
                        <span class="desc">{{item.txt}}</span>
                    </li>
                    <!-- <li>湿度：</li>
                    <li>降水概率：{{item.pop}}</li> -->
                </ul>
            </div>
        </div>
       
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
                this.guidData = res.HeWeather6[0].lifestyle
                // console.log(this.weatherData)
                // console.log(this.guidData)
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
   
    ::-webkit-scrollbar{
        // display: none;
        width: 10px;
        background:rgba(0,0,0,0.2);
    }

    ::-webkit-scrollbar-track{
        // background:rgba(0,0,0,0.1);
    }

    ::-webkit-scrollbar-thumb{
        background:rgba(0,0,0,0.3);
    }

    .week{
        display: flex;
        line-height: 30px;
        justify-content: space-around;
        border-bottom: 1px solid #ddd;
    }

    .search_box{
        position: absolute;
        top: 30px;
        right: 20px;

        select{
            width: 80px;
            border-radius: 2px;
        }

        .vir_input{
            padding-left: 4px;
            padding-top: 2px;
            position: absolute;
            top: 0;
            left: 0;
            width: 56px;
            background-color: #fff;
            height: 14px;
            z-index: 2;
            border-radius: 2px;
            border: 1px solid #999;
        }
    }

    .w_box{
        display: flex;
        justify-content: space-around;

        .w_date{
            display: block;
            position: relative;
            font-size: 18px;
            margin-bottom: 10px;
            text-align: center;
        }

        i{
            margin-bottom: 2px;
            display: block;
        }

        .w_date:before{
            content: '';
            position: absolute;
            top: -4px;
            left: 50%;
            transform: translate(-50%);
            width: 26px;
            height: 26px;
            border: 1px solid #fff;
            border-radius: 50%;
        }

        .today{
            color: yellow;
            font-size: 20px;

            &:before{
                content: '';
                position: absolute;
                top: -4px;
                left: 50%;
                transform: translate(-50%);
                width: 26px;
                height: 26px;
                border: 1px solid red;
                border-radius: 50%;
            }           
        }


    }
 
    .g_wrapper{
        margin-top: 36px;

        .title{
            font-size: 18px;
        }

        .g_box{
            position: absolute;
            bottom: 30px;
            top: 280px;
            left: 20px;
            right: 26px;
            overflow-y: scroll;

            &:after{
                content: '';
                position: absolute;
                bottom: 0;
                left: 0;
                right: 0;
                height: 14px;
                background: linear-gradient( to top, form(rgba(255, 255, 255, .6)) to(rgba(255, 255, 255, .1)) );
            }

            .g_item{
                margin-bottom: 10px;

                .desc{
                    margin-left: 15px;
                    margin-top: 2px;
                    text-indent: 2em;
                }
            }
        }
    }
}

</style>

