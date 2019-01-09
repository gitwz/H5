// 3.通用函数
function g(selector){
    var method = selector.substr(0,1) === '.' ? 'getElementsByClassName' : 'getElementById';
    return document[method](selector.substr(1));
}
// 随机生成一个数值 ，可以设置却值范围 random([min], [max])
function random(range) {
    var max = Math.max(range[0], range[1]);
    var min = Math.min(range[0], range[1]);

    var diff = max - min;
    var number = Math.ceil(Math.random()*diff + min);
    return number;
}

// 4.输出所有海报
var data = data;
function addPhotos() {
    var template = g('#wrap').innerHTML;
    var html = [];
    var nav = [];

    //  因为每个海报都对应一个按钮，所以把输出控制按钮放在输出海报中
    // 7. 输出控制按钮, 每个控制按钮都对应一个海报
    for (var s=0; s<data.length; s++){//for (s in data)
        var _html = template.replace('{{index}}', s)
                            .replace('{{img}}', data[s].img)
                            .replace('{{caption}}', data[s].caption)
                            .replace('{{desc}}', data[s].desc);
        html.push(_html);

        var nav_id = '<span id="nav_'+s+'" onclick="turn( g(\'#photo_'+s+'\') )" class="i"></span>';
//                nav_id = nav_id.replace('i', s);
//                nav.push('<span id="nav_'+s+'" onclick="turn( g(\'#photo_'+s+'\') )" class="i">&nbsp</span>');
        nav.push(nav_id);

//                var nav_text = g('.i').innerHTML;
//                console.log( 'nav_text', nav_text);
//                nav_text.replace('{{index}}', s);
    }

    html.push('<div class="nav">'+nav.join('')+'</div>');

    g('#wrap').innerHTML = html.join('');// 用 '' 连接起来，默认是 ,

    resort(random([0, data.length]));
}
addPhotos();

//6. 计算左右分区的范围{left: {x: [min, max], y:[min, max]}, right: {x: [min, max], y:[min, max]}}
function range(){
    var range = {left: {x: [], y: []}, right: {x:[], y:[]}};
    var wrap = {
        w: g('#wrap').clientWidth,
        h: g('#wrap').clientHeight
    };
//
    var photo = {
        w: g('.photo')[0].clientWidth,
        h: g('.photo')[0].clientHeight
    };

    range.wrap = wrap;
    range.photo = photo;

    range.left.x = [0-photo.w, wrap.w/2 - photo.w/2];
    range.left.y = [0-photo.h, wrap.h];

    range.right.x = [wrap.w/2 + photo.w/2, wrap.w + photo.w];
    range.right.y = range.left.y;

    return range;
}

//5. 排序海报
function resort(n){

    var _photo = g('.photo');
    var photos = []; /*把获取的元素转化成数组*/

    for (var i=0; i<_photo.length; i++){ /*排序前的初始化*/
        _photo[i].className = _photo[i].className.replace(/\s*photo_center\s*/, ' ');

        _photo[i].className = _photo[i].className.replace(/\s*photo_front\s*/, ' ');

        _photo[i].className = _photo[i].className.replace(/\s*photo_back\s*/, ' ');

        _photo[i].className += ' photo_front';
//
        _photo[i].style.left = '';
        _photo[i].style.top ='';

        _photo[i].style['-webkit-transform']='rotate(0deg) scale(1.3)';

        photos.push(_photo[i]);
    }

    var photo_center = g('#photo_'+n);
    photo_center.className += ' photo_center';
    photo_center = photos.splice(n, 1)[0];// 从第n个切割,切1个,取第0个，拿到了那个 photo_center 元素


    // 把海报分为左右两部分
    var photos_left = photos.splice(0, Math.ceil(photos.length/2));
    var photos_right = photos;

    var ranges = range();
    for (var s=0; s<photos_left.length; s++){ //  s in photos_left
        var photo = photos_left[s];

        photo.style.left = random(ranges.left.x) + 'px';
        photo.style.top = random(ranges.left.y) + 'px';

        photo.style['-webkit-transform'] = 'rotate('+random([-150, 150])+'deg) scale(1)';// 随机旋转
    }

    for (var s=0; s<photos_right.length; s++){
        var photo = photos_right[s];
        photo.style.left = random(ranges.right.x) + 'px';
        photo.style.top = random(ranges.right.y) + 'px';

        photo.style['-webkit-transform'] = 'rotate('+random([-150, 150])+'deg) scale(1)';

    }

    // 控制按钮处理 ,给当中间的那个元素的按钮加上 类 i_current
    var navs = g('.i');
    for (var s=0; s<navs.length; s++){
        navs[s].className = navs[s].className.replace(/\s*i_current\s*/, ' ');
        navs[s].className = navs[s].className.replace(/\s*i_back\s*/, ' ');

    }
    g('#nav_'+n).className += ' i_current ';

}


//1.翻面控制
function turn (elem){
    var cls = elem.className;
    var n = elem.id.split('_')[1];
//            console.log('n', n);

    if(!/photo_center/.test(cls)){ /*点击按钮 从新排序海报*/
        return resort(n);
    }

    if (/photo_front/.test(cls)){
        cls = cls.replace(/photo_front/, 'photo_back');
        g('#nav_'+n).className += ' i_back ';
    }else{
        cls = cls.replace(/photo_back/, 'photo_front');
        g('#nav_'+n).className = g('#nav_'+n).className.replace(/i_back/, '');
    }
    return elem.className = cls;
}
