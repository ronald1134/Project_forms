// Array global para armazenar os registros
const registros = [];

// Função para formatar a data no formato brasileiro
function formatarDataBR(dataString) {
    if (!dataString) return '';
    const data = new Date(dataString);
    data.setMinutes(data.getMinutes() + data.getTimezoneOffset());
    const dia = String(data.getDate()).padStart(2, '0');
    const mes = String(data.getMonth() + 1).padStart(2, '0');
    const ano = data.getFullYear();
    return `${dia}/${mes}/${ano}`;
}

// Adiciona evento ao botão de envio
document.getElementById('submitBtn').addEventListener('click', function (e) {
    e.preventDefault();

    const form = document.getElementById('bloco-form');
    const recordsList = document.getElementById('recordsList');

    let allFilled = true;
    const requiredInputs = form.querySelectorAll('textarea:not([name="observacao"])');
    requiredInputs.forEach(input => {
        if (!input.value.trim()) {
            allFilled = false;
            input.classList.add('invalid');
        } else {
            input.classList.remove('invalid');
        }
    });

    if (!allFilled) {
        alert('Por favor, preencha todos os campos obrigatórios!');
        return;
    }


    if (
        form.nome.value.trim() === "" ||
        form.data.value.trim() === "" ||   
        form.marca.value.trim() === "" ||   
        form.unidade.value.trim() === "" ||   
        form.especialidade.value.trim() === "" ||    
        form.qtdPacientes.value.trim() === "" ||   
        form.quemSolicitou.value.trim() === "" ||   
        form.motivo.value.trim() === "" ||
        form.numChamado.value.trim() === ""
    ) {
        alert('Por favor, preencha todos os campos obrigatórios!');
        return;
    }


    const novoRegistro = {
        id: Date.now(), // ID único apenas para controle local
        nome: form.nome.value.trim(),
        data: form.data.value.trim(),
        marca: form.marca.value.trim(),
        unidade: form.unidade.value.trim(),
        especialidade: form.especialidade.value.trim(),
        qtdPacientes: form.qtdPacientes.value.trim(),
        quemSolicitou: form.quemSolicitou.value.trim(),
        motivo: form.motivo.value.trim(),
        observacao: form.observacao.value.trim(),
        numChamado: form.numChamado.value.trim()
    };

    registros.push(novoRegistro);

    const recordItem = document.createElement('div');
    recordItem.className = 'record-item';
    recordItem.dataset.id = novoRegistro.id;

    recordItem.innerHTML = `
        <div class="record-header">
            <p class="record-name"><strong>${novoRegistro.nome}</strong></p>
            <div class="record-actions">
                <button class="btn-edit">✏️ Editar</button>
                <button class="btn-delete">🗑️ Excluir</button>
            </div>
        </div>
        <p class="record-meta">${formatarDataBR(novoRegistro.data)} <br> | <strong>${novoRegistro.marca} - ${novoRegistro.unidade}</strong></p>
        <p class="record-meta">${novoRegistro.especialidade} (${novoRegistro.qtdPacientes} Pacientes)</p>
        <p class="record-detail">Solicitado por: ${novoRegistro.quemSolicitou}</p>
        ${novoRegistro.motivo ? `<p class="record-detail"><strong>Motivo: ${novoRegistro.motivo}</strong></p>` : ''}
    `;

    // Excluir registro
    recordItem.querySelector('.btn-delete').addEventListener('click', () => {
        if (confirm('Tem certeza que deseja excluir este registro?')) {
            const id = parseInt(recordItem.dataset.id);
            const index = registros.findIndex(r => r.id === id);
            if (index > -1) registros.splice(index, 1);
            recordItem.remove();

            if (recordsList.children.length === 0) {
                recordsList.innerHTML = '<p class="empty-message">Nenhum registro adicionado ainda</p>';
            }
        }
    });

    // Editar registro
    recordItem.querySelector('.btn-edit').addEventListener('click', () => {
        const id = parseInt(recordItem.dataset.id);
        const index = registros.findIndex(r => r.id === id);
        if (index > -1) {
            const registro = registros.splice(index, 1)[0];
            form.nome.value = registro.nome;
            form.data.value = registro.data;
            form.marca.value = registro.marca;
            form.unidade.value = registro.unidade;
            form.especialidade.value = registro.especialidade;
            form.qtdPacientes.value = registro.qtdPacientes;
            form.quemSolicitou.value = registro.quemSolicitou;
            form.motivo.value = registro.motivo;
            form.observacao.value = recordItem.observacao;
            form.numChamado.value = recordItem.numChamado;

            recordItem.remove();
            form.nome.focus();
        }
    });

    if (recordsList.querySelector('.empty-message')) {
        recordsList.innerHTML = '';
    }

    recordsList.prepend(recordItem);
    form.reset();
});

// Limpar registros
document.getElementById('clearBtn').addEventListener('click', () => {
    if (confirm('Tem certeza que deseja limpar todos os registros?')) {
        registros.length = 0;
        document.getElementById('recordsList').innerHTML = '<p class="empty-message">Nenhum registro adicionado ainda</p>';
    }
});

// Finalizar (enviar para o backend)
document.getElementById('finalizarBtn').addEventListener('click', (e) => {
    e.preventDefault();

    const finalizarBtn = document.getElementById('finalizarBtn');
    const loading = document.getElementById('loading');
    const recordsList = document.getElementById('recordsList');

    if (registros.length === 0) {
        alert('Nenhum registro para enviar!');
        return;
    }

    finalizarBtn.disabled = true;
    loading.style.display = 'block';

    // Remove o id antes de enviar ao backend
    const registrosParaEnviar = registros.map(({ id, ...rest }) => rest);

    fetch('https://forms-project-back.onrender.com/form', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(registrosParaEnviar)
    })
        .then(res => res.json())
        .then(data => {
            console.log('Resposta do servidor:', data);
            alert('Registros enviados com sucesso!');

            // Limpa array
            registros.length = 0;

            // Limpa visualmente os registros
            recordsList.innerHTML = '<p class="empty-message">Nenhum registro adicionado ainda</p>';
        })
        .catch(err => {
            console.error('Erro ao enviar registros:', err);
            alert('Erro ao enviar registros!');
        })
        .finally(() => {
            finalizarBtn.disabled = false;
            loading.style.display = 'none';
        });
});