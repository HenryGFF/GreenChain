const divList = document.querySelectorAll('.main-atualizar>#action-div form>div');
divList.forEach(clicking);

function clicking(elemento) {
    const label = elemento.querySelector('label');

    if (elemento.querySelector('input')){
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
    if (elemento.querySelector('select')){
        const select = elemento.querySelector('select');
        select.addEventListener('focus', ()=>{
            select.style.border = '2px solid #00ff4f';
            label.style.color = '#00ff4f';
        })
        select.addEventListener('blur', ()=>{
            select.style.border = '';
            label.style.color = '';
        })
    } 
    if (elemento.querySelector('textarea')) {
        const textarea = elemento.querySelector('textarea');
        textarea.addEventListener('focus', ()=>{
            textarea.style.border = '2px solid #00ff4f';
            label.style.color = '#00ff4f';
        })
        textarea.addEventListener('blur', ()=>{
            textarea.style.border = '';
            label.style.color = '';
        })        
    }
}


const divtList = document.querySelectorAll('atualizar-form>div');
divList.forEach((div)=>{
    div.addEventListener('change', ()=>{
        const select = div.querySelector('.customSelect')
        const customInput = div.querySelector('textarea');

        if (select.value == 'custom-option'){
            customInput.style.display = '';
        } else {
            customInput.style.display = 'none';
        }
    })
});