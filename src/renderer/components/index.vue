<template>
    <div class="container">
        <header>
            <div class="title">
                <h3>滴答-日历</h3>
                <div class="modes">
                    <span class="mode_basic" @click="changeMode(1)">日历</span>
                    <span class="mode_weather" @click="changeMode(2)">天气</span>
                    <!-- <span class="mode_day" @click="changeMode(3)">day</span> -->
                </div>
            </div>
        </header>

        <div class="wrapper" :style="{'background-image': `url(${bingImgUrl})`}">
                
            <div class="shadow">
                <mode-basic v-show="modeType === 1"></mode-basic>
                <mode-weather v-show="modeType === 2"></mode-weather>
                <!-- <mode-day v-show="modeType === 3"></mode-day> -->
            </div>

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
            isMoveTop: false,
        }
    },
    watch: {
        modeType(val) {
            console.log('watch')
            // return this.modeType === 1
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

    h3{
        margin: 0;
        padding: 0;
    }

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
        height: 38px;
        line-height: 38px;
        text-align: center;
        -webkit-app-region: drag;
        background: linear-gradient(to top, rgba(211, 209, 211, 1), rgba(230, 230, 230, 1));
        // background: linear-gradient(to top, rgba(239, 239, 248, 1), rgba(239, 239, 248, .1));
        // border-bottom: 1px solid rgb(187, 187, 187);
        
        .title{
            position: absolute;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);

            .modes{
                position: absolute;
                right: -140px;
                top: 50%;
                transform: translateY(-50%);
                width: 100px;
                height: 20px;
                border-radius: 4px;
                overflow: hidden;
                cursor: pointer;

                .mode_basic, .mode_weather{
                    position: absolute;
                    left: 0;
                    top: 0;
                    color: #ccc;
                    font-size: 12px;
                    width: 50px;
                    height: 20px;
                    line-height: 23px;
                    background-color: papayawhip;
                }

                .mode_weather{
                    right: 0;
                    left: auto;
                }

                .mode_day{
                    background-color: papayawhip;
                }
                
                .cur_mode{
                    color: #fff;
                    background-color: peru;
                }
            }
        }
        
    }

    .wrapper{
        position: fixed;
        top: 38px;
        left: 0;
        right: 0;
        bottom: 0;
        z-index: 1;
        background-size: cover;
        background-position: center;
        background-attachment: fixed;

        .shadow{
            margin: 60px;
            padding: 20px;
            position: fixed;
            top: 38px;
            left: 0;
            right: 0;
            bottom: 0;
            overflow: hidden;
            background-color: hsla(0,0%,100%,.3);
            border-radius: 16px;
            color: #fff;
            
            &:after{
                content: '';
                margin: -30px;
                position: absolute;
                top: 0;
                right: 0;
                bottom: 0;
                left: 0;
                z-index: -1;
                background-color: rgba(255, 255, 255, .8);
                background-image: url(https://cn.bing.com//az/hprichbg/rb/HONKONG_ZH-CN11971924406_1920x1080.jpg);
                filter: blur(20px);
                background-size: cover;
                background-position: center;
                background-attachment: fixed;
            }
        }

        

    }

}

</style>




