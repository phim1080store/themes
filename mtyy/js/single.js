document.addEventListener('DOMContentLoaded',function(){let d=document,s=d.createElement('script')
s.src='https://https-phim1080-store.disqus.com/embed.js'
s.setAttribute('data-timestamp',+new Date());(d.head||d.body).appendChild(s)
requestAnimationFrame(()=>{new Swiper('.actor-roll',{slidesPerView:4,slidesPerGroup:4,spaceBetween:6,grid:{rows:2,fill:'row',},breakpoints:{1692:{slidesPerView:9,slidesPerGroup:9,spaceBetween:15},1330:{slidesPerView:9,slidesPerGroup:9,spaceBetween:15},993:{slidesPerView:7,slidesPerGroup:7,spaceBetween:10},560:{slidesPerView:5,slidesPerGroup:5,spaceBetween:5},},a11y:{enabled:!1,},})})
document.querySelectorAll('.select-list').forEach(function(el){el.addEventListener('click',function(e){e.preventDefault()
const serverId=el.dataset.id
document.querySelectorAll('.list-content').forEach((div)=>div.classList.add('none'))
document.getElementById('div-'+serverId).classList.remove('none')
document.querySelectorAll('.select-list').forEach((btn)=>btn.classList.remove('active'))
el.classList.add('active')})})
document.querySelectorAll('.vod-playerUrl').forEach(function(el){el.addEventListener('click',function(e){e.preventDefault()
const serverId=el.dataset.id
document.querySelectorAll('.server-content').forEach((div)=>div.classList.add('none'))
document.getElementById('episode-'+serverId).classList.remove('none')
document.querySelectorAll('.vod-playerUrl').forEach((btn)=>btn.classList.remove('active'))
el.classList.add('active')})})
let histories=JSON.parse(localStorage.getItem('phim1080-histories')||'[]')
let response=histories.find((item)=>item.id==data.id)
if(response?.href){const btn=document.querySelector('.vod-detail-bnt')
if(btn){btn.innerHTML='<svg width="24" height="24" viewBox="0 0 22 22" fill="white" xmlns="http://www.w3.org/2000/svg"><path d="M17.982 9.275 8.06 3.27A2.013 2.013 0 0 0 5 4.994v12.011a2.017 2.017 0 0 0 3.06 1.725l9.922-6.005a2.017 2.017 0 0 0 0-3.45"></path></svg> Xem tiếp'
btn.setAttribute('href',response.href)}
if(data.type==='series'){let activeLink=document.querySelector('.player-list-box a[href="'+response.href+'"]')
if(activeLink){document.querySelectorAll('.vod-playerUrl').forEach((el)=>{el.classList.remove('active')})
document.querySelectorAll('[id^="episode-"]').forEach((el)=>{el.classList.add('none')})
const nearestLi=activeLink.closest('li')
if(nearestLi)nearestLi.classList.add('on')
let activeEpisodeDiv=activeLink?.closest('div[id^="episode-"]')
let activeEpisodeId=activeEpisodeDiv?.id.replace('episode-','')||''
document.querySelector(`button[data-id="${activeEpisodeId}"]`)?.classList.add('active')
document.querySelector(`#episode-${activeEpisodeId}`)?.classList.remove('none')
const dataId=activeLink.getAttribute('data-id')
if(dataId){const serverLink=document.querySelector(`.anthology-tab a[data-id="${dataId}"]`)
if(serverLink)serverLink.classList.add('active')}}}}
let desc=document.querySelector('.banner-content__desc')
let button=document.querySelector('.intl-album-more-btn')
if(desc&&button){if(desc.scrollHeight<=desc.clientHeight){button.style.display='none'}else{button.style.display='flex'}
button.addEventListener('click',function(){if(desc.classList.contains('line-clamp-3')){desc.classList.remove('line-clamp-3')
button.innerHTML='Ẩn bớt<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-chevron-up-icon lucide-chevron-up"><path d="m18 15-6-6-6 6"/></svg>'}else{desc.classList.add('line-clamp-3')
button.innerHTML='Hiển thị thêm<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-chevron-down-icon lucide-chevron-down"><path d="m6 9 6 6 6-6"/></svg>'}})}
document.querySelector('#share-btn')?.addEventListener('click',function(e){e.preventDefault()
let url=window.location.href
let title=document.title
if(navigator.share){navigator.share({title:title,url:url,})}else{let shareUrl=`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`
window.open(shareUrl,'_blank','width=600,height=400')}})
document.querySelector('#collect-btn')?.addEventListener('click',function(e){e.preventDefault()
let collections=JSON.parse(localStorage['phim1080-collections']||'[]')
collections=collections.filter((item)=>item.id!==data.id)
collections.unshift(data)
collections=collections.slice(0,28)
localStorage['phim1080-collections']=JSON.stringify(collections)
Toastify({text:'Đã thêm vào bộ sưu tập',duration:3000,gravity:'bottom',position:'center',backgroundColor:'#0a0c0f',}).showToast()})
const toggleBtn=document.querySelector('.toggle-wrapper')
const tabListBox=document.querySelector('.player-list-box')
toggleBtn?.addEventListener('click',()=>{toggleBtn.classList.toggle('toggle-active')
tabListBox.classList.toggle('collapsed')
const lists=tabListBox.querySelectorAll('.anthology-list')
lists.forEach((list)=>{if(list.classList.contains('select-a')){list.classList.remove('select-a')
list.classList.add('select-b')}else if(list.classList.contains('select-b')){list.classList.remove('select-b')
list.classList.add('select-a')}})})})