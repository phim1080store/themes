document.addEventListener('DOMContentLoaded',function(){const text=document.getElementById('height_limit')
const toggleBtn=document.querySelector('.tim-bnt')
const textOpen=document.querySelector('.text-open')
if(text&&text.scrollHeight>text.clientHeight){text.classList.add('occlusion')
if(textOpen)textOpen.style.display='block'}
if(toggleBtn){toggleBtn.addEventListener('click',function(e){text.classList.toggle('height_rel')
if(text.classList.contains('height_rel')){text.classList.remove('occlusion')
this.innerHTML='<i class="fa r6 ease"></i>Thu gọn'}else{text.classList.add('occlusion')
this.innerHTML='<i class="fa r6 ease"></i>Xem thêm'}})}})