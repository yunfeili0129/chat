/**
 * ConsultDialoge.html 页面js
 * 聊天页面 js  2017-4-17 lee_dx
 *
 */
//此页面的全局变量  要尽量避免和global.js、cache.js的全局冲突
var msgTypes; //消息类型
var dengdai; //ajax  打开等待 关闭等待的
var ui; //ui对象，容器
var record = [];
var self;
var pageNum = 1;
var iconsview_height = 200; //初始化设定 表情包界面高度  单位 px
(function(mui, doc) {
	var MIN_SOUND_TIME = 800;
	mui.init({
             gestureConfig: {
             tap: true, //默认为true
             doubletap: true, //默认为false
             longtap: true, //默认为false
             swipe: true, //默认为true
             drag: true, //默认为true
             hold: true, //默认为false，不监听
             release: true //默认为false，不监听
             },
             beforeback: function() {
             return true;
             }
             });
	template.config('escape', false);
	mui.plusReady(function() {
                  try {
                  self = plus.webview.currentWebview();
                  var wheight = doc.body.clientHeight;
                  self.setStyle({
                                softinputMode: "adjustResize"
                                });
                  ui = {
                  header: doc.querySelector('header'),
                  body: doc.querySelector('body'),
                  footer: doc.querySelector('footer'),
                  iconsview: doc.querySelector('.mui-content-padded'),
                  footerRight1: doc.querySelector('.footer-right1'),
                  footerRight2: doc.querySelector('.footer-right2'),
                  footerRight3: doc.querySelector('.footer-right3'),
                  footerLeft: doc.querySelector('.footer-left'),
                  btnMsgType: doc.querySelector('#msg-type'),
                  btnCommon: doc.querySelector('#common'),
                  boxMsgText: doc.querySelector('#msg-text'),
                  boxMsgSound: doc.querySelector('#msg-sound'),
                  btnMsgXiaolian: doc.querySelector('#msg-xiaolian'),
                  btnMsgPlus: doc.querySelector('#msg-plus'),
                  areaMsgList: doc.querySelector('#msg-list'),
                  boxSoundAlert: doc.querySelector('#sound-alert'),
                  h: doc.querySelector('#h'),
                  content: doc.querySelector('.mui-content')
                  };
                  ui.h.style.width = ui.boxMsgText.offsetWidth + 'px';
                  //alert(ui.boxMsgText.offsetWidth );
                  var footerPadding = ui.footer.offsetHeight - ui.boxMsgText.offsetHeight;
                  window.addEventListener('resize', function() {
                                          ui.areaMsgList.scrollTop = ui.areaMsgList.scrollHeight + ui.areaMsgList.offsetHeight;
                                          }, false);
                  //恢复聊天窗口的历史消息列表
                  //hisTory();
                  
                  function msgTextFocus() {
                  ui.boxMsgText.focus();
                  setTimeout(function() {
                             ui.boxMsgText.focus();
                             }, 150);
                  }
                  //分页上拉事件//
                  var curBufferscrollTop = 0;
                  ui.areaMsgList.addEventListener('scroll', function(event) {
                                                  if(ui.areaMsgList.scrollTop < 0) {
                                                  curBufferscrollTop = ui.areaMsgList.scrollTop;
                                                  } else if(ui.areaMsgList.scrollTop == 0) {
                                                  if(curBufferscrollTop < 0) {
                                                  //var dengdai=plus.nativeUI.showWaiting();
                                                  pageNum = pageNum + 1;
                                                  //从本地数据库缓存里拿更早的消息数据
                                                  console.log("到顶了，触发事件 ！");
                                                  
                                                  curBufferscrollTop = 0;
                                                  }
                                                  }
                                                  }, false);
                  //分页上拉事件结束//
                  //点击常见问题事件//
                  ui.btnCommon.addEventListener('tap',function(event){
                                                
                                 XL.jump('CommonQuestion.html', 'CommonQuestion.html', {}, false, false);
                                                
                                                });
                  //点击麦克风事件//
                  ui.footerLeft.addEventListener('tap', function(event) {
                                                 
                                                 if(ui.btnMsgType.classList.contains('icon-maikefeng')) {
                                                 ui.btnMsgType.classList.add('icon-jianpan');
                                                 ui.btnMsgType.classList.remove('icon-maikefeng');
                                                 ui.boxMsgText.blur();
                                                 do_msgTextblur();
                                                 document.body.focus();
                                                 
                                                 ui.boxMsgText.style.display = 'none';
                                                 ui.boxMsgSound.style.display = 'block';
                                                 } else if(ui.btnMsgType.classList.contains('icon-jianpan')) {
                                                 ui.btnMsgType.classList.add('icon-maikefeng');
                                                 ui.btnMsgType.classList.remove('icon-jianpan');
                                                 ui.boxMsgSound.style.display = 'none';
                                                 ui.boxMsgText.style.display = 'block';
                                                 
                                                 msgTextFocus();
                                                 
                                                 }
                                                 
                                                 }, false);
                  //end//
                  //点击➕号事件
                  ui.btnMsgPlus.addEventListener('touchstart', function(event) {
                                                 
                                                 //mui.toast("footerRight2_touchstart!");
                                                 
                                                 if(ui.btnMsgPlus.classList.contains('mui-icon-paperplane') && ui.btnMsgXiaolian.classList.contains("icon-xiaolian")) {
                                                 ui.boxMsgText.removeEventListener('focus', do_msgTextfocus, false);
                                                 ui.boxMsgText.removeEventListener('blur', do_msgTextblur, false);
                                                 ui.boxMsgText.addEventListener('blur', msgTextFocus, false);
                                                 msgTextFocus();
                                                 event.preventDefault();
                                                 }
                                                 });
                  //end//
                  ui.btnMsgPlus.addEventListener('touchmove', function(event) {
                                                 
                                                 if(ui.btnMsgPlus.classList.contains('mui-icon-paperplane') && ui.btnMsgXiaolian.classList.contains("icon-xiaolian")) {
                                                 msgTextFocus();
                                                 event.preventDefault();
                                                 }
                                                 });
                  ui.btnMsgPlus.addEventListener('release', function(event) {
                                                 //mui.toast("footerRight2_tap!");
                                                 if(ui.btnMsgPlus.classList.contains('mui-icon-paperplane')) {
                                                 ui.boxMsgText.blur();
                                                 msgTextFocus();
                                                 ui.boxMsgText.addEventListener('blur', do_msgTextblur, false);
                                                 ui.boxMsgText.addEventListener('focus', do_msgTextfocus, false);
                                                 ui.boxMsgText.removeEventListener('blur', msgTextFocus, false);
                                                 send_dataFn('text', ui.boxMsgText.value.replace(new RegExp('\n', 'gm'), '<br/>'),'');
                                                 
                                                 } else {
                                                 
                                                 var btnArray = [{
                                                                 title: "拍照"
                                                                 }, {
                                                                 title: "从相册选择"
                                                                 }];
                                                 plus.nativeUI.actionSheet({
                                                                           title: "选择照片",
                                                                           cancel: "取消",
                                                                           buttons: btnArray
                                                                           }, function(e) {
                                                                           var index = e.index;
                                                                           switch(index) {
                                                                           case 0:
                                                                           break;
                                                                           case 1:
                                                                           var cmr = plus.camera.getCamera();
                                                                           cmr.captureImage(function(path) {
                                                                                            var guuid = plus.MSGS.getMsgID(1);
                                                                                            var paths = "file://" + plus.io.convertLocalFileSystemURL(path);
                                                                                            //fnPrintUpload(paths, guuid, ".png", 'image', send_dataFn);
                                                                                            }, function(err) {});
                                                                           break;
                                                                           case 2:
                                                                           plus.gallery.pick(function(path) {
                                                                                             var guuid = plus.MSGS.getMsgID(1);
                                                                                             //fnPrintUpload(path, guuid, ".png", 'image', send_dataFn);
                                                                                             }, function(err) {}, null);
                                                                           break;
                                                                           }
                                                                           });
                                                 }
                                                 }, false);
                  var setSoundAlertVisable = function(show) {
                  if(show) {
                  ui.boxSoundAlert.style.display = 'block';
                  ui.boxSoundAlert.style.opacity = 1;
                  } else {
                  ui.boxSoundAlert.style.opacity = 0;
                  
                  //fadeOut 完成再真正隐藏
                  setTimeout(function() {
                             ui.boxSoundAlert.style.display = 'none';
                             }, 200);
                  }
                  };
                  var recordCancel = false;
                  var recorder = null;
                  var audio_tips = document.getElementById("audio_tips");
                  var startTimestamp = null;
                  var stopTimestamp = null;
                  var stopTimer = null;
                  ui.boxMsgSound.addEventListener('hold', function(event) {
                                                  recordCancel = false;
                                                  if(stopTimer) clearTimeout(stopTimer);
                                                  audio_tips.innerHTML = "手指上划，取消发送";
                                                  ui.boxSoundAlert.classList.remove('rprogress-sigh');
                                                  setSoundAlertVisable(true);
                                                  recorder = plus.audio.getRecorder();
                                                  if(recorder == null) {
                                                  plus.nativeUI.toast("不能获取录音对象");
                                                  return;
                                                  }
                                                  startTimestamp = (new Date()).getTime();
                                                  recorder.record({
                                                                  filename: "_doc/audio/",
                                                                  format: "amr"
                                                                  }, function(path) {
                                                                  if(recordCancel) return;
                                                                  var guuid = plus.MSGS.getMsgID(1);
                                                                  //fnPrintUpload(path, guuid, ".amr", 'sound', send_dataFn);
                                                                  }, function(e) {
                                                                  plus.nativeUI.toast("录音时出现异常: " + e.message);
                                                                  });
                                                  }, false);
                  ui.body.addEventListener('drag', function(event) {
                                           //console.log('drag');
                                           if(Math.abs(event.detail.deltaY) > 50) {
                                           if(!recordCancel) {
                                           recordCancel = true;
                                           if(!audio_tips.classList.contains("cancel")) {
                                           audio_tips.classList.add("cancel");
                                           }
                                           audio_tips.innerHTML = "松开手指，取消发送";
                                           }
                                           } else {
                                           if(recordCancel) {
                                           recordCancel = false;
                                           if(audio_tips.classList.contains("cancel")) {
                                           audio_tips.classList.remove("cancel");
                                           }
                                           audio_tips.innerHTML = "手指上划，取消发送";
                                           }
                                           }
                                           }, false);
                  ui.boxMsgSound.addEventListener('release', function(event) {
                                                  //console.log('release');
                                                  if(audio_tips.classList.contains("cancel")) {
                                                  audio_tips.classList.remove("cancel");
                                                  audio_tips.innerHTML = "手指上划，取消发送";
                                                  }
                                                  //
                                                  stopTimestamp = (new Date()).getTime();
                                                  if(stopTimestamp - startTimestamp < MIN_SOUND_TIME) {
                                                  audio_tips.innerHTML = "录音时间太短";
                                                  ui.boxSoundAlert.classList.add('rprogress-sigh');
                                                  recordCancel = true;
                                                  stopTimer = setTimeout(function() {
                                                                         setSoundAlertVisable(false);
                                                                         }, 800);
                                                  } else {
                                                  setSoundAlertVisable(false);
                                                  }
                                                  recorder.stop();
                                                  }, false);
                  ui.boxMsgSound.addEventListener("touchstart", function(e) {
                                                  //console.log("start....");
                                                  e.preventDefault();
                                                  });
                  ui.boxMsgText.addEventListener('input', function(event) {
                                                 setTimeout(function() {
                                                            ui.btnMsgPlus.classList[ui.boxMsgText.value == '' ? 'remove' : 'add']('mui-icon-paperplane');
                                                            ui.btnMsgPlus.setAttribute("for", ui.boxMsgText.value == '' ? '' : 'msg-text');
                                                            ui.h.innerText = ui.boxMsgText.value.replace(new RegExp('\n', 'gm'), '\n-') || '-';
                                                            ui.footer.style.height = (ui.h.offsetHeight + footerPadding) + 'px';
                                                            ui.content.style.paddingBottom = ui.footer.style.height;
                                                            }, 150);
                                                 });
                  
                  function do_msgTextfocus(event) {
                  ui.btnMsgXiaolian.classList.remove('icon-jianpan');
                  ui.btnMsgXiaolian.classList.add('icon-xiaolian');
                  ui.iconsview.style.height = '0px';
                  ui.footer.style.bottom = '0px';
                  ui.areaMsgList.style.bottom = footer_clientHeight + 'px';
                  }
                  
                  function do_msgTextblur(event) {
                  ui.btnMsgXiaolian.classList.remove('icon-jianpan');
                  ui.btnMsgXiaolian.classList.add('icon-xiaolian');
                  ui.iconsview.style.height = '0px';
                  ui.footer.style.bottom = '0px';
                  ui.areaMsgList.style.bottom = footer_clientHeight + 'px';
                  //ui.areaMsgList.scrollTop = ui.areaMsgList.scrollHeight + ui.areaMsgList.offsetHeight;
                  // mui.toast("boxMsgText_blur！");
                  }
                  ui.boxMsgText.addEventListener('focus', do_msgTextfocus, false);
                  ui.boxMsgText.addEventListener('blur', do_msgTextblur, false);
                 
                  ui.footerRight1.addEventListener('tap', function(event) {
                                                   // mui.toast(ui.btnMsgXiaolian.classList);
                                                   if(ui.btnMsgXiaolian.classList.contains("icon-xiaolian")) {
                                                   ui.boxMsgText.removeEventListener('blur', do_msgTextblur, false);
                                                   ui.boxMsgText.blur();
                                                   ui.boxMsgText.addEventListener('blur', do_msgTextblur, false);
                                                   setTimeout(function() {
                                                              ui.btnMsgXiaolian.classList.add('icon-jianpan');
                                                              ui.btnMsgXiaolian.classList.remove('icon-xiaolian');
                                                              ui.iconsview.style.height = iconsview_height + 'px';
                                                              ui.footer.style.bottom = iconsview_height + 'px';
                                                              ui.areaMsgList.style.bottom = (footer_clientHeight + iconsview_height) + 'px';
                                                              ui.areaMsgList.scrollTop = ui.areaMsgList.scrollHeight + ui.areaMsgList.offsetHeight;
                                                              ui.btnMsgType.classList.add('icon-maikefeng');
                                                              ui.btnMsgType.classList.remove('icon-jianpan');
                                                              ui.boxMsgSound.style.display = 'none';
                                                              ui.boxMsgText.style.display = 'block';
                                                              }, 200);
                                                   //msgTextFocus();
                                                   } else if(ui.btnMsgXiaolian.classList.contains("icon-jianpan")) {
                                                   
                                                       msgTextFocus();
                                                   
                                                   }
                                                    //mui.toast("点击笑脸！"+ui.btnMsgXiaolian.classList);
                                                   }, false);
                  ui.areaMsgList.addEventListener('click', function(event) {
                                                  // mui.toast("areaMsgList_click！"+boxMsgText_focus);
                                                  ui.boxMsgText.blur();
                                                  do_msgTextblur();
                                                  
                                                  });
                  document.getElementsByTagName('footer')[0].className = "footer-visible";
                  ui.areaMsgList.style.top = ui.header.clientHeight + 'px';
                  ui.areaMsgList.style.bottom = ui.footer.clientHeight + 'px';
                  var footer_clientHeight = ui.footer.clientHeight;
                  /*-----------------------  表情包选择区域     start ---------------*/
                  var defaults = {
                  id: 'emoticon', //图标列表渲染位置
                  path: 'arclist/', //表情存放的路径
                  tip: 'em_'
                  };
                  var option = $.extend(defaults, null);
                  var id = option.id;
                  var path = option.path;
                  var tip = option.tip;
                  var strFace, labFace;
                  strFace = '';
                  for(var i = 1; i <= 50; i++) {
                  labFace = '[' + tip + i + ']';
                  strFace += '<span labFace ="' + labFace + '" ><img src="' + path + i + '.gif"   /></span>';
                  }
                  strFace += '';
                  $("#" + id).html(strFace);
                  mui(".mui-content-padded").on("tap", "span", function() {
                                                //alert('11111');
                                                var span = this;
                                                //alert(span);
                                                var labFace = span.attributes["labFace"].value;
                                                //var labFace=replace_em(labFace);
                                                icon_insertAtCaret(labFace);
                                                });
                  /*-----------------------  表情包选择区域     end ---------------*/
                  } catch(error) {
                  alert("mui.plusReady error=" + error.message);
                  }
                  });
 }(mui, document));
var imageViewer = new mui.ImageViewer('.msg-content-image', {
                                      dbl: false
                                      });
var bindMsgList = function() {
    ui.areaMsgList.innerHTML = template('msg-template', {
                                        "record": record
                                        });
    var msgItems = ui.areaMsgList.querySelectorAll('.msg-item');
    [].forEach.call(msgItems, function(item, index) {
                    item.addEventListener('tap', function(event) {
                                          msgItemTap(item, event);
                                          }, false);
                    });
    imageViewer.findAllImage();
    ui.areaMsgList.scrollTop = ui.areaMsgList.scrollHeight + ui.areaMsgList.offsetHeight;
};
var msgItemTap = function(msgItem, event) {
    var msgType = msgItem.getAttribute('msg-type');
    var msgContent = msgItem.getAttribute('msg-content');
    //alert(msgContent);
    if(msgType == 'sound') {
        player = plus.audio.createPlayer(msgContent);
        var playState = msgItem.querySelector('.play-state');
        player.setRoute(plus.audio.ROUTE_SPEAKER); //扬声器输出
        playState.innerText = '正在播放...';
        player.play(function() {
                    playState.innerText = '点击播放';
                    }, function(e) {
                    playState.innerText = '点击播放';
                    });
    }
};

function icon_insertAtCaret(labFace) {
    $('#msg-text').setCaret();
    $('#msg-text').insertAtCaret(labFace);
    ui.btnMsgPlus.classList[ui.boxMsgText.value == '' ? 'remove' : 'add']('mui-icon-paperplane');
    ui.btnMsgPlus.setAttribute("for", ui.boxMsgText.value == '' ? '' : 'msg-text');
    ui.h.innerText = ui.boxMsgText.value.replace(new RegExp('\n', 'gm'), '\n-') || '-';
    var footerPadding = ui.footer.offsetHeight - ui.boxMsgText.offsetHeight;
    ui.footer.style.height = (ui.h.offsetHeight + footerPadding) + 'px';
    ui.content.style.paddingBottom = ui.footer.style.height;
};
