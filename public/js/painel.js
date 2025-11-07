const user = JSON.parse(localStorage.getItem('empresa'));

const nome = user.nome;
const email = user.email;
const cnpj = user.cnpj;

document.querySelector('#nome-conta').textContent = `${nome}`;
document.querySelector('#email-conta').textContent = `${email}`;
document.querySelector('#cnpj-conta').textContent = `${cnpj}`;



document.querySelector('#cadastrar-componente').addEventListener('click', ()=>{
    window.location.href = '/cadastroComponente.html';
})
document.querySelector('#componentes-cadastrados').addEventListener('click', ()=>{
    window.location.href = '/listaComponentes.html';
})
document.querySelector('#atualizar-cadastro').addEventListener('click', ()=>{
    window.location.href = '/atualizar.html';
})