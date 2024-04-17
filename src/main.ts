/*
 * @Author: Chenyichen12 sama1538@outlook.com
 * @Date: 2024-03-11 23:03:44
 */
import { createApp } from 'vue'
import './style.css'
import ElementPlus from 'element-plus' //全局引入
import 'element-plus/dist/index.css'
import App from './App.vue'


const app = createApp(App)
app.use(ElementPlus)
app.mount('#app')



window.onload = function () {
    document.addEventListener('touchstart', function (event) {
        if (event.touches.length > 1) {
            event.preventDefault();
        }
    });
    var lastTouchEnd = 0;
    document.addEventListener('touchend', function (event) {
        var now = (new Date()).getTime();
        if (now - lastTouchEnd <= 300) {
            event.preventDefault();
        }
        lastTouchEnd = now;
    }, false);
    document.addEventListener('gesturestart', function (event) {
        event.preventDefault();
    });
}