import Vue from 'vue';
Vue.directive('moveable', {
    bind: function (el, binding, vnode) {
        var $data = {
            flags: false,
            position: {
                x: 0,
                y: 0
            },
            nx: '',
            ny: '',
            dx: '',
            dy: '',
            xPum: '',
            yPum: '',
        }
        el.addEventListener('touchstart', function(event){
            $data.flags = true;
            var touch;
            if (event.touches) {
                touch = event.touches[0];
            } else {
                touch = event;
            }
            $data.position.x = touch.clientX;
            $data.position.y = touch.clientY;
            $data.dx = el.offsetLeft;
            $data.dy = el.offsetTop;
        })
        el.addEventListener('touchmove', function(event){
            if ($data.flags) {
                var touch;
                if (event.touches) {
                    touch = event.touches[0];
                } else {
                    touch = event;
                }
                $data.nx = touch.clientX - $data.position.x;
                $data.ny = touch.clientY - $data.position.y;
                $data.xPum = $data.dx + $data.nx;
                $data.yPum = $data.dy + $data.ny;
                el.style.left = $data.xPum + "px";
                el.style.top = $data.yPum + "px";
            }
        })
        el.addEventListener('touchend', function(event){
            $data.flags = false;
        })
    }
})