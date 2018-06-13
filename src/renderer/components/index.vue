<template>
    <div class="container">
        <header>
            滴答-日历
            <div class="modes">
                <span class="mode_basic" @click="changeMode(1)"></span>
                <span class="mode_weather" @click="changeMode(2)"></span>
                <span class="mode_day" @click="changeMode(3)"></span>
            </div>
        </header>

        <div class="wrapper" :style="{'background-image': `url(${bingImgUrl})`}">

            <mode-basic v-show="modeType === 1"></mode-basic>
            <mode-day v-show="modeType === 2"></mode-day>
            <mode-weather v-show="modeType === 3"></mode-weather>

        </div>

    </div>
</template>

<script>

import ModeBasic from './mode_basic'
import ModeDay from './mode_day'
import ModeWeather from './mode_weather'
import axios from 'axios'

// TODO 获取用户的定位 若不进行定位则默认为上海

const DEFAULT_IMG = 'https://cn.bing.com/az/hprichbg/rb/WhalePod_ZH-CN9101375608_1920x1080.jpg'// 默认图片地址

export default {
    name: 'index',
    data() {
        return{
            bingImgUrl: '',
            modeType: 1, // 初始的tab为basic模式
        }
    },
    mounted() {
        this.init()
    },
    methods: {
        init() {
            this.getBingImg()
        },
        getBingImg() {
            const getBingImgApi = 'https://www.bing.com/HPImageArchive.aspx?format=js&idx=0&n=1'
            
            axios.get(getBingImgApi).then(res => {
                this.bingImgUrl = `https://cn.bing.com/${res.data.images[0].url}`
            }).catch(err => {
                console.log('getbingimg:', err)
                this.bingImgUrl = DEFAULT_IMG
            })
        },
        changeMode(type) {
            this.modeType = type
        },
    },
    components: {
        'mode-basic': ModeBasic,
        'mode-day': ModeDay,
        'mode-weather': ModeWeather,
    }
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

    i{
        font-stretch: normal;
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
        
    }

}

</style>




