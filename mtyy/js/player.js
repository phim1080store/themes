function replaceEpisodeSlug(newSlug){let currentUrl=window.location.href
let updatedUrl=currentUrl.replace(/\/tap-[^\/]+/,`/${newSlug}`)
window.location.href=updatedUrl}
function getNextPrevEpisode(isNext){episodeList=episodeList.filter((value,index,self)=>index===self.findIndex((e)=>e.slug===value.slug&&e.server===value.server&&e.movie_id===value.movie_id))
let index=episodeList.findIndex((e)=>e.slug===currentSlug)
if(index===-1)return null
let newIndex=isNext?index+1:index-1
if(!episodeList[newIndex])return null
let url=window.location.href
return url.substring(0,url.lastIndexOf('/'))+`/${episodeList[newIndex].slug}-${episodeList[newIndex].id}`}
function getAudioUrl(){const href=document.querySelector('li.on > a')?.getAttribute('href')
const slug=href?.replace(/-\d+$/,'-')
const movie_id=href?.split('/').filter(Boolean).pop().match(/\d+$/)?.[0]
const allLinks=Array.from(document.querySelectorAll('[id^="episode-"] a'))
const filteredLinks=allLinks.filter((a)=>{const dataId=a.getAttribute('href')
return dataId?.startsWith(slug)})
const activeLink=document.querySelector('li.on > a')
const activeHref=activeLink?.href
const activeEpisodeDiv=activeLink?.closest('div[id^="episode-"]')
const activeEpisodeId=activeEpisodeDiv?.id.replace('episode-','')||''
const activeDataIdText=document.querySelector(`a[data-id="${activeEpisodeId}"]`)?.textContent.trim()||''
const selectorFromServer=filteredLinks.map((a,index)=>{const episodeDiv=a.closest('div[id^="episode-"]')
const episodeId=episodeDiv?.id.replace('episode-','')||''
const dataIdText=document.querySelector(`a[data-id="${episodeId}"]`)?.textContent.trim()||''
return{html:dataIdText=='Vietsub'?'Tiếng gốc':dataIdText,value:index,href:a.href,default:a.href===activeHref,}})
return{movie_id,activeDataIdText,selectorFromServer}}
function playM3u8(video,url,art){if(Hls.isSupported()){if(art.hls)art.hls.destroy()
art.hls=new Hls({maxBufferLength:60,maxMaxBufferLength:120,maxBufferSize:150*1000*1000,maxBufferHole:0.5,backBufferLength:60,enableWorker:!0,lowLatencyMode:!1,})
art.hls.loadSource(url)
art.hls.attachMedia(video)
art.hls.on(Hls.Events.ERROR,function(e,data){if(data.fatal){switch(data.type){case Hls.ErrorTypes.NETWORK_ERROR:art.notice.show='Mất mạng, đang thử kết nối lại...'
art.hls.startLoad()
art.hls.recoverMediaError()
break
case Hls.ErrorTypes.MEDIA_ERROR:art.notice.show='Lỗi media, đang khôi phục...'
art.hls.recoverMediaError()
break
default:art.notice.show='Lỗi nghiêm trọng, dừng phát...'
art.hls.destroy()
break}}else if(data.type==Hls.ErrorTypes.NETWORK_ERROR){art.hls.startLoad()
art.hls.recoverMediaError()}})
art.on('destroy',()=>art.hls.destroy())}else if(video.canPlayType('application/vnd.apple.mpegurl')){video.src=url}else{art.notice.show='Unsupported playback format: m3u8'}}
function renderPlayer(type,link,id){if(type=='embed'){fetch('/phim/'+movie_slug+'/view')
document.getElementById('player-wrapper').innerHTML=`<iframe width="100%" height="100%" src="${link}" frameborder="0" scrolling="no" allowfullscreen="" allow='autoplay'></iframe>`}
if(type=='m3u8'){let timeoutId=null
let resumeKey='phim1080-playerposition-'+id
let nextSlug=getNextPrevEpisode(!0)
let autoData=getAudioUrl()
let noSleep=new NoSleep()
let language={vi:{'Video Info':'Thông tin video',Close:'Đóng','Video Load Failed':'Tải video thất bại',Volume:'Âm lượng',Play:'Phát',Pause:'Tạm dừng',Rate:'Tốc độ',Mute:'Tắt tiếng','Video Flip':'Lật video',Horizontal:'Ngang',Vertical:'Dọc',Reconnect:'Kết nối lại','Show Setting':'Cài đặt','Hide Setting':'Ẩn cài đặt',Screenshot:'Chụp màn hình','Play Speed':'Tốc độ phát','Aspect Ratio':'Tỷ lệ khung hình',Default:'Mặc định',Normal:'Bình thường',Open:'Mở','Switch Video':'Chuyển video','Switch Subtitle':'Chuyển phụ đề',Fullscreen:'Toàn màn hình','Exit Fullscreen':'Thoát toàn màn hình','Web Fullscreen':'Toàn màn hình trình duyệt','Exit Web Fullscreen':'Thoát toàn màn hình trình duyệt','Mini player':'Trình phát mini','PIP Mode':'Phát trong hình','Exit PIP Mode':'Thoát phát trong hình','PIP Not Supported':'Không hỗ trợ phát trong hình','Fullscreen Not Supported':'Không hỗ trợ toàn màn hình','Subtitle Offset':'Độ trễ phụ đề','Last Seen':'Lần xem cuối','Jump Play':'Nhảy đến đoạn phát',AirPlay:'AirPlay','AirPlay Not Available':'AirPlay không khả dụng',},}
let controls=[]
if(!Artplayer.utils.isMobile){controls=[{position:'left',name:'fast-rewind',index:11,html:'<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 32 32"><path fill="currentColor" d="M4 18A12 12 0 1 0 16 6h-4V1L6 7l6 6V8h4A10 10 0 1 1 6 18Z"></path><path fill="currentColor" d="M19.63 22.13a2.84 2.84 0 0 1-1.28-.27a2.44 2.44 0 0 1-.89-.77a3.6 3.6 0 0 1-.52-1.25a7.7 7.7 0 0 1-.17-1.68a8 8 0 0 1 .17-1.68a3.7 3.7 0 0 1 .52-1.25a2.44 2.44 0 0 1 .89-.77a2.84 2.84 0 0 1 1.28-.27a2.44 2.44 0 0 1 2.16 1a5.23 5.23 0 0 1 .7 2.93a5.23 5.23 0 0 1-.7 2.93a2.44 2.44 0 0 1-2.16 1.08m0-1.22a1.07 1.07 0 0 0 1-.55a3.4 3.4 0 0 0 .37-1.51v-1.38a3.3 3.3 0 0 0-.29-1.5a1.23 1.23 0 0 0-2.06 0a3.3 3.3 0 0 0-.29 1.5v1.38a3.4 3.4 0 0 0 .29 1.51a1.06 1.06 0 0 0 .98.55m-9 1.09v-1.18h2v-5.19l-1.86 1l-.55-1.06l2.32-1.3H14v6.5h1.78V22z"></path></svg>',tooltip:'10 giây trước',click:function(){window.player.seek=this.currentTime-10},},{position:'left',name:'fast-forward',index:12,html:'<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 32 32"><path fill="currentColor" d="M26 18A10 10 0 1 1 16 8h4v5l6-6l-6-6v5h-4a12 12 0 1 0 12 12Z"></path><path fill="currentColor" d="M19.63 22.13a2.84 2.84 0 0 1-1.28-.27a2.44 2.44 0 0 1-.89-.77a3.6 3.6 0 0 1-.52-1.25a7.7 7.7 0 0 1-.17-1.68a8 8 0 0 1 .17-1.68a3.7 3.7 0 0 1 .52-1.25a2.44 2.44 0 0 1 .89-.77a2.84 2.84 0 0 1 1.28-.27a2.44 2.44 0 0 1 2.16 1a5.23 5.23 0 0 1 .7 2.93a5.23 5.23 0 0 1-.7 2.93a2.44 2.44 0 0 1-2.16 1.08m0-1.22a1.07 1.07 0 0 0 1-.55a3.4 3.4 0 0 0 .37-1.51v-1.38a3.3 3.3 0 0 0-.29-1.5a1.23 1.23 0 0 0-2.06 0a3.3 3.3 0 0 0-.29 1.5v1.38a3.4 3.4 0 0 0 .29 1.51a1.06 1.06 0 0 0 .98.55m-9 1.09v-1.18h2v-5.19l-1.86 1l-.55-1.06l2.32-1.3H14v6.5h1.78V22z"></path></svg>',tooltip:'10 giây sau',click:function(){window.player.seek=this.currentTime+10},},]}
if(typeof nextSlug!=='undefined'&&nextSlug){controls.push({position:'right',name:'change-video',index:1,html:`<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path fill="#ffffff" d="m4.028 20.882a1 1 0 0 0 1.027-.05l12-8a1 1 0 0 0 0-1.664l-12-8a1 1 0 0 0 -1.555.832v16a1 1 0 0 0 .528.882zm1.472-15.013 9.2 6.131-9.2 6.131z"></path><path fill="#ffffff" d="m19.5 19a1 1 0 0 0 1-1v-12a1 1 0 0 0 -2 0v12a1 1 0 0 0 1 1z"></path></svg>`,tooltip:'Tập tiếp',click:function(){window.location.href=nextSlug},})}
let settings=[{name:'setting-playback-rate',html:'Tốc độ',tooltip:'Chuẩn',icon:`<svg width="24" height="24" viewBox="0 0 24 24"><path fill="#fff" d="M10 8v8l6-4zM6.3 5l-.6-.8C7.2 3 9 2.2 11 2l.1 1c-1.8.2-3.4.9-4.8 2M5 6.3l-.8-.6C3 7.2 2.2 9 2 11l1 .1c.2-1.8.9-3.4 2-4.8m0 11.4c-1.1-1.4-1.8-3.1-2-4.8L2 13c.2 2 1 3.8 2.2 5.4zm6.1 3.3c-1.8-.2-3.4-.9-4.8-2l-.6.8C7.2 21 9 21.8 11 22zM22 12c0-5.2-3.9-9.4-9-10l-.1 1c4.6.5 8.1 4.3 8.1 9s-3.5 8.5-8.1 9l.1 1c5.2-.5 9-4.8 9-10" style="--darkreader-inline-fill:#a8a6a4"></path></svg>`,selector:[{html:'0.25',value:0.25},{html:'0.5',value:0.5},{html:'0.75',value:0.75},{default:!0,html:'Chuẩn',value:1},{html:'1.25',value:1.25},{html:'1.5',value:1.5},{html:'1.75',value:1.75},{html:'2',value:2},],onSelect:function(item){this.video.playbackRate=item.value;return item.html},},{name:'setting-shutdown',html:'Hẹn giờ ngủ',width:250,tooltip:'Tắt',icon:`<svg height="24" viewBox="0 0 24 24" width="24"><path d="M16.67,4.31C19.3,5.92,21,8.83,21,12c0,4.96-4.04,9-9,9c-2.61,0-5.04-1.12-6.72-3.02C5.52,17.99,5.76,18,6,18 c6.07,0,11-4.93,11-11C17,6.08,16.89,5.18,16.67,4.31 M14.89,2.43C15.59,3.8,16,5.35,16,7c0,5.52-4.48,10-10,10 c-1,0-1.97-0.15-2.89-0.43C4.77,19.79,8.13,22,12,22c5.52,0,10-4.48,10-10C22,7.48,19,3.67,14.89,2.43L14.89,2.43z M12,6H6v1h4.5 L6,10.99v0.05V12h6v-1H7.5L12,7.01V6.98V6L12,6z" fill="#fff"></path></svg>`,selector:[{default:!0,html:'Tắt',value:0},{html:'5 phút',value:5},{html:'10 phút',value:10},{html:'15 phút',value:15},{html:'30 phút',value:30},],onSelect:function(item){clearTimeout(timeoutId)
if(item.value>0){timeoutId=setTimeout(()=>{window.player.pause()
document.querySelector('.art-setting-item[data-name="setting-shutdown"]')?.click()},item.value*60*1000)}
return item.html},},{name:'setting-audio',html:'Âm thanh',width:250,tooltip:autoData.activeDataIdText=='Vietsub'?'Tiếng gốc':autoData.activeDataIdText,icon:`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" height="18"><path fill="#fff" d="M256 80C149.9 80 62.4 159.4 49.6 262c9.4-3.8 19.6-6 30.4-6c26.5 0 48 21.5 48 48l0 128c0 26.5-21.5 48-48 48c-44.2 0-80-35.8-80-80l0-16 0-48 0-48C0 146.6 114.6 32 256 32s256 114.6 256 256l0 48 0 48 0 16c0 44.2-35.8 80-80 80c-26.5 0-48-21.5-48-48l0-128c0-26.5 21.5-48 48-48c10.8 0 21 2.1 30.4 6C449.6 159.4 362.1 80 256 80z"></path></svg>`,selector:autoData.selectorFromServer,onSelect:function(item){const selected=autoData.selectorFromServer.find((i)=>i.value===item.value)
if(selected&&selected.href){let position=localStorage.getItem('phim1080-playerposition-'+autoData.movie_id)
if(position){let movie_id=selected.href.split('/').filter(Boolean).pop().match(/\d+$/)?.[0]
localStorage.setItem('phim1080-playerposition-'+movie_id,position)}
window.location.href=selected.href}
return item.html},}]
let plugins=[artplayerPluginHlsControl({quality:{control:!1,setting:!0,title:'Chất lượng',auto:'Tự động',getName:({height:h})=>h>1440?'4K':h>1080?'2K':h>720?'1080P':h>480?'720P':h>360?'480P':'360P',},}),artplayerPluginChromecast({sdk:'https://www.gstatic.com/cv/js/sender/v1/cast_sender.js?loadCastFramework=1',}),]
if(!Artplayer.utils.isMobile){plugins.push(artplayerPluginAutoThumbnail({width:160,number:100,scale:1,}))}
let layers=[{html:`<div class="art-layer art-layer-pause" data-index="1" style="position: absolute; z-index: 0; top: 50%; left: 50%; transform: translate(-50%, -50%);"><div class="cs-mask opacity-70 cursor-pointer"><svg id="pause-icon" class="v-hidden" width="36" height="36" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M7 3a2 2 0 0 0-2 2v12a2 2 0 1 0 4 0V5a2 2 0 0 0-2-2m8 0a2 2 0 0 0-2 2v12a2 2 0 1 0 4 0V5a2 2 0 0 0-2-2"></path></svg><svg id="play-icon" width="36" height="36" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M17.982 9.275 8.06 3.27A2.013 2.013 0 0 0 5 4.994v12.011a2.017 2.017 0 0 0 3.06 1.725l9.922-6.005a2.017 2.017 0 0 0 0-3.45"></path></svg></div></div>`,disable:!1,click:function(){window.player.controls.timer=Date.now()
window.player.playing?window.player.pause():window.player.play()},},{html:`<div class="art-layer art-layer-seek-left" data-index="2" style="position: absolute; z-index: 0; top: 50%; left: 25%; transform: translate(-50%, -50%);"><div class="cs-mask v-hidden opacity-70 cursor-pointer"><svg xmlns="http://www.w3.org/2000/svg" width="36" height="36" viewBox="0 0 32 32"><path fill="currentColor" d="M4 18A12 12 0 1 0 16 6h-4V1L6 7l6 6V8h4A10 10 0 1 1 6 18Z"></path><path fill="currentColor" d="M19.63 22.13a2.84 2.84 0 0 1-1.28-.27a2.44 2.44 0 0 1-.89-.77a3.6 3.6 0 0 1-.52-1.25a7.7 7.7 0 0 1-.17-1.68a8 8 0 0 1 .17-1.68a3.7 3.7 0 0 1 .52-1.25a2.44 2.44 0 0 1 .89-.77a2.84 2.84 0 0 1 1.28-.27a2.44 2.44 0 0 1 2.16 1a5.23 5.23 0 0 1 .7 2.93a5.23 5.23 0 0 1-.7 2.93a2.44 2.44 0 0 1-2.16 1.08m0-1.22a1.07 1.07 0 0 0 1-.55a3.4 3.4 0 0 0 .37-1.51v-1.38a3.3 3.3 0 0 0-.29-1.5a1.23 1.23 0 0 0-2.06 0a3.3 3.3 0 0 0-.29 1.5v1.38a3.4 3.4 0 0 0 .29 1.51a1.06 1.06 0 0 0 .98.55m-9 1.09v-1.18h2v-5.19l-1.86 1l-.55-1.06l2.32-1.3H14v6.5h1.78V22z"></path></svg></div></div>`,disable:!Artplayer.utils.isMobile,click:function(){window.player.controls.timer=Date.now()
window.player.seek=this.currentTime-10},},{html:`<div class="art-layer art-layer-seek-right" data-index="3" style="position: absolute; z-index: 0; top: 50%; right: 25%; transform: translate(50%, -50%);"><div class="cs-mask v-hidden text-white opacity-70 cursor-pointer"><svg xmlns="http://www.w3.org/2000/svg" width="36" height="36" viewBox="0 0 32 32"><path fill="currentColor" d="M26 18A10 10 0 1 1 16 8h4v5l6-6l-6-6v5h-4a12 12 0 1 0 12 12Z"></path><path fill="currentColor" d="M19.63 22.13a2.84 2.84 0 0 1-1.28-.27a2.44 2.44 0 0 1-.89-.77a3.6 3.6 0 0 1-.52-1.25a7.7 7.7 0 0 1-.17-1.68a8 8 0 0 1 .17-1.68a3.7 3.7 0 0 1 .52-1.25a2.44 2.44 0 0 1 .89-.77a2.84 2.84 0 0 1 1.28-.27a2.44 2.44 0 0 1 2.16 1a5.23 5.23 0 0 1 .7 2.93a5.23 5.23 0 0 1-.7 2.93a2.44 2.44 0 0 1-2.16 1.08m0-1.22a1.07 1.07 0 0 0 1-.55a3.4 3.4 0 0 0 .37-1.51v-1.38a3.3 3.3 0 0 0-.29-1.5a1.23 1.23 0 0 0-2.06 0a3.3 3.3 0 0 0-.29 1.5v1.38a3.4 3.4 0 0 0 .29 1.51a1.06 1.06 0 0 0 .98.55m-9 1.09v-1.18h2v-5.19l-1.86 1l-.55-1.06l2.32-1.3H14v6.5h1.78V22z"></path></svg></div></div>`,disable:!Artplayer.utils.isMobile,click:function(){window.player.controls.timer=Date.now()
window.player.seek=this.currentTime+10},},]
window.player=new Artplayer({container:'#player-wrapper',url:link,poster:poster,autoplay:!1,autoSize:!1,preload:'auto',pip:document.pictureInPictureEnabled||!1,loop:!1,mutex:!0,setting:!0,flip:!1,lock:!0,gesture:!1,fastForward:!1,playbackRate:!1,aspectRatio:!1,theme:'#D32F2F',fullscreen:!0,fullscreenWeb:!Artplayer.utils.isMobile,autoOrientation:!0,airplay:!0,whitelist:['*'],lang:'vi',i18n:language,controls:controls,plugins:plugins,settings:settings,layers:layers,moreVideoAttr:{crossOrigin:'anonymous',},customType:{m3u8:playM3u8}})
let waitingTimeout=null
let isWaiting=!1
window.player.on('video:waiting',()=>{isWaiting=!0
clearTimeout(waitingTimeout)
waitingTimeout=setTimeout(()=>{if(isWaiting){window.player.notice.show='Sử dụng 1.1.1.1 để xem nếu thấy lag'}},5000)})
window.player.once('play',function(){fetch('/phim/'+movie_slug+'/view')})
window.player.on('loading',function(){document.getElementById('play-icon')?.classList.add('v-hidden')
document.getElementById('pause-icon')?.classList.add('v-hidden')})
window.player.on('pause',function(){isPaused=!0
noSleep.disable()
document.querySelectorAll('.cs-mask').forEach((el)=>el.classList.remove('v-hidden'))
document.getElementById('play-icon')?.classList.remove('v-hidden')
document.getElementById('pause-icon')?.classList.add('v-hidden')})
window.player.on('play',function(){isPaused=!1
noSleep.enable()
document.querySelectorAll('.cs-mask').forEach((el)=>el.classList.remove('v-hidden'))
document.getElementById('play-icon')?.classList.add('v-hidden')
document.getElementById('pause-icon')?.classList.remove('v-hidden')})
window.player.on('control',()=>{if(window.player.isLock){document.querySelectorAll('.cs-mask').forEach((el)=>el.classList.add('v-hidden'))}else{document.querySelectorAll('.cs-mask').forEach((el)=>el.classList.remove('v-hidden'))}})
window.player.on('lock',()=>{if(window.player.isLock){document.querySelectorAll('.cs-mask').forEach((el)=>el.classList.add('v-hidden'))}else{document.querySelectorAll('.cs-mask').forEach((el)=>el.classList.remove('v-hidden'))}})
window.player.on('video:playing',()=>{isWaiting=!1})
window.player.on('video:progress',()=>{if(!window.player.currentTime)return
localStorage.setItem(resumeKey,window.player.currentTime)})
window.player.on('video:ended',()=>{noSleep.disable()})
window.player.on('ready',()=>{var progress=parseFloat(localStorage.getItem(resumeKey))
if(isNaN(progress)){progress=0}
window.player.seek=progress
try{let histories=JSON.parse(localStorage['phim1080-histories']||'[]');(data.duration=window.player.duration),(histories=histories.filter((item)=>item.id!==data.id))
histories.unshift(data)
histories=histories.slice(0,28)
localStorage['phim1080-histories']=JSON.stringify(histories)}catch(error){console.log(error)
localStorage.removeItem('phim1080-histories')}})
const artVideoPlayer=document.querySelector('.art-video-player')
const csMasks=document.querySelectorAll('.cs-mask')
const playIcon=document.getElementById('play-icon')
const pauseIcon=document.getElementById('pause-icon')
new MutationObserver(function(mutationsList){mutationsList.forEach((mutation)=>{if(mutation.type==='attributes'&&mutation.attributeName==='class'){const classList=artVideoPlayer.classList
if(classList.contains('art-hide-cursor')){csMasks.forEach((el)=>el.classList.add('v-hidden'))}else if(!classList.contains('art-loading-show')){if(window.player.playing){playIcon.classList.add('v-hidden')
pauseIcon.classList.remove('v-hidden')}else{playIcon.classList.remove('v-hidden')
pauseIcon.classList.add('v-hidden')}}}})}).observe(artVideoPlayer,{attributes:!0})
new MutationObserver((mutationsList)=>{const artNoticeInner=document.querySelector('.art-notice-inner')
mutationsList.forEach((mutation)=>{if(mutation.type==='characterData'||mutation.type==='childList'){const text=artNoticeInner.textContent.trim()
if(text.includes('Error')||text.includes('Mất mạng, đang thử kết nối lại...')||text.includes('Lỗi media, đang khôi phục...')||text.includes('Lỗi nghiêm trọng, dừng phát...')){artNoticeInner.classList.remove('v-hidden')}else{artNoticeInner.classList.add('v-hidden')}}})}).observe(document.querySelector('.art-notice-inner'),{childList:!0,subtree:!0,characterData:!0,})}}
document.addEventListener('DOMContentLoaded',function(){if(!isBot()){let tokens=['5f7fbb2a8afb4b','1b6a79055dd6a8']
let randomToken=tokens[Math.floor(Math.random()*tokens.length)]
fetch(`https://ipinfo.io/json?token=${randomToken}`).then((response)=>response.json()).then((data)=>{let countries=['SG','HK','TW','CN','KR','TH','LA','KH','MM','MY','PH','JP']
let orgs=['viettel','vnpt','vinaphone','fpt','cmc','mobifone','sctv','netnam','viet nam','cloudflare']
let country=data.country?.toUpperCase()
let org=data.org?.toLowerCase()
if(countries.includes(country)||(country==='VN'&&orgs.some((o)=>org.includes(o)))){renderPlayer(server.type,server.link,server.id)}}).catch(()=>{axios.get('https://geolocation.onetrust.com/cookieconsentpub/v1/geo/location').then((response)=>{if(response.data.continent=='AS'){renderPlayer(server.type,server.link,server.id)}}).catch(()=>{renderPlayer(server.type,server.link,server.id)})})}})