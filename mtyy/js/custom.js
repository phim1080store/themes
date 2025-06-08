function isBot(){let userAgent=navigator.userAgent.toLowerCase()
let botPatterns=[/bot/,/crawl/,/spider/,/slurp/,/curl/,/wget/,/python/,/scrapy/,/chrome-lighthouse/]
let isWebDriver=navigator.webdriver
if(isWebDriver)return!0
return botPatterns.some((pattern)=>pattern.test(userAgent))}
function isPC(){let userAgent=navigator.userAgent.toLowerCase()
let isMobile=/iphone|ipad|android|mobile|blackberry|iemobile|opera mini/.test(userAgent)
return!isMobile}
document.addEventListener('DOMContentLoaded',function(){setTimeout(function(){const preloading=document.querySelector('.preloading')
if(preloading){preloading.style.transition='opacity 0.5s ease'
preloading.style.opacity=0
setTimeout(()=>{preloading.style.display='none'},500)}},500)
let menuItems=document.querySelectorAll('.head-more-menu')
menuItems.forEach(function(item){let submenu=item.querySelector('.head-more')
let link=item.querySelector('.this-get')
item.addEventListener('mouseenter',function(){submenu.style.display='block'
link.classList.add('active')})
item.addEventListener('mouseleave',function(){submenu.style.display='none'
link.classList.remove('active')})})
let menuButton=document.querySelector('.gen-left-list-mobile')
let menu=document.querySelector('.drawer-list')
let overlay=document.querySelector('.drawer-list-bg')
menuButton.addEventListener('click',function(){menu.classList.add('v-show')
menu.classList.remove('v-hidden')
overlay.classList.add('v-show')
overlay.classList.remove('v-hidden')})
overlay.addEventListener('click',function(){menu.classList.add('v-hidden')
menu.classList.remove('v-show')
overlay.classList.add('v-hidden')
overlay.classList.remove('v-show')})
let lazyImages=document.querySelectorAll('img.lazy')
let imgObserver=new IntersectionObserver(function(entries,observer){entries.forEach(function(entry){if(entry.isIntersecting){let img=entry.target
let imgSrc=img.dataset.src
if(!imgSrc.includes('&w=')){imgSrc+=isPC()?'&w=320':'&w=250'}
imgSrc='https://images.weserv.nl/?url='+imgSrc+'&output=webp'
let newImg=new Image()
newImg.onload=function(){img.src=imgSrc}
newImg.src=imgSrc
observer.unobserve(img)}})})
lazyImages.forEach(function(img){imgObserver.observe(img)})
let w=isPC()?1080:560
let lazyBgElements=document.querySelectorAll('.lazy-bg')
let bgObserver=new IntersectionObserver(function(entries,observer){entries.forEach(function(entry){if(entry.isIntersecting){let bgElement=entry.target
let bgUrl=bgElement.dataset.bg
if(bgUrl){bgElement.style.backgroundImage="url('https://images.weserv.nl/?url="+bgUrl+'&w='+w+"&output=webp')"
bgElement.classList.remove('lazy-bg')}
observer.unobserve(bgElement)}})})
lazyBgElements.forEach(function(el){bgObserver.observe(el)})
let searchTerm=getSearchParam()
if(searchTerm){addSearchTerm(searchTerm)}
let searchInput=document.querySelector('#search input')
let resultBox=document.getElementById('result')
searchInput.addEventListener('click',function(e){e.stopPropagation()
renderHistory()})
document.body.addEventListener('click',function(){resultBox.innerHTML=''})
let filterBtn=document.querySelector('.filter-btn')
let filterForm=document.querySelector('.filter-form')
let btnCloseFilter=document.querySelector('.btn-close-filter')
function toggleFilterForm(){if(!filterForm)return
if(filterForm.classList.contains('v-hidden')){if(filterBtn)filterBtn.innerHTML='<i class="fa r6 ease"></i>Bộ lọc'
filterForm.classList.remove('v-hidden')}else{if(filterBtn)filterBtn.innerHTML='<i class="fa r6 ease"></i>Bộ lọc'
filterForm.classList.add('v-hidden')}}
if(filterBtn)filterBtn.addEventListener('click',toggleFilterForm)
if(btnCloseFilter)btnCloseFilter.addEventListener('click',toggleFilterForm)
let filterItems=document.querySelectorAll('.filter-item')
filterItems.forEach(function(item){item.addEventListener('click',function(e){e.preventDefault()
let type=item.dataset.type
let id=item.dataset.id
let container=document.getElementById(type)
if(!container)return
if(['country','category','year','language'].includes(type)){if(id===''){container.querySelectorAll('.filter-item').forEach((el)=>el.classList.remove('active'))
let emptyFilter=container.querySelector('.filter-item[data-id=""]')
if(emptyFilter)emptyFilter.classList.add('active')}else if(id==='other'){container.querySelectorAll('.filter-item').forEach((el)=>el.classList.remove('active'))
let otherFilter=container.querySelector('.filter-item[data-id="other"]')
if(otherFilter)otherFilter.classList.add('active')}else{let emptyFilter=container.querySelector('.filter-item[data-id=""]')
if(emptyFilter)emptyFilter.classList.remove('active')
item.classList.toggle('active')
if(!container.querySelector('.filter-item.active')){if(emptyFilter)emptyFilter.classList.add('active')}}}else{container.querySelectorAll('.filter-item').forEach((el)=>el.classList.remove('active'))
item.classList.add('active')}})})
let btnFilter=document.querySelector('.btn-filter')
if(btnFilter){btnFilter.addEventListener('click',function(e){e.preventDefault()
let filterType=document.querySelector('#type .filter-item.active')?.dataset.id||''
let filterCategory=Array.from(document.querySelectorAll('#category .filter-item.active')).map((el)=>el.dataset.id)
let filterCountry=Array.from(document.querySelectorAll('#country .filter-item.active')).map((el)=>el.dataset.id)
let filterYear=Array.from(document.querySelectorAll('#year .filter-item.active')).map((el)=>el.dataset.id)
let filterLanguage=Array.from(document.querySelectorAll('#language .filter-item.active')).map((el)=>el.dataset.id)
let filterSort=document.querySelector('#sort .filter-item.active')?.dataset.id||''
let url=new URL(window.location.href)
url.searchParams.set('filter[type]',filterType)
url.searchParams.set('filter[category]',filterCategory.join(','))
url.searchParams.set('filter[country]',filterCountry.join(','))
url.searchParams.set('filter[year]',filterYear.join(','))
url.searchParams.set('filter[language]',filterLanguage.join(','))
url.searchParams.set('filter[sort]',filterSort)
window.location.href=url.origin+url.search})}})
function toggleChildren(contentId,iconId){let content=document.getElementById(contentId)
let icon=document.getElementById(iconId)
if(content.classList.contains('ds-none')){content.classList.remove('ds-none')
icon.innerHTML=''}else{content.classList.add('ds-none')
icon.innerHTML=''}}
window.addEventListener('scroll',function(){let nav=document.getElementById('nav')
if(window.scrollY>0){nav.classList.add('head-b')
nav.style.position='fixed'}else{nav.classList.remove('head-b')
nav.style.position=''}})
document.getElementById('toggleSearch').addEventListener('click',function(){const button=document.getElementById('toggleSearch');const logo=document.querySelector('.logo-brand');const form=document.querySelector('.search-min-box');if(form.classList.contains('v-show')){form.classList.remove('v-show');logo.classList.remove('v-hidden');button.classList.add('ds-sousuo');button.classList.remove('ds-guanbi2')}else{form.classList.add('v-show');logo.classList.add('v-hidden');button.classList.remove('ds-sousuo');button.classList.add('ds-guanbi2')}});function renderHistory(){let history=(JSON.parse(localStorage.getItem('searchHistory'))||[]).slice(0,5)
let resultBox=document.getElementById('result')
if(history.length===0)return(resultBox.innerHTML='')
let html=''
html+='<span><div class="rowsearch"><div class="column rights" style="margin-left: 10px;"><p class="hide">Lịch sử tìm kiếm</p></div><div class="column lefts"><i class="fa r6 ds-shanchu2" style="font-size: 16px; cursor: pointer;" onclick="clearHistory()"></i></div></div></span>'
history.forEach(function(item){html+='<div class="rowsearch item">'
html+='<a href="/?search='+encodeURIComponent(item)+'" style="flex: 1; margin-left: 10px;"><div class="column rights"><p class="hide">'+item+'</p></div></a>'
html+='<div class="column lefts"><i class="fa r6 ds-guanbi2" style="font-size: 12px; cursor: pointer;" onclick="event.stopPropagation(); event.preventDefault(); removeHistory(\''+item+'\')"></i></div>'
html+='</div>'})
resultBox.innerHTML=html}
function addSearchTerm(term){let history=JSON.parse(localStorage.getItem('searchHistory'))||[]
term=term.trim()
if(!term)return
history=history.filter(function(t){return t!==term})
history.unshift(term)
if(history.length>10)history.pop()
localStorage.setItem('searchHistory',JSON.stringify(history))}
function removeHistory(term){let history=JSON.parse(localStorage.getItem('searchHistory'))||[]
history=history.filter(function(item){return item!==term})
localStorage.setItem('searchHistory',JSON.stringify(history))
renderHistory()}
function clearHistory(){localStorage.removeItem('searchHistory')
renderHistory()}
function getSearchParam(){let urlParams=new URLSearchParams(window.location.search)
return urlParams.get('search')}