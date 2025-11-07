function displayComponente(componente){
    const main = document.querySelector('.main-consultar');
    const divComponente = document.querySelector('#div-componente');
    divComponente.innerHTML = ''


    const divCadastro = document.createElement('div');

    divComponente.className = 'div-componente';
    divCadastro.className = 'div-cadastro';

    delete componente.id_componente
    for (let key in componente) {
        let p = document.createElement('p');
        p.innerHTML = `${key}: <br> <span>${componente[key]}</span>`;

        divCadastro.appendChild(p);
    }
    
    divComponente.appendChild(divCadastro);
    main.appendChild(divComponente);
};

function displayHistorico(historico){
    const divComponente = document.querySelector('#div-componente');;

    historico.forEach( (element) => {
        let divData = document.createElement('div');
        let divInfo = document.createElement('div');
        let divHistorico = document.createElement('div');

        divHistorico.className = 'div-historico';

        divData.className = 'div-data';
        divData.innerHTML = `<p>${element.data_acao}</p>`;
        divHistorico.appendChild(divData);
        delete element.data_acao;

        for (const key in element) {
            let p = document.createElement('p');
            p.innerHTML = `${key}: <span>${element[key]}</span>`;

            divInfo.appendChild(p); 
        }

        divInfo.className = 'div-info';
        divHistorico.appendChild(divInfo);
        divComponente.appendChild(divHistorico);
    });
};

document.querySelector('#id-form').addEventListener('submit', async (event)=>{
    event.preventDefault();

    try {
        const form = document.querySelector('#id-form')
        const idExterno = form.querySelector('#id-input').value;

        let resposta = await fetch(`http://localhost:3000/consultarComponente/${idExterno}`, {
            method: 'GET',
            credentials: 'include'
        });

        let data = await resposta.json();

        if (!data.componente || typeof data.componente !== 'object') {
            console.error('Componente inválido:', data.componente);
            alert('Erro: componente não encontrado.');
            return;
        }

        if (resposta.ok && data.status =='ok'){
            delete data.componente.id_componente;
            delete data.componente.id_empresa;
            localStorage.setItem('componente', JSON.stringify(data.componente));

            displayComponente(data.componente);
        } else{
            alert(`Erro, ${data.mensagem}`);
        }

        resposta = await fetch(`http://localhost:3000/consultarHistorico/${idExterno}`, {
            method: 'GET',
            credentials: 'include'
        });

        data = await resposta.json();


        if (resposta.ok && data.status =='ok'){
            localStorage.setItem('historico', JSON.stringify(data.historico));
            
            const historico = Array.from(JSON.parse(data.historico)); 
            console.log(historico)

            displayHistorico(historico);
        } else{
            alert(`Erro, ${data.mensagem}`);
        }
    } catch (error) {
        console.error(error);
        alert('Erro de conexão com servidor');
    }   
});

window.addEventListener('beforeunload', function (event) {
  event.preventDefault(); 
  
  localStorage.removeItem('componente');
  localStorage.removeItem('historico');
});