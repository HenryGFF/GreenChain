document.getElementById('login-form').addEventListener('submit', async (event)=>{
    event.preventDefault();

    try {
        const email = document.querySelector('#email').value;
        const senha = document.querySelector('#senha').value;

        const resposta = await fetch('/login', {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({email, senha}),
            credentials: 'include'
        })

        const data = await resposta.json();
        if (resposta.ok && data.status === 'ok'){
            localStorage.setItem('empresa', JSON.stringify(data.empresa));
            window.location.replace('/painel.html');
            alert('Login realizado com sucesso');
        } else {
            alert(data.mensagem);
        }   
    } catch (error) {
        console.error(error);
        alert('Erro de conexão com servidor');
    }
});
