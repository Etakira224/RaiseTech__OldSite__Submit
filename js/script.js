/* 
ハンバーガーに.is-open付与
*/
jQuery(function($) {
    $(".js-hamburger").on("click", function(){
        $(this).toggleClass("is-open");
        $(".gmenu").slideToggle();
        // $(".global-nav").toggleClass("is-open");
        $(".gmenu").toggleClass("is-open");
        $(".base").toggleClass("is-open");
        // $('.global-nav').off();
        console.log("toggleClass__true");
            return false;  
    });
});

// $(function(){
//     $('.js-hamburger').on('click',function(){
//       $("+.global-nav", this).slideToggle(10000);
//       $('.js-hamburger').off();
//         return false;  
//     });
// });

/* 
サブメニュー挙動
*/
// $(function(){
//     $('.js-menu__item__link').each(function(){
//         $(this).hover(function(){
//             $("+.submenu",this).slideToggle();
//             $('.gmenu').not($(this)).siblings('.submenu').slideUp();
//             return false;
//         });
//     });
// });


/* 
以下割と正常に動作してたコード（下で実験中）
今後「割と」の部分は詳細に記述すること
そこで何が行われているか 
*/
/*
// $(function() {
//     $('.js-menu__item__link').hover(function() {
//         $("+.submenu",this).slideDown();
//         $(this).addClass("is-open");
//         // $(".submenu",this).addClass("is-open");
//         // $('.submenu').not(this).slideUp();
//         // $('.submenu',{not:this}).slideUp();
//         console.log("slideDown__true");
//     }, function() {
//         $("+.submenu",this).slideUp();
//         $(this).removeClass("is-open");
//         // $(".submenu",this).removeClass("is-open");
//         console.log("mouseLeave__true")
//     });
// });
*/

/* 
実験中（hover()ではなくmouseenter()とmouseleave()を用いて）
*/
// $('.js-menu__item__link, .submenu__item').hover(function() {
//     $("+.submenu",this).slideDown();
//     $(this).addClass("is-open");
//     $("not:(this)").removeClass("is-open");
//     console.log("slideDown__true");
// });

/* 
実験2　gmenu(.js-menu__item__linkと.submenuを包含する階層）に対し操作
    →実験成功！　採用！
*/
/*
$(function() {
    $('.gmenu__item').on("hover", function() {
        $('.submenu',this).slideDown();
        $('.js-menu__item__link',this).addClass("is-open");
        console.log("slideDown__true");
        return false;
    }, function() {
        $('.submenu',this).slideUp();
        $('.js-menu__item__link',this).removeClass("is-open");
        console.log("mouseLeave__true");
        return false;
    });
});

↑一度うまくいっていたものを.on()で書き直そうとしたが動かなくなった。
*/
/* 
hoverイベントは.on()内ではmouseenterとmouseleave別々で扱う必要がある
書き直し。問題なく動作。
最終的にメディアクエリに対応した処理の中に移動
window.matchMediaの下if文のelse内（sp,tb時の処理）
*/


/* 
parallax
*/
$(function() {
    const top = $('#top-head').offset().top;
    $(window).scroll(function() {
        const value = $(this).scrollTop();
        $('#front-bg').css('top', top );
        $('#mid-bg').css('top', top + value * 0.2);
    });
});



/* 
メディアクエリ対応
参考：https://qiita.com/shouchida/items/a077b0c5d2ebceef9d9d
ただし、matchMediaはIE9以下では使用できないため、
window.innerWidthプロパティの使用も検討のこと
以下一応正常に動作
*/
//変数mqlにMediaQueryListを格納
const mql = window.matchMedia('(min-width: 1407px)');

//メディアクエリに応じて実行したい処理を関数として定義
const handleMediaQuery = function(mql) {
    if (mql.matches) {
        //pc時の処理
        $('.gmenu').css('display', 'flex');
        $('.js-hamburger').removeClass('is-open');
        $('.gmenu__item').off("mouseenter");
        /* 
        ドロップダウン記述苦肉の策　できればCSSでやりたい
        */
        $('.gmenu__item').on({
            "mouseenter": function(){
                $(".submenu", this).slideDown();
                // $(".submenu", this).css({
                //     /* 
                //     Sassの変更がコンパイル時反映されなくなる問題が起きたため
                //     とりあえずこちらで指定しておく
                //     */
                //     'top':'82px',
                //     'left':'0',
                //     'position':'absolute',
                //     'display':'inline-block', 
                //     'flex-direction':'column',
                //     // 'background-color':'#fff'
                //     // 'align-items':'flex-start'
                // });
                //↓offsetでは相対位置指定ができない（というかめんどい）
                //かといってposition();だと取得しかできないので、Sassで普通に記述してみる。
                // $(".submenu", this).offset({left: 30});
                console.log("pc_mouseenter");
                return false;
            }, "mouseleave": function(){
                $(".submenu",this).slideUp();
                console.log("pc_mouseleave");
            }
        });
        console.log('pcサイズです');
    } else {
        //sp,tb時の処理
        $('.gmenu__item').on({
            "mouseenter": function(){
                $('.submenu',this).slideDown();
                $('.submenu',this).css({
                    'top':'0',
                    'position':'relative',
                    'display':'flex', 
                    'flex-direction':'column'
                });
                $('.js-menu__item__link',this).addClass("is-open");
                console.log("mouseenter__true");
                return false;
            }, "mouseleave": function(){
                $('.submenu',this).slideUp();
                $('.js-menu__item__link',this).removeClass("is-open");
                console.log("mouseleave__true");
                return false;
            }
        });
        $('.gmenu').css('display', 'none');
        console.log('tbかspです');
    };
};

//イベントリスナーを追加（メディアクエリの条件一致を監視）
/* 
非推奨のaddListenerが気持ち悪い。JS,jQuery復習のこと。
*/
mql.addListener(handleMediaQuery);

/*
初回チェックのため関数を一度実行
handleMediaQuery(mql);
*/
/* 
↑が部分的にしか稼働していなかったようなので
（console.log();のみ正常に実行される状態）
jQueryの.ready()イベント内で発火させたところ、
ロード時もサブメニュー開閉動作をしてくれるようになった。
*/
$(window).ready(function(){
    handleMediaQuery(mql);
})


/* 
実験　開閉サイズ変更挙動
*/
// const mql = window.matchMedia('(min-width: 1272px)');

// mql.addEventListener( "resize", (e) => {
//     if (e.matches) {
//     /* ビューポートが 1272 ピクセル幅以上 */
//     console.log('This is a narrow screen — less than 600px wide.')
//   } else {
//     /* ビューポートが 1272 ピクセル幅未満 */
//     console.log('This is a wide screen — more than 600px wide.')
//   }
// });


// const $win = $(window);

// $win.on('resize', function() {
//     const windowWidth = window.innerWidth;
//     const openForm = $('.gmenu .is-open')
//     if (windowWidth > 1272) {
//         //PCの処理
//         // $(".js-hamburger").removeClass("is-open");
//         // $(".gmenu").slideUp();
//         $('.gmenu').css('display', '');
//         console.log('pcサイズです');
//             return false;
//     } else {
//         //SPの処理
//         // $('.gmenu').css('display', 'block');
//         console.log('tbかspです');
//     }
// });


$(".gmenu__item").on("touchstart", function(){
    $('.submenu',this).slideDown();
    $('.submenu',this).css({'display':'flex', 'flex-direction':'column'});
    $('.js-menu__item__link',this).addClass("is-open");
    console.log("touchstart__true");
    return false;
});