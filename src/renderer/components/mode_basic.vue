<template>
    <div class="mode_basic">
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
    </div>
</template>

<script>

import API from '../../API'

const NOW = new Date()

export default {
    name: 'mode-basic',
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
    mounted() {
        this.getVocation()
    },
    methods: {
        isLeapYear(year) {
            return ( year % 4 == 0 || year % 400 == 0 ) && year % 100 != 0 
        },
        dayType(year) {
            return this.isLeapYear(year) ? this.dayType2 : this.dayType1
        },
        getVocation() {
            // TODO 爬虫获取节假日
            API.getVocation({
                date: this.year
            }).then(res => {
                // console.log(res)
                // DOMParser.parse
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
    }
}
</script>

<style lang="scss" scoped>

.mode_basic{

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


