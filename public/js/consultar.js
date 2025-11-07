const idDiv = document.getElementById('id-div');
const idInput = document.getElementById('id-input');
const label = idDiv.querySelector('label');

idInput.addEventListener('focus', ()=>{
    idInput.style.border = '2px solid #00ff4f';
    label.style.color = '#00ff4f';
})
idInput.addEventListener('blur', ()=>{
    idInput.style.border = '';
    label.style.color = '';
})