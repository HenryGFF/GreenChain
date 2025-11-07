function gerarQrcode(id){
    const qrcodeDiv = document.getElementById("qr-code");
    const idDisplay = document.getElementById("id-gerado");
    const qrField = document.getElementById("qr-field");

    qrcodeDiv.innerHTML = "";
    idDisplay.textContent = `${id}`

    new QRCode(qrcodeDiv, {
        text: id,
        width: 250,
        height: 250,
        colorDark: "#ffffffff",
        colorLight: "#00ff4f",
        correctLevel: QRCode.CorrectLevel.H
    });

    qrField.style.display = '';
}

function imprimirQrCode() {
  const conteudo = document.getElementById("qr-code").innerHTML;
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
}


const imprimirButton = document.getElementById('print');
imprimirButton.addEventListener('click', imprimirQrCode)

const formList = document.querySelectorAll('form', imprimirQrCode);
formList.forEach((form) =>{
    form.addEventListener('submit', async (event)=>{
    event.preventDefault();

    try {
        let FormInput = null;

        if (form.id == 'cadastro_componente_novo'){
            const categoria = form.querySelector('#categorias').value;
            const marca = form.querySelector('#marca').value;
            const modelo = form.querySelector('#modelo').value;
            const numSerie = form.querySelector('#numero-serie').value;
            const dataFabricacao = form.querySelector('#data-fabricacao').value;
            const statusInicial = form.querySelector('#status').value;
            const estadoInicial = form.querySelector('#estado').value;
            const descricaoTecnica = form.querySelector('#descricao-tecnica').value;


            FormInput = {
                id_externo: null,
                id_empresa: null,
                categoria: categoria,
                marca: marca,
                modelo: modelo,
                numero_serie:numSerie,
                data_fabricacao: dataFabricacao,
                status: statusInicial,
                origem: 'Produto novo, não usado/não reciclado',
                descricao_tecnica: descricaoTecnica,
                observacoes: null,
                estado: estadoInicial,
                acao: 'Cadastro de componente na plataforma',
                hash: null,
                hash_anterior: null,
            };
        } else {
            const categoria = form.querySelector('#categorias-Rec').value;
            const marca = (
                form.querySelector('#marca-Rec').value == 'unknown'?
                form.querySelector('#marca-Rec').value:
                form.querySelector('#marca-Rec-text').value
            );
            const modelo = (
                form.querySelector('#modelo-Rec').value == 'unknown'?
                form.querySelector('#modelo-Rec').value:
                form.querySelector('#modelo-Rec-text').value
            );
            const numSerie = (
                form.querySelector('#numero-serie-Rec').value == 'unknown'?
                form.querySelector('#numero-serie-Rec').value:
                form.querySelector('#numero-serie-Rec-text').value
            );
            const dataFabricacao = form.querySelector('#ano-fabricacao').value;
            const estadoInicial = form.querySelector('#estado-Rec').value;
            const origem = form.querySelector('#origem').value;
            const descricaoTecnica = form.querySelector('#descricao-tecnica-Rec').value;
            const observacoes = form.querySelector('#observacoes').value;
            const statusInicial = form.querySelector('#status-Rec').value;

            FormInput = {
                id_externo: null,
                id_empresa: null,
                categoria: categoria,
                marca: marca,
                modelo: modelo,
                numero_serie:numSerie,
                data_fabricacao: dataFabricacao,
                status: statusInicial,
                origem: origem,
                descricao_tecnica: descricaoTecnica,
                observacoes: observacoes,
                estado: estadoInicial,
                acao: 'Cadastro de componente na plataforma',
                hash: null,
                hash_anterior: null,
            };
        }

        const resposta = await fetch('/cadastroComponente', {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify(FormInput)
        })

        const data = await resposta.json();

        if (resposta.ok && data.status =='ok'){
            alert(`Sucesso: ${data.mensagem}\n${data.id}`);
            console.log(data.id)
            gerarQrcode(data.id);
        } else {
            alert(`Erro: ${data.mensagem}\nTente novamente`);
        }
    } catch (error) {
        
    }
})
})
