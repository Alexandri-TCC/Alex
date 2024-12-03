
//telefone
document.getElementById('telefone').addEventListener('input', function (e) {
    let input = e.target.value;

   
    input = input.replace(/\D/g, '');

    
    input = input.slice(0, 11);

    let formatted = '';
    if (input.length > 0) {
        formatted += '(' + input.slice(0, 2);
    }
    if (input.length > 2) {
        formatted += ') ' + input.slice(2, 7);
    }
    if (input.length > 7) {
        formatted += '-' + input.slice(7, 11);
    }

    e.target.value = formatted;
});

    
//endereco
function consultarCEP() {
    var cep = document.getElementById('cep').value;
    var url = 'https://viacep.com.br/ws/' + cep + '/json/';

    fetch(url)
    .then(response => response.json())
    .then(data => {
        if (data.erro) {
            alert('CEP não encontrado.');
        } else {
            document.getElementById('logradouro').value = data.logradouro;
            document.getElementById('bairro').value = data.bairro;
            document.getElementById('cidade').value = data.localidade;
            document.getElementById('uf').value = data.uf;
        }
    })
    .catch(error => console.error('Erro:', error));
}

//senha
const senha = document.getElementById('senha');
    const confirmarSenha = document.getElementById('confirmarSenha');
    const senhaHelp = document.getElementById('senhaHelp');

    confirmarSenha.addEventListener('input', function() {
        if (senha.value !== confirmarSenha.value) {
            senhaHelp.style.display = 'block'; 
        } else {
            senhaHelp.style.display = 'none'; 
        }
    });

