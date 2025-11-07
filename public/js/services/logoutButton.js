document.querySelector('.logout-button').addEventListener('click', async ()=>{
    const resposta = await fetch('http://localhost:3000/logout', {
        method:'POST',
        credentials: 'include'
    })

    const data = await resposta.json();

    if (resposta.ok && data.status === 'ok'){
        localStorage.removeItem("empresa");
        window.location.replace('/index.html');
        alert(`Sucesso:  ${data.mensagem}`);
    } else{
        alert(`erro ao realizar logout: ${data.mensagem}`);
    }
})