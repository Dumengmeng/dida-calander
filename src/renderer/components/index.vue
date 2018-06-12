<template>
    <div class="container">
        <header>
            滴答-日历
            <div class="modes">
                <span class="mode_basic"></span>
                <span class="mode_weather"></span>
                <span class="mode_day"></span>
            </div>
        </header>

        <div class="wrapper" :style="{'background-image': `url(${bingImgUrl})`}">
            
            <div class="top">
                <span class="now_time">{{year}}年{{month}}月</span>
                <span class="countday">今年第<i>{{dayCount}}</i>天</span>
            </div>

            <ul class="week">
                <li v-for="(item, index) in weekArr" :key="index">{{item}}</li>
            </ul>
            <ul class="days">
                <!-- <div v-for="(week, idx) in weekArr" :key="idx"> -->
                        <li class="day_item" v-for="(item, idx) in daysArr" :key="idx">{{item}}</li>
                <!-- </div> -->
            </ul>
        </div>

    </div>
</template>

<script>

import axios from 'axios'
import { ipcRenderer, net } from 'electron'

const NOW = new Date()

export default {
    name: 'index',
    data() {
        return{
            day: NOW.getDate(),
            week: NOW.getDay(),                
            month: NOW.getMonth() + 1,
            year: NOW.getFullYear(),
            dayType1: [31,29,31,30,31,30,31,31,30,31,30,31],
            dayType2: [31,28,31,30,31,30,31,31,30,31,30,31],
            weekArr: ['周日', '周一', '周二', '周三', '周四', '周五', '周六'],

            bingImgUrl: '',
        }
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
            return this._getDaysArrbyGivenMonth(this.year, this.month)
        },
    },
    mounted() {
        this.init()

        ipcRenderer.on('sync-replay', (event, arg) => {
            console.log('renderer receive:', arg + new Date())
        })

        ipcRenderer.send('sync-msg', 'aaa')
    },
    methods: {
        init() {
            this.getBingImg()
        },
        isLeapYear(year) {
            return ( year % 4 == 0 || year % 400 == 0 ) && year % 100 != 0 
        },
        dayType(year) {
            return this.isLeapYear(year) ? this.dayType2 : this.dayType1
        },
        getBingImg() {
            const getBingImgApi = 'https://www.bing.com/HPImageArchive.aspx?format=js&idx=0&n=1'
            axios.get(getBingImgApi).then(res => {
                this.bingImgUrl = `https://cn.bing.com/${res.data.images[0].url}`
            }).catch(err => {
                console.log('getbingimg:', err)
                this.bingImgUrl = 'https://cn.bing.com/az/hprichbg/rb/WhalePod_ZH-CN9101375608_1920x1080.jpg'
                // this.bingImgUrl = 'https://cn.bing.com/az/hprichbg/rb/PenaNationalPalace_ZH-CN12058841312_1920x1080.jpg'
            })
        },
        _getDaysArrbyGivenMonth(year, month) {
            // console.log(year, month, this.dayType(year))
            const dayType = this.dayType(year),
                preMonthDays = dayType[month - 2],
                thisMonthDays = dayType[month - 1],
                nextMonthDays = dayType[month]
            // console.log(sumDaysofMon)

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
            // console.log(daysArr.length)

            // 补上 下个月的天数
            if (daysArr.length % 7 > 0) {
                const nDaysArr = nextDaysArr.slice(0, daysArr.length % 7)
                daysArr.push(nDaysArr)
            }
            
            return daysArr
        }
        
    },
}
</script>

<style lang='scss'>

.container{
    position: relative;
    // background-color: #efeff8;
    font-size: 14px;
    color: rgb(63, 48, 36);
    background-color: rgb(255, 255, 255);

    span{
        display: inline-block;
    }

    ul{
        margin: 0;
        padding: 0;
        list-style: none;
    }

    header{
        position: relative;
        margin: 0;
        line-height: 38px;
        text-align: center;
        -webkit-app-region: drag;
        background: linear-gradient(to top, rgba(211, 209, 211, 1), rgba(230, 230, 230, 1));
        // background: linear-gradient(to top, rgba(239, 239, 248, 1), rgba(239, 239, 248, .1));
        // border-bottom: 1px solid rgb(187, 187, 187);

        .modes{
            position: absolute;
            right: 0;
            bottom: 0;
            height: 20px;
            width: 100%;

            span{
                position: absolute;
                bottom: 0;
                right: -10px;
                width: 50px;
                height: 20px;
                border-radius: 6px 6px 0 0;
            }

            .mode_basic{
                background-color: peru;
                right: 80px;
            }

            .mode_weather{
                background-color: papayawhip;
                right: 40px;
            }

            .mode_day{
                background-color: paleturquoise;
                right: 0;
            }

            
        }
    }

    .wrapper{
        // TODO 磨砂背景样式
        position: fixed;
        top: 38px;
        width: 100%;
        bottom: 0;
        background-size: cover;
        
        .week{
            display: flex;
            line-height: 30px;
            justify-content: space-around;
            border-bottom: 1px solid #ddd;
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
                display: inline-block;
                width: 14.2857%;
                // width: 14.1%;
                // border-right: 1px solid #ddd;
                // border-bottom: 1px solid #ddd;

                &:nth-child(7n){
                    // border-right: 0;
                }
            }
        }


    }

}

</style>




