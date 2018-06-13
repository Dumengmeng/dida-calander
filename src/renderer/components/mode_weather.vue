<template>
    <div class="mode_weather">
        <div class="top">
            <span class="now_time">{{year}}年{{month}}月</span>
            <span class="countday">今年第<i>{{dayCount}}</i>天</span>
        </div>

        <ul class="week">
            <li v-for="(item, index) in weekArr" :key="index">{{item}}</li>
        </ul>
        <ul class="days">
            <li class="day_item" v-for="(item, idx) in daysArr" :key="idx">{{item}}</li>
        </ul>

        <!-- 弹窗 -->
        <div class="day_detail">
            <div>PM2:</div>
            <div>湿度：</div>
        </div>

    </div>
</template>

<script>

/**
 * TODO
 * 获取历史天气： https://www.juhe.cn/docs/api/id/277 收费接口，待替换
 * 获取天气接口：https://www.jianshu.com/p/e3e04cf3fc0f 待确定
 * 
 */

import axios from 'axios'

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
    methods: {
        isLeapYear(year) {
            return ( year % 4 == 0 || year % 400 == 0 ) && year % 100 != 0 
        },
        dayType(year) {
            return this.isLeapYear(year) ? this.dayType2 : this.dayType1
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

</style>

