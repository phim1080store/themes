document.addEventListener('DOMContentLoaded',function(){const text=document.getElementById('height_limit')
const toggleBtn=document.querySelector('.tim-bnt')
const textOpen=document.querySelector('.text-open')
if(text&&text.scrollHeight>text.clientHeight){text.classList.add('occlusion')
if(textOpen)textOpen.style.display='block'}
if(toggleBtn){toggleBtn.addEventListener('click',function(e){text.classList.toggle('height_rel')
if(text.classList.contains('height_rel')){text.classList.remove('occlusion')
this.innerHTML='<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-chevron-up-icon lucide-chevron-up"><path d="m18 15-6-6-6 6"/></svg>Thu gọn'}else{text.classList.add('occlusion')
this.innerHTML='<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-chevron-down-icon lucide-chevron-down"><path d="m6 9 6 6 6-6"/></svg>Xem thêm'}})}})