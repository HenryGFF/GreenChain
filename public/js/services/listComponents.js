function displayComponentes(componentesArray){
        const mainDiv = document.getElementById('component-list');
        componentesArray.forEach(element => {
            const componenteDiv = document.createElement('div');
            componenteDiv.className = 'componente';

            const infoDiv = document.createElement('div');
            infoDiv.className = 'info';

            const qrDiv = document.createElement('div');
            qrDiv.className = 'qrcontainer';

            const qrcodeDiv = document.createElement('div');
            qrcodeDiv.className = 'qrcode';

            const button = document.createElement('button');
            button.textContent = 'imprimir'

            qrDiv.appendChild(qrcodeDiv)
            qrDiv.appendChild(button)

            button.addEventListener('click', ()=>{
                const conteudo = componenteDiv.querySelector(".qrcode").innerHTML;
                const janela = window.open("", "_blank");
                janela.document.body.innerHTML = `
                    <div style="display:flex;flex-direction:column;justify-content:center;align-items:center;height:100vh;">
                    ${conteudo}
                    <script>
                        window.onload = function() { 
                        window.print(); 
                        window.onafterprint = () => window.close(); 
                        };
                    <\/script>
                    </div>
                `;
                janela.document.close();
            })

            let id;

            for (const key in element) {
                let p = document.createElement('p');
                p.innerHTML = `${key}: <span>${element[key]}</span>`;

                if ( key == 'id_externo') id = element[key];

                infoDiv.appendChild(p);  
            }

            componenteDiv.appendChild(infoDiv);
            componenteDiv.appendChild(qrDiv);

            mainDiv.appendChild(componenteDiv);
            
            new QRCode(qrcodeDiv, {
            text: id,
            width: 250,
            height: 250,
            colorDark: "#00ff4f",
            colorLight: "#0b0b0b",
            correctLevel: QRCode.CorrectLevel.H
        });
    });
}

document.addEventListener('DOMContentLoaded', async () => {
    const empresa = JSON.parse(localStorage.getItem('empresa')).id;

    console.log(empresa)


    let resposta = await fetch(`/consultarTodosComponente/${empresa}`, {
        method: 'GET',
        credentials: 'include'
    });

    let data = await resposta.json();

    if (resposta.ok && data.status =='ok'){
        localStorage.setItem('componentesLista', JSON.stringify(data.componentes));

        const componentesArray = data.componentes
        console.log(componentesArray)
        displayComponentes(componentesArray);
    } else{
        alert(`Erro, ${data.mensagem}`);
    }
})
