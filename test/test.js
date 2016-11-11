
/**
 * Created by yanshi0429 on 16/11/11.
 */
var assert = require("assert"),
    chai = require("chai"),
    should = chai.should(),
    expect = chai.expect,
    emojis = require('./emoji'),
    liteMarked = require('../lib/marked.lite.js'),
    plainTextRenderer = require('../lib/plainTextRenderer.js');

var marketOptions = {
    gfm: true,
    tables: false,
    breaks: true,
    pedantic: false,
    sanitize: false,
    smartLists: false,
    smartypants: false,
    heading: false,
    link: false,
    list: false,
    wtlink: true,
    wthexcolor: true,
    wthexcolorRender:{
        className: 'msg-inline-color'
    },
    wtat: true,
    wtatRender:{
        memberPrefix:'/messages/groups/563212112aa22e1d139e95c5/members/',
        className:"slide-trigger"
    },
    wthash: true,
    wtentity:true,
    wtentityRender:{
        className:"slide-trigger"
    },
    wthashRender:{
        chlPrefix:"/messages/groups/"
    },
    wtexclamation: true,
    wtemoji: true,
    //wtemojiRender: this.emoji,
    isParagraphDefault:false,
    isImageDefault:false,
    isBlockquoteDefault:false,
    isHrDefault:false,
    isStrongDefault:false,
    isEmDefault:false,
    isCodespanDefault:false,
    isCodeDefault:false,
    isDelDefault:false,
    isHtmlDefault:false
};

var getEmojiImageSrc;
var emojiStyle = 1;
if (emojiStyle == 2) {
    getEmojiImageSrc = function (emoji) {
        if (emoji.unicode) {
            return '/image/emojione/' + emoji.unicode + '.png';
        } else {
            return '/image/emoji/' + encodeURIComponent(emoji.name) + '.png';
        }
    };
} else {
    getEmojiImageSrc = function (emoji) {
        return '/image/emoji/' + encodeURIComponent(emoji.name) + '.png';
    };
}

var emojiClassName;
var emojiSize = 1;
switch (parseInt(emojiSize)) {
    case 2:
        emojiClassName = "middle";
        break;
    case 3:
        emojiClassName = "big";
        break;
    case 4:
        emojiClassName = "most";
        break;
    default:
        break;
}
emojiClassName = 'emoji ' + emojiClassName;

marketOptions.wtemojiRender = {
    emojis     : emojis,
    getImageSrc: getEmojiImageSrc,
    className  : emojiClassName
};
liteMarked.setOptions(marketOptions);


//var format = new Format(converterObj);

function process(src, dest, action) {
    var desc = 'should convert \''
        + src
        + '\' to \''
        + dest
        + '\'';

    it(desc, function() {
        //var html = format[action](src);
        var html;
        if(action !== 'toPlainText'){
            html = liteMarked[action](src);
        }else{
            html = liteMarked[action](src,new plainTextRenderer());
        }
        return html.should.equal(dest);
    });
}

var markdown = [
    {
        src: '*123*',
        dest: '<em>123</em>'
    }, {
        src: '**123**',
        dest: '<strong>123</strong>'
    }, {
        src: '***123***',
        dest: '<strong><em>123</em></strong>'
    }, {
        src: '****123****',
        dest: '<strong><strong>123</strong></strong>'
    }, {
        src: '*****123*****',
        dest: '<strong>*</strong>123<strong>*</strong>'
    }, {
        src: '`123`',
        dest: '<code>123</code>'
    }, {
        src: '```123```',
        dest: '<pre>123</pre>'
    }, {
        src: '>123',
        dest: '<blockquote>123</blockquote>'
    }, {//break
        src: '123\n456',
        dest: '123<br>456'
    }, {//paragraph
        src: '123\n\n456',
        dest: '123<br><br>456'
    }, {
        src: '* 123\n* 456',
        dest: '* 123<br>* 456'
    }, {
        src: '* 123\n\n* 456',
        dest: '* 123<br><br>* 456'
    }, {
        src: '- 123\n- 456',
        dest: '- 123<br>- 456'
    }, {
        src: '- 123\n\n- 456',
        dest: '- 123<br><br>- 456'
    }, {
        src: '1. 123\n2.',
        dest: '1. 123<br>2.'
    }, {
        src: '*123* 456',
        dest: '<em>123</em> 456'
    }, {
        src: '`123` 456 *789*',
        dest: '<code>123</code> 456 <em>789</em>'
    }, {
        src: '`123` `456` *789*',
        dest: '<code>123</code> <code>456</code> <em>789</em>'
    }
];

var nothing = [
    {
        src: '#heading',
        dest: '#heading'
    }, {
        src: '# heading',
        dest: '# heading'
    }, {
        src: '## heading',
        dest: '## heading'
    }, {
        src: '### heading',
        dest: '### heading'
    }, {//hr -- horizontal rule
        src: '-_-',
        dest: '-_-'
    }, {//hr
        src: '_-_',
        dest: '_-_'
    }, {//hr
        src: '---',
        dest: '---'
    }, {//hr
        src: '___',
        dest: '___'
    }, {//hr
        src: '***',
        dest: '***'
    }, {
        src: '_123_',
        dest: '_123_'
    }, {
        src: '__123__',
        dest: '__123__'
    }, {
        src: '___123___',
        dest: '___123___'
    }, {
        src: '____123____',
        dest: '____123____'
    }, {
        src: '_____123_____',
        dest: '_____123_____'
    }, {
        src: '``123``',
        dest: '``123``'
    }, {
        src: '````123````',
        dest: '````123````'
    }, {
        src: '`````123`````',
        dest: '`````123`````'
    }, {
        src: '~~123~~',
        dest: '~~123~~'
    }, {
        src: '<div>123</div>',
        dest: '<div>123</div>'
    }, {
        src: '[null, 1, 2, null]',
        dest: '[null, 1, 2, null]'
    }, {
        src: '123 456',
        dest: '123 456'
    }, {
        src: '￥19571.232015-12-31 12:26:23',
        dest: '￥19571.232015-12-31 12:26:23'
    }
    /*{
     src: '[123](http://123.com)',
     dest: '[123](http://123.com)'
     }*/
];

var customization = [
    {
        src: ':smile:',
        dest: '<img class="emoji undefined" title=":smile:" alt="smile" src="/image/emoji/smile.png" />'
    }, {
        src: ':kissing_closed_eyes:',
        dest: '<img class="emoji undefined" title=":kissing_closed_eyes:" alt="kissing_closed_eyes" src="/image/emoji/kissing_closed_eyes.png" />'
    }, {
        src: '123 :kissing_closed_eyes:',
        dest: '123 <img class="emoji undefined" title=":kissing_closed_eyes:" alt="kissing_closed_eyes" src="/image/emoji/kissing_closed_eyes.png" />'
    }, {
        src: ':kissing_closed_eyes: 456',
        dest: '<img class="emoji undefined" title=":kissing_closed_eyes:" alt="kissing_closed_eyes" src="/image/emoji/kissing_closed_eyes.png" /> 456'
    }, {
        src: '123 :kissing_closed_eyes: 456',
        dest: '123 <img class="emoji undefined" title=":kissing_closed_eyes:" alt="kissing_closed_eyes" src="/image/emoji/kissing_closed_eyes.png" /> 456'
    }, {
        src: '[https://github.com/123|123]',
        dest: '<a href="https://github.com/123" target="_blank">123</a>'
    }, {
        src: '[lesscaht.com|lesschat]',
        dest: '<a href="lesscaht.com">lesschat</a>'
    }, {
        src: 'lesschat.com',
        dest: 'lesschat.com'
    }, {
        src: 'https://lesschat.com',
        dest: '<a href="https://lesschat.com" target="_blank">https://lesschat.com</a>'
    }, {
        src: 'http://lesschat.com',
        dest: '<a href="http://lesschat.com" target="_blank">http://lesschat.com</a>'
    }, {
        src: 'http://lesschat.com 123',
        dest: '<a href="http://lesschat.com" target="_blank">http://lesschat.com</a> 123'
    }, {
        src: '123 http://lesschat.com',
        dest: '123 <a href="http://lesschat.com" target="_blank">http://lesschat.com</a>'
    }, {
        src: 'http://lesschat.com 123 http://lesschat.com',
        dest: '<a href="http://lesschat.com" target="_blank">http://lesschat.com</a> 123 <a href="http://lesschat.com" target="_blank">http://lesschat.com</a>'
    }, {
        src: '[http://lesschat.com]',
        dest: '<a href="http://lesschat.com" target="_blank">http://lesschat.com</a>'
    }, {
        src: '[http://lesschat.com 123]',
        dest: '<a href="http://lesschat.com 123" target="_blank">http://lesschat.com 123</a>'
    }, {
        src: '[lesscaht.com|lesschat]',
        dest: '<a href="lesscaht.com">lesschat</a>'
    }, {
        src: '[/drive/123456|开发]',
        dest: '<a href="/drive/123456">开发</a>'
    }, {
        src: '[https://room.co/#/lesschat-1582398af7a7|点击开始]',
        dest: '<a href="https://room.co/#/lesschat-1582398af7a7" target="_blank">点击开始</a>'
    }, {
        src: '[https://github.com/sunjingyun1/demo-of-mocha/commit/86354b402154015b991df789257c335b05759b35|#994 #792#775#abc  can you relate to the task?]',
        dest: '<a href="https://github.com/sunjingyun1/demo-of-mocha/commit/86354b402154015b991df789257c335b05759b35" target="_blank">#994 #792#775#abc  can you relate to the task?</a>'
    }, {
        src: '[https://github.com/sunjingyun1/demo-of-mocha/commit/86354b402154015b991df789257c335b05759b35|*123*]',
        dest: '<a href="https://github.com/sunjingyun1/demo-of-mocha/commit/86354b402154015b991df789257c335b05759b35" target="_blank">*123*</a>'
    }, {
        src: '[@e9dab10e0d5f40b492c7a85ec04a00a8|wanghao1891]',
        dest: '<a href="/messages/groups/563212112aa22e1d139e95c5/members/e9dab10e0d5f40b492c7a85ec04a00a8" class="slide-trigger" >@wanghao1891</a>'
    }, {
        src: '123 [@e9dab10e0d5f40b492c7a85ec04a00a8|wanghao1891] 456',
        dest: '123 <a href="/messages/groups/563212112aa22e1d139e95c5/members/e9dab10e0d5f40b492c7a85ec04a00a8" class="slide-trigger" >@wanghao1891</a> 456'
    }, {
        src: '[@7eb97709402140ab9a29787b49131334|Terry] [@5adcb3936b8240e5a821c566f7eb5c5f|王浩] [@c01a95b2898c4f339ef80befbca2f037|Shaun Xu] [@d37ed022f9bc4fde92bb790b850e5982|孙敬云] http://activitystrea.ms/',
        //dest: ''
        dest: '<a href="/messages/groups/563212112aa22e1d139e95c5/members/7eb97709402140ab9a29787b49131334" class="slide-trigger" >@Terry</a> <a href="/messages/groups/563212112aa22e1d139e95c5/members/5adcb3936b8240e5a821c566f7eb5c5f" class="slide-trigger" >@王浩</a> <a href="/messages/groups/563212112aa22e1d139e95c5/members/c01a95b2898c4f339ef80befbca2f037" class="slide-trigger" >@Shaun Xu</a> <a href="/messages/groups/563212112aa22e1d139e95c5/members/d37ed022f9bc4fde92bb790b850e5982" class="slide-trigger" >@孙敬云</a> <a href="http://activitystrea.ms/" target="_blank">http://activitystrea.ms/</a>'
    }, {
        src: '[@e9dab10e0d5f40b492c7a85ec04a00a8|wanghao1891]: 好的，你家宝宝肯定是个调皮的孩子',
        dest: '<a href="/messages/groups/563212112aa22e1d139e95c5/members/e9dab10e0d5f40b492c7a85ec04a00a8" class="slide-trigger" >@wanghao1891</a>: 好的，你家宝宝肯定是\
个调皮的孩子'
    }, {
        src: '[#38347lslfds|开发小队]',
        dest: '<a href="/messages/groups/38347lslfds" >开发小队</a>'
    }, {
        src: '123 [#38347lslfds|开发小队] 456',
        dest: '123 <a href="/messages/groups/38347lslfds" >开发小队</a> 456'
    }, {
        src: '[#000|fff]',
        dest: '<a href="/messages/groups/000" >fff</a>'
    }, {
        src: '[!group|群组]',
        dest: '<span class="mention group">@群组</span>'
    }, {
        src: '[!channel|频道]',
        dest: '<span class="mention channel">@频道</span>'
    }, {
        src: '123 [!channel|频道] 456',
        dest: '123 <span class="mention channel">@频道</span> 456'
    }, {
        src: '[!channel|群组] : 我把按键选择封装成了一个插件 ng-key-selection，并且在选择成员的地方已经使用，大家今后在弹出框显示列表的地方可以使用，使用方式参见：https://github.com/why520crazy/ng-key-selection',
        dest: '<span class="mention channel">@群组</span> : 我把按键选择封装成了一个插件 ng-key-selection，并且在选择成员的地方已经使用，大家今后在弹出框显示列表的地方可以使用，使用方式参见：<a href="https://github.com/why520crazy/ng-key-selection" target="_blank">https://github.com/why520crazy/ng-key-selection</a>'
    }, {
        src: '#000',
        dest: '#000<div class="msg-inline-color" style="background:#000"></div>'
    }, {
        src: '#0fa',
        dest: '#0fa<div class="msg-inline-color" style="background:#0fa"></div>'
    }, {
        src: '#00ffaa',
        dest: '#00ffaa<div class="msg-inline-color" style="background:#00ffaa"></div>'
    }, {
        src: '123 #0fa',
        dest: '123 #0fa<div class="msg-inline-color" style="background:#0fa"></div>'
    }, {
        src: '#0fa 456',
        dest: '#0fa<div class="msg-inline-color" style="background:#0fa"></div> 456'
    }, {
        src: '123 #0fa 456',
        dest: '123 #0fa<div class="msg-inline-color" style="background:#0fa"></div> 456'
    }, {
        src: '[https://github.com/sunjingyun|sUnjingyun] 在 [https://bitbucket.org/sunjingyun/demo-of-mocha/|sunjingyun/demo-of-mocha] 分支 [https://github.com/a/master|master] 上提交了代码, [lesscaht.com|lesschat] 和 lesschat.com 和 https://lesschat.com 和 [http://lesschat.com] http://lesschat.com [/drive/123456|开发] [http://experience.lesschat.local:8100/messages/groups|groups] [https://room.co/#/lesschat-1582398af7a7|点击开始] [123](http://123.com) http://lesschat.local:8100/shared/18eccb8104674f26bd8ffa75c4f31f61',
        dest: '<a href="https://github.com/sunjingyun" target="_blank">sUnjingyun</a> 在 <a href="https://bitbucket.org/sunjingyun/demo-of-mocha/" target="_blank">sunjingyun/demo-of-mocha</a> 分支 <a href="https://github.com/a/master" target="_blank">master</a> 上提交了代码, <a href="lesscaht.com">lesschat</a> 和 lesschat.com 和 <a href="https://lesschat.com" target="_blank">https://lesschat.com</a> 和 <a href="http://lesschat.com" target="_blank">http://lesschat.com</a> <a href="http://lesschat.com" target="_blank">http://lesschat.com</a> <a href="/drive/123456">开发</a> <a href="http://experience.lesschat.local:8100/messages/groups" target="_blank">groups</a> <a href="https://room.co/#/lesschat-1582398af7a7" target="_blank">点击开始</a> [123](<a href="http://123.com)" target="_blank">http://123.com)</a> <a href="http://lesschat.local:8100/shared/18eccb8104674f26bd8ffa75c4f31f61" target="_blank">http://lesschat.local:8100/shared/18eccb8104674f26bd8ffa75c4f31f61</a>'
    },{
        src:'[#task-5768f70268acfb33075b0943|任务]',
        dest:'<a token="[#task-5768f70268acfb33075b0943|任务]" class="hand slide-trigger marked-entity" >#任务</a>'
    },{
        src:'[#event-581afdc86587fd8b2d186e47|日程]',
        dest:'<a token="[#event-581afdc86587fd8b2d186e47|日程]" class="hand slide-trigger marked-entity" >#日程</a>'
    },{
        src:'[#file-56a87603df467f4012df12a0|网盘]',
        dest:'<a token="[#file-56a87603df467f4012df12a0|网盘]" class="hand slide-trigger marked-entity" >#网盘</a>'
    }
];

var plaint = [
    {
        src: '[https://github.com/123|123]',
        dest: 'https://github.com/123'
    }, {
        src: '[lesscaht.com|lesschat]',
        dest: 'lesscaht.com'
    }, {
        src: 'lesschat.com',
        dest: 'lesschat.com'
    }, {
        src: 'https://lesschat.com',
        dest: 'https://lesschat.com'
    }, {
        src: 'http://lesschat.com',
        dest: 'http://lesschat.com'
    }/*, {
     src: '[http://lesschat.com]',
     dest: 'http://lesschat.com'
     }*/, {
        src: '[/drive/123456|开发]',
        dest: '/drive/123456'
    }, {
        src: '[https://room.co/#/lesschat-1582398af7a7|点击开始]',
        dest: 'https://room.co/#/lesschat-1582398af7a7'
    }, {
        src: '[@e9dab10e0d5f40b492c7a85ec04a00a8|wanghao1891]',
        dest: '@wanghao1891'
    }, {
        src: '[#38347lslfds|开发小队]',
        dest: '#开发小队'
    }, {
        src: '[!group|群组]',
        dest: '@群组'
    }, {
        src: '[!channel|频道]',
        dest: '@频道'
    }
];


var all = {
    markdown: {
        data: markdown,
        action: 'toHTML'
    },
    nothing: {
        data:nothing,
        action: 'toHTML'
    },
    customization: {
        data: customization,
        action: 'toHTML'
    },
    plaint: {
        data: plaint,
        action: 'toPlainText'
    }
};

for(var key in all) {
    describe(key, function() {
        all[key].data.forEach(function(e) {
            process(e.src, e.dest, all[key].action);
        });
    });
}

//describe('markdown', function() {
//    markdown.forEach(function(e) {
//        process(e.src, e.dest);
//    });
//});
//
//describe('nothing', function() {
//    nothing.forEach(function(e) {
//        process(e.src, e.dest);
//    });
//});
