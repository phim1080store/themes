function formatSeconds(seconds){seconds=parseInt(seconds)
if(isNaN(seconds)||seconds<0)seconds=0
const hours=Math.floor(seconds/3600)
const minutes=Math.floor((seconds%3600)/60)
return hours>0?`${hours}h${minutes}m`:`${minutes}m`}
function renderHistories(){let histories=JSON.parse(localStorage.getItem('phim1080-histories')||'[]')
let container=document.getElementById('histories-container')
container.innerHTML=''
if(!histories.length){container.innerHTML=`
            <div class="content">
                <div class="bOxtzb">
                    <img src="https://cdn.jsdelivr.net/gh/phim1080store/themes/mtyy/img/box.webp" alt="">
                    <p class="title-h cor4">Không tìm thấy dữ liệu</p>
                </div>
            </div>`
return}
histories.forEach((movie)=>{const current=parseInt(localStorage.getItem('phim1080-playerposition-'+movie.episode_id))||0
const duration=parseInt(movie.duration)
const validDuration=!isNaN(duration)&&duration>0
const percent=validDuration?Math.min((current/duration)*100,100).toFixed(0):0
let div=document.createElement('div')
div.className='public-list-box padding-list-box public-pic-b'
div.innerHTML=`
            <div class="pin-wrapper">
                <div class="pin-remove" data-id="${movie.id}">
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none">
                        <path d="M6 6L18 18M6 18L18 6" stroke="currentColor" stroke-width="2" />
                    </svg>
                </div>
                <div class="public-list-div" style="position: relative;">
                    <a class="public-list-exp" href="${movie.href}">
                        <img class="lazy lazy1" referrerpolicy="no-referrer" alt="${movie.name}" src="${movie.thumb}">
                        ${
                            validDuration
                                ? `<div style="position: absolute; bottom: 0; left: 0; width: 100%; height: 3.5px; background: rgba(255, 179, 167, 0.6);"><div style="width: ${percent}%; height: 100%; background: #d32f2f;"></div></div>`
                                : ''
                        }
                    </a>
                </div>
                <div class="public-list-button">
                    <a class="disable-hover" href="${movie.href}">
                        <h2 class="title hide ft4">${movie.name}</h2>
                        <p class="sub-title hide ft1">${movie.episode_name} ${formatSeconds(localStorage.getItem('phim1080-playerposition-' + movie.episode_id))}/${formatSeconds(movie.duration)}</p>
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