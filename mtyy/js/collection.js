function formatSeconds(seconds){if(isNaN(seconds)||seconds<0){seconds=0}
const hours=Math.floor(seconds/3600)
const minutes=Math.floor((seconds%3600)/60)
return hours>0?`${hours}h${minutes}m`:`${minutes}m`}
function renderCollections(){let collections=JSON.parse(localStorage.getItem('phim1080-collections')||'[]')
let container=document.getElementById('collections-container')
container.innerHTML=''
if(collections.length===0){container.innerHTML=`
            <div class="content">
                <div class="bOxtzb">
                    <img src="https://cdn.jsdelivr.net/gh/phim1080store/themes/mtyy/img/box.webp" alt="">
                    <p class="title-h cor4">Không tìm thấy dữ liệu</p>
                </div>
            </div>`
return}
collections.forEach((movie)=>{let div=document.createElement('div')
div.className='public-list-box padding-list-box public-pic-b'
div.innerHTML=`
            <div class="pin-wrapper">
                <div class="pin-remove" data-id="${movie.id}">
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none">
                        <path d="M6 6L18 18M6 18L18 6" stroke="currentColor" stroke-width="2" />
                    </svg>
                </div>
                <div class="public-list-div">
                    <a class="public-list-exp" href="${movie.href}">
                        <img class="lazy lazy1" referrerpolicy="no-referrer" alt="${movie.name}" src="${movie.thumb}">
                    </a>
                </div>
                <div class="public-list-button">
                    <a class="disable-hover" href="${movie.href}">
                        <h2 class="title hide ft4">${movie.name}</h2>
                        <p class="sub-title hide ft1">${movie.origin_name}</p>
                    </a>
                </div>
            </div>
        `
container.appendChild(div)})
document.querySelectorAll('.pin-remove').forEach((el)=>{el.addEventListener('click',function(){let id=this.getAttribute('data-id')
removecollections(Number(id))})})}
function removecollections(id){let collections=JSON.parse(localStorage.getItem('phim1080-collections')||'[]')
collections=collections.filter((item)=>item.id!=id)
localStorage.setItem('phim1080-collections',JSON.stringify(collections))
renderCollections()}
document.addEventListener('DOMContentLoaded',function(){let deleteBtn=document.querySelector('.delete-btn')
if(deleteBtn){deleteBtn.addEventListener('click',function(){localStorage.removeItem('phim1080-collections')
renderCollections()})}
renderCollections()})