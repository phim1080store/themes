function formatSeconds(seconds){if(isNaN(seconds)||seconds<0){seconds=0}
const hours=Math.floor(seconds/3600)
const minutes=Math.floor((seconds%3600)/60)
return hours>0?`${hours}h${minutes}m`:`${minutes}m`}
function renderHistories(){let histories=JSON.parse(localStorage.getItem('phim1080-histories')||'[]')
let container=document.getElementById('histories-container')
container.innerHTML=''
if(histories.length===0){container.innerHTML=`
            <div class="content">
                <div class="bOxtzb">
                    <img src="https://cdn.jsdelivr.net/gh/phim1080store/themes/mtyy/img/box.webp" alt="">
                    <p class="title-h cor4">Không tìm thấy dữ liệu</p>
                </div>
            </div>`
return}
histories.forEach((movie)=>{let div=document.createElement('div')
div.className='public-list-box public-pic-b'
div.innerHTML=`
            <div class="pin-wrapper">
                <div class="pin-remove" data-id="${movie.id}">
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none">
                        <path d="M6 6L18 18M6 18L18 6" stroke="currentColor" stroke-width="2" />
                    </svg>
                </div>
                <div class="public-list-div">
                    <a class="public-list-exp" href="${movie.href}">
                        <img class="lazy lazy1 mask-0" referrerpolicy="no-referrer" alt="${movie.name}" src="${movie.thumb}">
                    </a>
                </div>
                <div class="public-list-button" style="padding-top: 0;">
                    <a href="${movie.href}">
                        <h2 class="title hide ft4">${movie.name}</h2>
                        <p class="hide ft1">${movie.episode_name} ${formatSeconds(localStorage.getItem('phim1080-playerposition-' + movie.episode_id))}/${formatSeconds(movie.duration)}</p>
                    </a>
                </div>
            </div>
        `
container.appendChild(div)})
document.querySelectorAll('.pin-remove').forEach((el)=>{el.addEventListener('click',function(){let id=this.getAttribute('data-id')
removeHistories(Number(id))})})}
function removeHistories(id){let histories=JSON.parse(localStorage.getItem('phim1080-histories')||'[]')
histories=histories.filter((item)=>item.id!=id)
localStorage.setItem('phim1080-histories',JSON.stringify(histories))
renderHistories()}
document.addEventListener('DOMContentLoaded',function(){let deleteBtn=document.querySelector('.delete-btn')
if(deleteBtn){deleteBtn.addEventListener('click',function(){localStorage.removeItem('phim1080-histories')
renderHistories()})}
renderHistories()})