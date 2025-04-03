function formatarDataBR(dataString) {
    if (!dataString) return '';
    
    const data = new Date(dataString);
    // Ajusta para o fuso horário local
    data.setMinutes(data.getMinutes() + data.getTimezoneOffset());
    
    const dia = String(data.getDate()).padStart(2, '0');
    const mes = String(data.getMonth() + 1).padStart(2, '0');
    const ano = data.getFullYear();
    
    return `${dia}/${mes}/${ano}`;
}

document.getElementById('submitBtn').addEventListener('click', function() {
    const form = document.getElementById('bloco-form');
    const recordsList = document.getElementById('recordsList');
    
    // Verificar se todos os campos estão preenchidos (exceto motivo que é opcional)
    let allFilled = true;
    const requiredInputs = form.querySelectorAll('input:not([name="motivo"]), textarea:not([name="motivo"])');
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
    
    // Criar novo registro
    const recordItem = document.createElement('div');
    recordItem.className = 'record-item';
    
    const recordContent = `
        <p class="record-name"> <strong>${form.querySelector('[name="nome"]').value}</strong></p>
        <p class="record-meta">${formatarDataBR(form.querySelector('[name="data"]').value)} <br> | <strong>${form.querySelector('[name="marca"]').value}</strong></p>
        <p class="record-meta">${form.querySelector('[name="especialidade"]').value} (${form.querySelector('[name="pacientes"]').value} pacientes)</p>
        <p class="record-detail">Solicitado por: ${form.querySelector('[name="solicitante"]').value}</p>
        ${form.querySelector('[name="motivo"]').value ? `<p class="record-detail"><strong> Motivo: ${form.querySelector('[name="motivo"]').value} </strong></p>` : ''}
    `;
    
    recordItem.innerHTML = recordContent;
    
    // Limpar mensagem de "Nenhum registro" se for o primeiro
    if (recordsList.querySelector('.empty-message')) {
        recordsList.innerHTML = '';
    }
    
    recordsList.prepend(recordItem);
    
    // Limpar formulário
    form.reset();
});

document.getElementById('clearBtn').addEventListener('click', function() {
    if (confirm('Tem certeza que deseja limpar todos os registros?')) {
        const recordsList = document.getElementById('recordsList');
        recordsList.innerHTML = '<p class="empty-message">Nenhum registro adicionado ainda</p>';
    }
});