function checkScreenSize(){const element=document.querySelector('#nav')
if(window.innerWidth<765){element.classList.add('no-null','head-c')}else{element.classList.remove('no-null','head-c')}}
window.addEventListener('resize',checkScreenSize)
window.addEventListener('load',checkScreenSize)
document.addEventListener('DOMContentLoaded',function(){let d=document,s=d.createElement('script')
s.src='https://https-phim1080-store.disqus.com/embed.js'
s.setAttribute('data-timestamp',+new Date());(d.head||d.body).appendChild(s)
new Swiper('.actor-roll',{slidesPerView:4,slidesPerGroup:4,grid:{rows:2,fill:'row',},spaceBetween:8,breakpoints:{1692:{slidesPerView:11,slidesPerGroup:11,spaceBetween:30},1330:{slidesPerView:9,slidesPerGroup:9,spaceBetween:30},993:{slidesPerView:7,slidesPerGroup:7,spaceBetween:30},560:{slidesPerView:6,slidesPerGroup:6,spaceBetween:15},},a11y:{enabled:!1,},})
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
if(window.Fancybox){Fancybox.bind('.fancybox',{maxWidth:800,maxHeight:600,fitToView:!1,width:'70%',height:'70%',autoSize:!1,closeClick:!1,openEffect:'none',closeEffect:'none',})}
let histories=JSON.parse(localStorage.getItem('phim1080-histories')||'[]')
let response=histories.find((item)=>item.id==movie_id)
if(response?.href){const btn=document.querySelector('.vod-detail-bnt')
if(btn){btn.innerHTML='<i class="fa r6 ds-bofang1"></i> Xem tiếp'
btn.setAttribute('href',response.href)}
let activeLink=document.querySelector('.player-list-box a[href="'+response.href+'"]')
if(activeLink)activeLink.classList.add('on')}
const desc=document.querySelector('.banner-content__desc')
const button=document.querySelector('.intl-album-more-btn')
if(desc&&button){if(desc.scrollHeight<=desc.clientHeight){button.style.display='none'}else{button.style.display='flex'}
button.addEventListener('click',function(){if(desc.classList.contains('line-clamp-3')){desc.classList.remove('line-clamp-3')
button.innerHTML='Ẩn bớt<i class="fa r6 ease"></i>'}else{desc.classList.add('line-clamp-3')
button.innerHTML='Hiển thị thêm<i class="fa r6 ease"></i>'}})}})