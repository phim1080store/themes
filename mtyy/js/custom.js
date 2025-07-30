function isBot(){let userAgent=navigator.userAgent.toLowerCase()
let botPatterns=[/bot/,/crawl/,/spider/,/slurp/,/curl/,/wget/,/python/,/scrapy/]
let isWebDriver=navigator.webdriver
if(isWebDriver)return!0
return botPatterns.some((pattern)=>pattern.test(userAgent))}
function isPC(){let userAgent=navigator.userAgent.toLowerCase()
let isMobile=/iphone|ipad|android|mobile|blackberry|iemobile|opera mini/.test(userAgent)
return!isMobile}
NProgress.configure({showSpinner:!1})
window.addEventListener('beforeunload',function(){NProgress.start()})
window.addEventListener('load',function(){NProgress.done()})
window.addEventListener('pageshow',function(){NProgress.done()})
document.addEventListener('DOMContentLoaded',function(){var myLazyLoad=new LazyLoad()
myLazyLoad.update()
let menuItems=document.querySelectorAll('.head-more-menu')
menuItems.forEach(function(item){let submenu=item.querySelector('.head-more')
let link=item.querySelector('.this-get')
if(submenu){item.addEventListener('mouseenter',function(){submenu.style.display='block'
link.classList.add('active')})
item.addEventListener('mouseleave',function(){submenu.style.display='none'
link.classList.remove('active')})}})
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
if(filterForm.classList.contains('v-hidden')){if(filterBtn)
filterBtn.innerHTML='<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-chevron-up-icon lucide-chevron-up"><path d="m18 15-6-6-6 6"/></svg>Bộ lọc'
filterForm.classList.remove('v-hidden')}else{if(filterBtn)
filterBtn.innerHTML='<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-chevron-down-icon lucide-chevron-down"><path d="m6 9 6 6 6-6"/></svg>Bộ lọc'
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
window.location.href=url.origin+url.search})}
document.getElementById('toggleSearch')?.addEventListener('click',function(e){e.preventDefault()
const button=document.getElementById('toggleSearch')
const logo=document.querySelector('.logo-brand')
const form=document.querySelector('.search-min-box')
if(form.classList.contains('v-show')){form.classList.remove('v-show')
logo.classList.remove('v-hidden')
button.innerHTML='<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-search-icon lucide-search"><path d="m21 21-4.34-4.34"/><circle cx="11" cy="11" r="8"/></svg>'}else{form.classList.add('v-show')
logo.classList.add('v-hidden')
button.innerHTML='<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-x-icon lucide-x"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>'}})})
function toggleChildren(contentId,iconId){const content=document.getElementById(contentId)
const icon=document.getElementById(iconId)
const path=icon.querySelector('path')
if(content.classList.contains('ds-none')){content.classList.remove('ds-none')
path.setAttribute('d','m6 15 6-6 6 6')}else{content.classList.add('ds-none')
path.setAttribute('d','m6 9 6 6 6-6')}}
window.addEventListener('scroll',function(){let nav=document.getElementById('nav')
if(window.scrollY>0){nav.classList.add('head-b')
nav.style.position='fixed'}else{nav.classList.remove('head-b')
nav.style.position=''}})
function renderHistory(){let history=(JSON.parse(localStorage.getItem('searchHistory'))||[]).slice(0,5)
let resultBox=document.getElementById('result')
if(history.length===0)return(resultBox.innerHTML='')
let html=''
html+='<span><div class="rowsearch"><div class="column rights" style="margin-left: 10px;"><p class="hide">Lịch sử tìm kiếm</p></div><div class="column lefts"><svg class="cursor-pointer"  onclick="clearHistory()" xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-trash2-icon lucide-trash-2"><path d="M10 11v6"/><path d="M14 11v6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6"/><path d="M3 6h18"/><path d="M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/></svg></div></div></span>'
history.forEach(function(item){html+='<div class="rowsearch item">'
html+='<a href="/?search='+encodeURIComponent(item)+'" style="flex: 1; margin-left: 10px;"><div class="column rights" style="padding: 0"><p class="hide">'+item+'</p></div></a>'
html+='<div class="column lefts flex-center" style="padding: 0"><svg class="cursor-pointer" onclick="event.stopPropagation(); event.preventDefault(); removeHistory(\''+item+'\')" xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-x-icon lucide-x"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg></div>'
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