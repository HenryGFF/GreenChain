const divList = document.querySelectorAll('.main-login form>div');
divList.forEach(clicking);

function clicking(elemento) {
    const label = elemento.querySelector('label');

    const input = elemento.querySelector('input');
    input.addEventListener('focus', ()=>{
        input.style.border = '2px solid #00ff4f';
        label.style.color = '#00ff4f';
    })
    input.addEventListener('blur', ()=>{
        input.style.border = '';
        label.style.color = '';
    })
}