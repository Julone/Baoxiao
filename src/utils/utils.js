import store from '@/store';

export const dateFormat = function (time, fmt = 'yyyy-MM-dd') {
    time = time instanceof Date ?  time : new Date(time);
    var o = {
        "M+": time.getMonth() + 1, //月份 
        "d+": time.getDate(), //日 
        "h+": time.getHours(), //小时 
        "m+": time.getMinutes(), //分 
        "s+": time.getSeconds(), //秒 
        "q+": Math.floor((time.getMonth() + 3) / 3), // 季度
        "S": time.getMilliseconds() // 毫秒
    };
    if (/(y+)/.test(fmt)) {
        fmt = fmt.replace(RegExp.$1, (time.getFullYear() + "").substr(4 - RegExp.$1.length));
    }
    for (var k in o) {
        if (new RegExp("(" + k + ")").test(fmt)) fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
    }
    return fmt;
}
export function timeAgo(time) {
    // var currentTime = store.getters.getServerTime(2);
    var currentTime = new Date();
    var dateTime = time.toString().replace(/-/g, "/").replace(/\.[\d]+$/,'');
    var d_day = new Date(dateTime).getTime() || dateTime;
    var day = Math.abs(parseInt(((d_day - currentTime) / 1000 / 3600 / 24).toFixed(2)));
    var hour = Math.abs(parseInt(((d_day - currentTime) / 1000 / 3600).toFixed(2)));
    var minutes = Math.abs(parseInt(((d_day - currentTime) / 1000 / 60).toFixed(2)));
    var seconds = Math.abs(parseInt(((d_day - currentTime) / 1000).toFixed(2)));
    if (day > 367) {
        return parseInt(day / 365) + "年前".toString();
    } else if (day > 31) {
        return parseInt(day / 30) + "月前".toString();
    } else if (day >= 2) {
        return parseInt(day) + "天前".toString();
    } else if (day > 0 && day < 2) {
        return "昨天".toString();
    } else if (hour > 0 && hour < 24) {
        return parseInt(hour) + "小时前".toString();
    } else if (minutes > 0 && minutes < 60) {
        return parseInt(minutes) + "分钟前".toString();
    } else if (seconds > 0 && seconds < 60) {
        return parseInt(seconds) + "秒前".toString();
    } else if(seconds ==  0){
        return "刚刚";
    }
}


export const addScript = function(url, callback){
    if(!url) return;
    var script = document.createElement('script');
    script.src = url;
    script.onload = callback;
    document.head.appendChild(script);
}

export const dialogConfirm = (callback, options = {}) => {
   return function(){
        var _this = this;
        var arg = arguments
        _this.$dialog.confirm({
                title: options.title || '删除',
                message: options.message || '是否删除?',
        }).then(r=> {
            callback.apply(_this,arg);
        }).catch(noop)
   }
}
export function noop (a, b, c){
    console.log('this is noop function!')
}
export const randomString = (length = 8, withNumber = true) => {
    var enCharPool = 'abcdefghijklmnopqrstuvwxyz';
    var numCharPool = '0123456789';
    var pool = withNumber?enCharPool + numCharPool : enCharPool;
    return Array.from({length}, i => {
        var index = Math.floor(Math.random() * pool.length);
        return pool.substr(index, 1);
    }).join('')
}
export const copyText = (data="", trim = false) => {
    let url = trim? data.trim(): data;
    let oInput = document.createElement('input');
    oInput.value = url;
    document.body.appendChild(oInput);
    oInput.select(); // 选择对象;
    document.execCommand("Copy"); // 执行浏览器复制命令
    oInput.remove()
}
export const scrollTopTo = function(scroller, to, duration, callback) {
    var X = scroller.scrollLeft || scroller.scrollX;
    var currentY = ("scrollTop" in scroller)? scroller.scrollTop : scroller.scrollY ;
    var isDown = currentY < to;
    var frames = duration * 1 === 0 ? 1 : Math.round(duration * 1 / 16);
    var step = (to - currentY) / frames;
    function animate() {
        currentY += step;
        if (isDown && currentY > to || !isDown && currentY < to) {
        currentY = to;
        }
        scroller.scrollTo(X, currentY);
        if (isDown && currentY < to || !isDown && currentY > to) {
            window.requestAnimationFrame(animate)
        } else if (callback) {
            callback();
        }
    }
    animate();
}
export const scrollLeftTo = function(scroller, to, duration, callback) {
    var Y = scroller.scrollLeft || scroller.scrollX;
    var currentX = scroller.scrollLeft || scroller.scrollX;
    var isDown = currentX < to;
    var frames = duration === 0 ? 1 : Math.round(duration * 1 / 16);
    var step = (to - currentX) / frames;
    function animate() {
        currentX += step;
        if (isDown && currentX > to || !isDown && currentX < to) {
        currentX = to;
        }
        scroller.scrollTo(currentX, Y);
        if (isDown && currentX < to || !isDown && currentX > to) {
            window.requestAnimationFrame(animate)
        } else if (callback) {
            callback();
        }
    }
    animate();
}