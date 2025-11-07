document.addEventListener('DOMContentLoaded', ()=>{
    const user = JSON.parse(localStorage.getItem('empresa'));
    const loginLink = document.getElementById('loginItem');
    const painelLink = document.getElementById('painelItem');

    if (user){
        loginLink.style.display = 'none';
        painelLink.style.display = 'visible';
    } else {
        loginLink.style.display = 'visible';
        painelLink.style.display = 'none';
    }
})