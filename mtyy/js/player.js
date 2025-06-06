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
function renderPlayer(type,link,id){if(type=='embed'){fetch('/phim/'+movie_slug+'/view')
document.getElementById('player-wrapper').innerHTML=`<iframe width="100%" height="100%" src="${link}" frameborder="0" scrolling="no" allowfullscreen="" allow='autoplay'></iframe>`}
if(type=='m3u8'){let timeoutId=null
let resumeKey='phim1080-playerposition-'+id
let nextSlug=getNextPrevEpisode(!0)
let noSleep=new NoSleep();let language={vi:{'Video Info':'Thông tin video',Close:'Đóng','Video Load Failed':'Tải video thất bại',Volume:'Âm lượng',Play:'Phát',Pause:'Tạm dừng',Rate:'Tốc độ',Mute:'Tắt tiếng','Video Flip':'Lật video',Horizontal:'Ngang',Vertical:'Dọc',Reconnect:'Kết nối lại','Show Setting':'Cài đặt','Hide Setting':'Ẩn cài đặt',Screenshot:'Chụp màn hình','Play Speed':'Tốc độ phát','Aspect Ratio':'Tỷ lệ khung hình',Default:'Mặc định',Normal:'Bình thường',Open:'Mở','Switch Video':'Chuyển video','Switch Subtitle':'Chuyển phụ đề',Fullscreen:'Toàn màn hình','Exit Fullscreen':'Thoát toàn màn hình','Web Fullscreen':'Toàn màn hình trình duyệt','Exit Web Fullscreen':'Thoát toàn màn hình trình duyệt','Mini window.player':'Trình phát mini','PIP Mode':'Phát trong hình','Exit PIP Mode':'Thoát phát trong hình','PIP Not Supported':'Không hỗ trợ phát trong hình','Fullscreen Not Supported':'Không hỗ trợ toàn màn hình','Subtitle Offset':'Độ trễ phụ đề','Last Seen':'Lần xem cuối','Jump Play':'Nhảy đến đoạn phát',AirPlay:'AirPlay','AirPlay Not Available':'AirPlay không khả dụng',},}
let controls=[]
if(!Artplayer.utils.isMobile){controls=[{position:'left',name:'fast-rewind',index:11,html:'<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 32 32"><path fill="currentColor" d="M4 18A12 12 0 1 0 16 6h-4V1L6 7l6 6V8h4A10 10 0 1 1 6 18Z"></path><path fill="currentColor" d="M19.63 22.13a2.84 2.84 0 0 1-1.28-.27a2.44 2.44 0 0 1-.89-.77a3.6 3.6 0 0 1-.52-1.25a7.7 7.7 0 0 1-.17-1.68a8 8 0 0 1 .17-1.68a3.7 3.7 0 0 1 .52-1.25a2.44 2.44 0 0 1 .89-.77a2.84 2.84 0 0 1 1.28-.27a2.44 2.44 0 0 1 2.16 1a5.23 5.23 0 0 1 .7 2.93a5.23 5.23 0 0 1-.7 2.93a2.44 2.44 0 0 1-2.16 1.08m0-1.22a1.07 1.07 0 0 0 1-.55a3.4 3.4 0 0 0 .37-1.51v-1.38a3.3 3.3 0 0 0-.29-1.5a1.23 1.23 0 0 0-2.06 0a3.3 3.3 0 0 0-.29 1.5v1.38a3.4 3.4 0 0 0 .29 1.51a1.06 1.06 0 0 0 .98.55m-9 1.09v-1.18h2v-5.19l-1.86 1l-.55-1.06l2.32-1.3H14v6.5h1.78V22z"></path></svg>',tooltip:'10 giây trước',click:function(){window.player.seek=this.currentTime-10},},{position:'left',name:'fast-forward',index:12,html:'<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 32 32"><path fill="currentColor" d="M26 18A10 10 0 1 1 16 8h4v5l6-6l-6-6v5h-4a12 12 0 1 0 12 12Z"></path><path fill="currentColor" d="M19.63 22.13a2.84 2.84 0 0 1-1.28-.27a2.44 2.44 0 0 1-.89-.77a3.6 3.6 0 0 1-.52-1.25a7.7 7.7 0 0 1-.17-1.68a8 8 0 0 1 .17-1.68a3.7 3.7 0 0 1 .52-1.25a2.44 2.44 0 0 1 .89-.77a2.84 2.84 0 0 1 1.28-.27a2.44 2.44 0 0 1 2.16 1a5.23 5.23 0 0 1 .7 2.93a5.23 5.23 0 0 1-.7 2.93a2.44 2.44 0 0 1-2.16 1.08m0-1.22a1.07 1.07 0 0 0 1-.55a3.4 3.4 0 0 0 .37-1.51v-1.38a3.3 3.3 0 0 0-.29-1.5a1.23 1.23 0 0 0-2.06 0a3.3 3.3 0 0 0-.29 1.5v1.38a3.4 3.4 0 0 0 .29 1.51a1.06 1.06 0 0 0 .98.55m-9 1.09v-1.18h2v-5.19l-1.86 1l-.55-1.06l2.32-1.3H14v6.5h1.78V22z"></path></svg>',tooltip:'10 giây sau',click:function(){window.player.seek=this.currentTime+10},},]}
if(typeof nextSlug!=='undefined'&&nextSlug){controls.push({position:'right',name:'change-video',index:1,html:`<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path fill="#ffffff" d="m4.028 20.882a1 1 0 0 0 1.027-.05l12-8a1 1 0 0 0 0-1.664l-12-8a1 1 0 0 0 -1.555.832v16a1 1 0 0 0 .528.882zm1.472-15.013 9.2 6.131-9.2 6.131z"></path><path fill="#ffffff" d="m19.5 19a1 1 0 0 0 1-1v-12a1 1 0 0 0 -2 0v12a1 1 0 0 0 1 1z"></path></svg>`,tooltip:'Tập tiếp',click:function(){window.location.href=nextSlug},})}
let settings=[{name:'setting-shutdown',html:'Hẹn giờ ngủ',width:250,tooltip:'Tắt',icon:`<svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="black"><path d="M12 1a11 11 0 1 0 11 11A11.013 11.013 0 0 0 12 1zm0 20a9 9 0 1 1 9-9a9.01 9.01 0 0 1-9 9zm.5-13h-1v6l5.25 3.15l.5-.86l-4.75-2.79z"/></svg>`,selector:[{default:!0,html:'Tắt',value:0},{html:'5 phút',value:5},{html:'10 phút',value:10},{html:'15 phút',value:15},{html:'30 phút',value:30},],onSelect:function(item){clearTimeout(timeoutId)
if(item.value>0){timeoutId=setTimeout(()=>{window.player.pause()
document.querySelector('.art-setting-item[data-name="setting-shutdown"]')?.click()},item.value*60*1000)}
return item.html},},]
let plugins=[]
plugins.push(artplayerPluginHlsControl({quality:{control:!1,setting:!0,getName:(level)=>{const h=level.height
if(h>1440)return'4K'
if(h>1080)return'2K'
if(h>720)return'1080P'
if(h>480)return'720P'
if(h>360)return'480P'
return'360P'},title:'Chất lượng',auto:'Tự động',},audio:{control:!1,setting:!0,getName:(track)=>track.name,title:'Âm thanh',auto:'Tự động',},}))
if(!Artplayer.utils.isMobile){plugins.push(artplayerPluginAutoThumbnail({width:160,number:100,scale:1,}))}
if(Artplayer.utils.isMobile){settings.push({name:'setting-gesture',html:'Vuốt để tua',icon:`<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="24px" height="24px" viewBox="0 0 24 24" fill="white"><g stroke="none" stroke-width="1" fill="none" fill-rule="evenodd"><polygon points="0 0 24 0 24 24 0 24"/><rect fill="#FFFFFF" opacity="0.3" transform="translate(13.000000, 6.000000) rotate(-450.000000) translate(-13.000000, -6.000000)" x="12" y="8.8817842e-16" width="2" height="12" rx="1"/><path d="M9.79289322,3.79289322 C10.1834175,3.40236893 10.8165825,3.40236893 11.2071068,3.79289322 C11.5976311,4.18341751 11.5976311,4.81658249 11.2071068,5.20710678 L8.20710678,8.20710678 C7.81658249,8.59763107 7.18341751,8.59763107 6.79289322,8.20710678 L3.79289322,5.20710678 C3.40236893,4.81658249 3.40236893,4.18341751 3.79289322,3.79289322 C4.18341751,3.40236893 4.81658249,3.40236893 5.20710678,3.79289322 L7.5,6.08578644 L9.79289322,3.79289322 Z" fill="#FFFFFF" fill-rule="nonzero" transform="translate(7.500000, 6.000000) rotate(-270.000000) translate(-7.500000, -6.000000)"/><rect fill="#FFFFFF" opacity="0.3" transform="translate(11.000000, 18.000000) scale(1, -1) rotate(90.000000) translate(-11.000000, -18.000000)" x="10" y="12" width="2" height="12" rx="1"/><path d="M18.7928932,15.7928932 C19.1834175,15.4023689 19.8165825,15.4023689 20.2071068,15.7928932 C20.5976311,16.1834175 20.5976311,16.8165825 20.2071068,17.2071068 L17.2071068,20.2071068 C16.8165825,20.5976311 16.1834175,20.5976311 15.7928932,20.2071068 L12.7928932,17.2071068 C12.4023689,16.8165825 12.4023689,16.1834175 12.7928932,15.7928932 C13.1834175,15.4023689 13.8165825,15.4023689 14.2071068,15.7928932 L16.5,18.0857864 L18.7928932,15.7928932 Z" fill="#FFFFFF" fill-rule="nonzero" transform="translate(16.500000, 18.000000) scale(1, -1) rotate(270.000000) translate(-16.500000, -18.000000)"/></g></svg>`,tooltip:localStorage['phim1080-gesture']=='true'?'Bật':'Tắt',switch:localStorage['phim1080-gesture']=='true',onSwitch:function(item){item.tooltip=item.switch?'Tắt':'Bật'
localStorage['phim1080-gesture']=!item.switch
return!item.switch},})}
let layers=[{html:`<div class="art-layer art-layer-pause" data-index="1" style="position: absolute; z-index: 0; top: 50%; left: 50%; transform: translate(-50%, -50%);"><div class="cs-mask opacity-70 cursor-pointer"><svg id="pause-icon" class="v-hidden" width="36" height="36" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M7 3a2 2 0 0 0-2 2v12a2 2 0 1 0 4 0V5a2 2 0 0 0-2-2m8 0a2 2 0 0 0-2 2v12a2 2 0 1 0 4 0V5a2 2 0 0 0-2-2"></path></svg><svg id="play-icon" width="36" height="36" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M17.982 9.275 8.06 3.27A2.013 2.013 0 0 0 5 4.994v12.011a2.017 2.017 0 0 0 3.06 1.725l9.922-6.005a2.017 2.017 0 0 0 0-3.45"></path></svg></div></div>`,disable:!1,click:function(){window.player.controls.timer=Date.now()
if(window.player.playing){window.player.pause()}else{window.player.play()}},},{html:`<div class="art-layer art-layer-seek-left" data-index="2" style="position: absolute; z-index: 0; top: 50%; left: 25%; transform: translate(-50%, -50%);"><div class="cs-mask v-hidden opacity-70 cursor-pointer"><svg xmlns="http://www.w3.org/2000/svg" width="36" height="36" viewBox="0 0 32 32"><path fill="currentColor" d="M4 18A12 12 0 1 0 16 6h-4V1L6 7l6 6V8h4A10 10 0 1 1 6 18Z"></path><path fill="currentColor" d="M19.63 22.13a2.84 2.84 0 0 1-1.28-.27a2.44 2.44 0 0 1-.89-.77a3.6 3.6 0 0 1-.52-1.25a7.7 7.7 0 0 1-.17-1.68a8 8 0 0 1 .17-1.68a3.7 3.7 0 0 1 .52-1.25a2.44 2.44 0 0 1 .89-.77a2.84 2.84 0 0 1 1.28-.27a2.44 2.44 0 0 1 2.16 1a5.23 5.23 0 0 1 .7 2.93a5.23 5.23 0 0 1-.7 2.93a2.44 2.44 0 0 1-2.16 1.08m0-1.22a1.07 1.07 0 0 0 1-.55a3.4 3.4 0 0 0 .37-1.51v-1.38a3.3 3.3 0 0 0-.29-1.5a1.23 1.23 0 0 0-2.06 0a3.3 3.3 0 0 0-.29 1.5v1.38a3.4 3.4 0 0 0 .29 1.51a1.06 1.06 0 0 0 .98.55m-9 1.09v-1.18h2v-5.19l-1.86 1l-.55-1.06l2.32-1.3H14v6.5h1.78V22z"></path></svg></div></div>`,disable:!Artplayer.utils.isMobile,click:function(){window.player.controls.timer=Date.now()
window.player.seek=this.currentTime-10},},{html:`<div class="art-layer art-layer-seek-right" data-index="3" style="position: absolute; z-index: 0; top: 50%; right: 25%; transform: translate(50%, -50%);"><div class="cs-mask v-hidden text-white opacity-70 cursor-pointer"><svg xmlns="http://www.w3.org/2000/svg" width="36" height="36" viewBox="0 0 32 32"><path fill="currentColor" d="M26 18A10 10 0 1 1 16 8h4v5l6-6l-6-6v5h-4a12 12 0 1 0 12 12Z"></path><path fill="currentColor" d="M19.63 22.13a2.84 2.84 0 0 1-1.28-.27a2.44 2.44 0 0 1-.89-.77a3.6 3.6 0 0 1-.52-1.25a7.7 7.7 0 0 1-.17-1.68a8 8 0 0 1 .17-1.68a3.7 3.7 0 0 1 .52-1.25a2.44 2.44 0 0 1 .89-.77a2.84 2.84 0 0 1 1.28-.27a2.44 2.44 0 0 1 2.16 1a5.23 5.23 0 0 1 .7 2.93a5.23 5.23 0 0 1-.7 2.93a2.44 2.44 0 0 1-2.16 1.08m0-1.22a1.07 1.07 0 0 0 1-.55a3.4 3.4 0 0 0 .37-1.51v-1.38a3.3 3.3 0 0 0-.29-1.5a1.23 1.23 0 0 0-2.06 0a3.3 3.3 0 0 0-.29 1.5v1.38a3.4 3.4 0 0 0 .29 1.51a1.06 1.06 0 0 0 .98.55m-9 1.09v-1.18h2v-5.19l-1.86 1l-.55-1.06l2.32-1.3H14v6.5h1.78V22z"></path></svg></div></div>`,disable:!Artplayer.utils.isMobile,click:function(){window.player.controls.timer=Date.now()
window.player.seek=this.currentTime+10},},]
window.player=new Artplayer({container:'#player-wrapper',url:link,poster:poster,autoplay:!1,autoSize:!1,preload:'auto',pip:document.pictureInPictureEnabled||!1,loop:!1,mutex:!0,setting:!0,flip:!1,lock:!0,gesture:localStorage['phim1080-gesture']=='true',fastForward:!1,playbackRate:!0,aspectRatio:!1,theme:'#D32F2F',fullscreen:!0,fullscreenWeb:!Artplayer.utils.isMobile,autoOrientation:!0,airplay:!1,whitelist:['*'],lang:'vi',i18n:language,controls:controls,plugins:plugins,settings:settings,layers:layers,moreVideoAttr:{crossOrigin:'anonymous',},customType:{m3u8:function(video,url){if(Hls.isSupported()){if(window.player.hls)window.player.hls.destroy()
window.player.hls=new Hls({maxBufferLength:60,maxMaxBufferLength:120,maxBufferSize:150*1000*1000,maxBufferHole:0.5,backBufferLength:60,enableWorker:!0,lowLatencyMode:!1,})
window.player.hls.loadSource(url)
window.player.hls.attachMedia(video)
window.player.hls.on(Hls.Events.ERROR,function(event,data){if(data.fatal){switch(data.type){case Hls.ErrorTypes.NETWORK_ERROR:window.player.notice.show='Mất mạng, đang thử kết nối lại...'
window.player.hls.startLoad()
window.player.hls.recoverMediaError()
break
case Hls.ErrorTypes.MEDIA_ERROR:window.player.notice.show='Lỗi media, đang khôi phục...'
window.player.hls.recoverMediaError()
break
default:window.player.notice.show='Lỗi nghiêm trọng, dừng phát...'
window.player.hls.destroy()
break}}else if(data.type==Hls.ErrorTypes.NETWORK_ERROR){window.player.hls.startLoad()
window.player.hls.recoverMediaError()}})
window.player.on('destroy',()=>window.player.hls.destroy())}else if(video.canPlayType('application/vnd.apple.mpegurl')){video.src=url}else{window.player.notice.show='Unsupported playback format: m3u8'}},},})
let waitingTimeout=null
let isWaiting=!1
window.player.on('video:waiting',()=>{isWaiting=!0
clearTimeout(waitingTimeout)
waitingTimeout=setTimeout(()=>{if(isWaiting){window.player.notice.show='Sử dụng 1.1.1.1 để xem nếu thấy lag'}},5000)})
window.player.once('play',function(){fetch('/phim/'+movie_slug+'/view')})
window.player.on('loading',function(){document.getElementById('play-icon')?.classList.add('v-hidden')
document.getElementById('pause-icon')?.classList.add('v-hidden')})
window.player.on('pause',function(){isPaused=!0
noSleep.disable();document.querySelectorAll('.cs-mask').forEach((el)=>el.classList.remove('v-hidden'))
document.getElementById('play-icon')?.classList.remove('v-hidden')
document.getElementById('pause-icon')?.classList.add('v-hidden')})
window.player.on('play',function(){isPaused=!1
noSleep.enable();document.querySelectorAll('.cs-mask').forEach((el)=>el.classList.remove('v-hidden'))
document.getElementById('play-icon')?.classList.add('v-hidden')
document.getElementById('pause-icon')?.classList.remove('v-hidden')})
window.player.on('control',()=>{if(window.player.isLock){document.querySelectorAll('.cs-mask').forEach((el)=>el.classList.add('v-hidden'))}else{document.querySelectorAll('.cs-mask').forEach((el)=>el.classList.remove('v-hidden'))}})
window.player.on('lock',()=>{if(window.player.isLock){document.querySelectorAll('.cs-mask').forEach((el)=>el.classList.add('v-hidden'))}else{document.querySelectorAll('.cs-mask').forEach((el)=>el.classList.remove('v-hidden'))}})
window.player.on('video:playing',()=>{isWaiting=!1})
window.player.on('video:progress',()=>{if(!window.player.currentTime)return
localStorage.setItem(resumeKey,window.player.currentTime)})
window.player.on('video:ended',(e)=>{noSleep.disable()});window.player.on('ready',()=>{var progress=parseFloat(localStorage.getItem(resumeKey))
if(isNaN(progress)){progress=0}
window.player.seek=progress
try{let histories=JSON.parse(localStorage['phim1080-histories']||'[]');(data.duration=window.player.duration),(histories=histories.filter((item)=>item.id!==data.id))
histories.unshift(data)
histories=histories.slice(0,28)
localStorage['phim1080-histories']=JSON.stringify(histories)}catch(error){console.log(error)
localStorage.removeItem('phim1080-histories')}})
const artVideoPlayer=document.querySelector('.art-video-player');const csMasks=document.querySelectorAll('.cs-mask');const playIcon=document.getElementById('play-icon');const pauseIcon=document.getElementById('pause-icon');new MutationObserver(function(mutationsList){mutationsList.forEach(mutation=>{if(mutation.type==='attributes'&&mutation.attributeName==='class'){const classList=artVideoPlayer.classList;if(classList.contains('art-hide-cursor')){csMasks.forEach(el=>el.classList.add('v-hidden'))}else if(!classList.contains('art-loading-show')){if(window.player.playing){playIcon.classList.add('v-hidden');pauseIcon.classList.remove('v-hidden')}else{playIcon.classList.remove('v-hidden');pauseIcon.classList.add('v-hidden')}}}})}).observe(artVideoPlayer,{attributes:!0});if(localStorage['phim1080-gesture']==='true'&&Artplayer.utils.isMobile){const container=window.player.template.$container;container.addEventListener('touchmove',()=>{const artVideoPlayer=document.querySelector('.art-video-player');if(!artVideoPlayer.classList.contains('art-control-show')){artVideoPlayer.classList.add('art-mini-progress-bar')}});container.addEventListener('touchend',()=>{document.querySelector('.art-video-player').classList.remove('art-mini-progress-bar')})}
new MutationObserver(mutationsList=>{const artNoticeInner=document.querySelector('.art-notice-inner');mutationsList.forEach(mutation=>{if(mutation.type==='characterData'||mutation.type==='childList'){const text=artNoticeInner.textContent.trim();if(text.includes('Mất mạng, đang thử kết nối lại...')||text.includes('Lỗi media, đang khôi phục...')||text.includes('Lỗi nghiêm trọng, dừng phát...')){artNoticeInner.classList.remove('v-hidden')}else{artNoticeInner.classList.add('v-hidden')}}})}).observe(document.querySelector('.art-notice-inner'),{childList:!0,subtree:!0,characterData:!0})}}
document.addEventListener('DOMContentLoaded',function(){if(!isBot()){let tokens=['5f7fbb2a8afb4b','1b6a79055dd6a8']
let randomToken=tokens[Math.floor(Math.random()*tokens.length)]
fetch(`https://ipinfo.io/json?token=${randomToken}`).then((response)=>response.json()).then((data)=>{let countries=['SG','HK','TW','CN','KR','TH','LA','KH','MM','MY','PH','JP']
let orgs=['viettel','vnpt','vinaphone','fpt','cmc','mobifone','sctv','netnam','viet nam','cloudflare']
let country=data.country?.toUpperCase()
let org=data.org?.toLowerCase()
if(countries.includes(country)||(country==='VN'&&orgs.some((o)=>org.includes(o)))){renderPlayer(server.type,server.link,server.id)}}).catch(()=>{axios.get('https://geolocation.onetrust.com/cookieconsentpub/v1/geo/location').then((response)=>{if(response.data.continent=='AS'){renderPlayer(server.type,server.link,server.id)}}).catch(()=>{renderPlayer(server.type,server.link,server.id)})})}})