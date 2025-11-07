function display(componente){
    const divComponente = document.querySelector('#componente-info-div');
    const updateForm = document.querySelector('#atualizar-form');
    const p = divComponente.querySelectorAll('p');

    p.forEach((paragraph) => {
        for (let key in componente) {
            if (paragraph.id == key){
                let span = paragraph.querySelector('.componente-info');
                span.textContent = `${componente[key]}`
            } ;
        }
    })

    divComponente.style.display = '';
    updateForm.style.display = '';
}




document.querySelector('#id-form').addEventListener('submit', async (event)=>{
    event.preventDefault();

    try {
        const form = document.querySelector('#id-form')
        const idExterno = form.querySelector('#id-input').value;

        const resposta = await fetch(`http://localhost:3000/consultarComponente/${idExterno}`, {
            method: 'GET',
            credentials: 'include'
        });

        data = await resposta.json();

        if (resposta.ok && data.status =='ok'){
            localStorage.setItem('componente', JSON.stringify(data.componente));

            const componente = JSON.parse(localStorage.getItem('componente'));
            display(componente);
            alert('componmente encontrado');
        } else{
            alert(`Erro, ${data.mensagem}`);
        }        
    } catch (error) {
        console.error(error);
        alert('Erro de conexão com servidor')
    }
   
})


document.querySelector('#atualizar-form').addEventListener('submit', async (event)=>{
    event.preventDefault();

    const form = document.querySelector('#atualizar-form');

    const descricaoTecnica = (
        form.querySelector('#descricao').value == 'null'?
        '':
        form.querySelector('#descricao-input').value
    );
    const observacoes = (
        form.querySelector('#observacoes').value == 'null'?
        '':
        form.querySelector('#observacoes-input').value
    );
    const estado = (
        form.querySelector('#estado').value == 'null'?
        '':
        form.querySelector('#estado').value
    );
    const status = (
        form.querySelector('#status').value == 'null'?
        '':
        form.querySelector('#status').value
    );
    const detalhes = (
        form.querySelector('#detalhes').value == 'null'?
        '':
        form.querySelector('#detalhes-input').value
    );

    const update = {
        descricao_tecnica: descricaoTecnica,
        detalhes: detalhes,
        observacoes: observacoes,
        estado: estado,
        status: status,
        email: JSON.parse(localStorage.getItem('empresa')).email,
        id_externo: JSON.parse(localStorage.getItem('componente')).id_externo,
        acao: null,
        hash: null,
        hash_anterior: null,
    }

    const resposta = await fetch('http://localhost:3000/atualizacao', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(update),
        credentials: 'include'
    });

    data = await resposta.json();

    if (resposta.ok && data.status =='ok'){
            alert(`Sucesso, ${data.mensagem}`);
    } else{
            alert(`Erro, ${data.mensagem}`);
    }   
})

window.addEventListener('beforeunload', function (event) {
  event.preventDefault(); 
  
  localStorage.removeItem('componente');
});
