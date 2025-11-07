const optionList = document.querySelectorAll('.div-option');
optionList.forEach(checking);

function checking(elemento){
    const radio = elemento.querySelector('.option-radio');
    
    elemento.addEventListener('click', ()=>{
        radio.checked = true;

        if(radio.checked == true){
            optionList.forEach((elemento)=>{
                elemento.style.color = '';
                elemento.style.border = '';
            });

            elemento.style.color = '#00ff4f';
            elemento.style.border = '2px solid #00ff4f';
            elemento.style.borderRadius = '10px';
        }

        formDisplay(elemento);
    });
}

function formDisplay(elemento){
    const formA = document.querySelector('#cadastro_componente_novo');
    const formB = document.querySelector('#cadastro_componente_reciclado');

    if (elemento.querySelector('#cadastro-componente-novo')){
            formA.style.display = '';
            formB.style.display = 'none';
    } else if (elemento.querySelector('#cadastro-componente-reciclado')){
            formA.style.display = 'none';
            formB.style.display = '';
    }
}



const divList = document.querySelectorAll('.form-div');
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


const customDiv = document.querySelectorAll('.custom');
customDiv.forEach(inputDisplay);

function inputDisplay(elemento){
    const customSelect = elemento.querySelector('.custom-select');
    const customInput = elemento.querySelector('.custom-input');

    customSelect.addEventListener('change', (event)=>{
        if (customSelect.value == 'custom-option'){
            customInput.style.visibility = 'visible';
        } else {
            customInput.style.visibility = 'hidden';
        }
    })
}