<template>
    <div class="container">
        <header>
            <span>滴答-日历</span>
            <div class="modes">
                <span class="mode_basic" @click="changeMode(1)">base</span>
                <span class="mode_weather" @click="changeMode(2)">weather</span>
                <span class="mode_day" @click="changeMode(3)">day</span>
            </div>
        </header>

        <div class="wrapper" :style="{'background-image': `url(${bingImgUrl})`}">
                
            <mode-basic v-show="modeType === 1"></mode-basic>
            <mode-weather v-show="modeType === 2"></mode-weather>
            <mode-day v-show="modeType === 3"></mode-day>

        </div>

    </div>
</template>

<script>

import ModeBasic from './mode_basic'
import ModeDay from './mode_day'
import ModeWeather from './mode_weather'
import axios from 'axios'


// TODO 获取用户的定位 若不进行定位则默认为上海
// pc端与h5端场景不同，无需自动定位，直接让用户手动选择城市，并将该信息存储起来，若要更改，直接在设置中切换

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

        //测试缓存
        this.$nextTick(() => {
            // console.log(window)
            // sessionStorage.setItem('aaa', '123')
        })
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
        // font-stretch: normal;
        font-style: normal;
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
        padding: 20px;
        position: fixed;
        top: 38px;
        left: 0;
        right: 0;
        bottom: 0;
        background-size: cover;
        background: hsla(0,0%,100%,.3);
        overflow: hidden;

        &:before{
            // margin: -30px;
            content: '';
            position: absolute;
            top: 0;
            right: 0;
            bottom: 0;
            left: 0;
            z-index: -1;
            filter: blur(10px);
            background: url(https://cn.bing.com//az/hprichbg/rb/CypressPygmyOwl_ZH-CN12382299143_1920x1080.jpg);
            // background: rgba(255, 0, 0, .5);
            
        }

        
    }

}

</style>




