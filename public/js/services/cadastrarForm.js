document.getElementById('cadastro-form').addEventListener('submit', async (event)=>{
    event.preventDefault();

    try {
        const nome = document.querySelector('#nome').value;
        const email = document.querySelector('#email').value;
        const cnpj = document.querySelector('#cnpj').value;
        const endereco = document.querySelector('#endereco').value;
        const telefone = document.querySelector('#telefone').value;
        const senha = document.querySelector('#senha').value;

        const resposta = await fetch('/criarLogin', {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({nome, email, cnpj, endereco, telefone, senha})
        });

        const data = await resposta.json();

        if (resposta.status === 201){
            window.location.replace('/login.html');
            alert(`Sucesso, ${data.mensagem}`);
        } else{
            alert(`Erro, ${data.mensagem}`);
        }   
    } catch (error) {
        console.error(error);
        alert(`Erro de conexão com o servidor: ${error}`);
    }
})
