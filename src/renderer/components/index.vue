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

        <div class="top">
            <span class="now_time">{{year}}年{{month}}月</span>
            <span class="countday">今年第<i>{{dayCount}}</i>天</span>
        </div>

        <content>
            <ul class="week">
                <li v-for="(item, index) in weekArr" :key="index">{{item}}</li>
            </ul>
            <ul class="days">
                <li></li>
            </ul>
        </content>

    </div>
</template>

<script>

const NOW = new Date()

export default {
    name: 'index',
    data() {
        return{
            day: NOW.getDate(),
            week: NOW.getDay(),                
            month: NOW.getMonth() + 1,
            year: NOW.getFullYear(),
            weekArr: ['周日', '周一', '周二', '周三', '周四', '周五', '周六'],
            dayType1: [31,29,31,30,31,30,31,31,30,31,30,31],
            dayType2: [31,28,31,30,31,30,31,31,30,31,30,31],
        }
    },
    computed: {
        isLeapYear() {
            return ( this.year % 4 == 0 || this.year % 400 == 0 ) && this.year % 100 != 0 
        },
        dayType() {
            return this.isLeapYear ? this.dayType2 : this.dayType1
        },
        dayCount() {
            let sum = 0
            this.dayType.forEach((item, index) => {
                if (index < this.month) {
                    sum += item
                }
            })
            return sum + this.day
        }
    },
    mounted() {

    },
    methods: {
        
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

    content{
        
        .week{
            display: flex;
            line-height: 30px;
            justify-content: space-around;
            border-bottom: 1px solid #ddd;
        }
    }

}

</style>


