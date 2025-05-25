function formatSeconds(seconds){if(isNaN(seconds)||seconds<0){seconds=0}
const hours=Math.floor(seconds/3600);const minutes=Math.floor((seconds%3600)/60);let formattedDuration='';if(hours>0){formattedDuration=`${hours}h${minutes}m`}else{formattedDuration=`${minutes}m`}
return formattedDuration}
function renderHistories(){let histories=JSON.parse(localStorage['phim1080-histories']||'[]');let container=document.getElementById('histories-container');container.innerHTML='';if(histories.length===0){container.innerHTML=`<p class="title-h cor4">Không tìm thấy dữ liệu</h4>`;return}
histories.forEach(movie=>{let div=document.createElement('div');div.className='public-list-box public-pic-g';div.innerHTML=`
            <div class="pin-wrapper">
                <div class="pin-remove" onclick="removeHistories(${movie.id})">
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none">
                        <path d="M6 6L18 18M6 18L18 6" stroke="currentColor" stroke-width="2" />
                    </svg>
                </div>
                <div class="public-list-div">
                    <a class="public-list-exp" href="${movie.href}">
                        <img class="lazy lazy1 mask-0" referrerpolicy="no-referrer" alt="${movie.name} ${movie.origin_name}" src="${movie.thumb}">
                    </a>
                </div>
                <div class="public-list-button" style="padding-top: 0;">
                    <a href="${movie.href}">
                        <h2 class="title hide ft4">${movie.name}</h2>
                        <p class="hide ft1">${movie.episode_name} ${formatSeconds(localStorage['phim1080-playerposition-' + movie.episode_id])}/${formatSeconds(movie.duration)}</p>
                    </a>
                </div>
            </div>
        `;container.appendChild(div)})}
function removeHistories(id){let histories=JSON.parse(localStorage['phim1080-histories']||'[]');histories=histories.filter(item=>item.id!=id);localStorage['phim1080-histories']=JSON.stringify(histories);renderHistories()};$('.delete-btn').on("click",function(){localStorage.removeItem('phim1080-histories');renderHistories()});renderHistories()