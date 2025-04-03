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

function reverseFormatDate(dateStr) {
    const [dia, mes, ano] = dateStr.split('/');
    return `${ano}-${mes}-${dia}`;
}

document.getElementById('submitBtn').addEventListener('click', function() {
    const form = document.getElementById('bloco-form');
    const recordsList = document.getElementById('recordsList');
    
    // Verificar se todos os campos estão preenchidos (exceto motivo que é opcional)
    let allFilled = true;
    const requiredInputs = form.querySelectorAll('input:not([name="motivo"]), textarea:not([name="motivo"]), select');
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
        <div class="record-header">
            <p class="record-name"><strong>${form.querySelector('[name="nome"]').value}</strong></p>
            <div class="record-actions">
                <button class="btn-edit">✏️ Editar</button>
                <button class="btn-delete">🗑️ Excluir</button>
            </div>
        </div>
        <p class="record-meta">${formatarDataBR(form.querySelector('[name="data"]').value)} <br> | <strong>${form.querySelector('[name="marcas"]').value}</strong></p>
        <p class="record-meta">${form.querySelector('[name="especialidade"]').value} (${form.querySelector('[name="pacientes"]').value} pacientes)</p>
        <p class="record-detail">Solicitado por: ${form.querySelector('[name="solicitante"]').value}</p>
        ${form.querySelector('[name="motivo"]').value ? `<p class="record-detail"><strong>Motivo: ${form.querySelector('[name="motivo"]').value}</strong></p>` : ''}
    `;
    
    recordItem.innerHTML = recordContent;
    
    // Adiciona evento de deletar
    recordItem.querySelector('.btn-delete').addEventListener('click', function() {
        if (confirm('Tem certeza que deseja excluir este registro?')) {
            recordItem.remove();
            
            // Se não houver mais registros, mostra a mensagem
            if (recordsList.children.length === 0) {
                recordsList.innerHTML = '<p class="empty-message">Nenhum registro adicionado ainda</p>';
            }
        }
    });
    
    // Adiciona evento de editar
    recordItem.querySelector('.btn-edit').addEventListener('click', function() {
        // Preenche o formulário com os dados do registro
        form.querySelector('[name="nome"]').value = recordItem.querySelector('.record-name').textContent.trim();
        form.querySelector('[name="data"]').value = reverseFormatDate(recordItem.querySelector('.record-meta').textContent.split('|')[0].trim());
        form.querySelector('[name="marcas"]').value = recordItem.querySelector('.record-meta strong').textContent;
        form.querySelector('[name="especialidade"]').value = recordItem.querySelector('.record-meta:nth-of-type(2)').textContent.split('(')[0].trim();
        form.querySelector('[name="pacientes"]').value = recordItem.querySelector('.record-meta:nth-of-type(2)').textContent.match(/\((\d+)/)[1];
        form.querySelector('[name="solicitante"]').value = recordItem.querySelector('.record-detail').textContent.replace('Solicitado por: ', '').trim();
        
        const motivoElement = recordItem.querySelector('.record-detail strong');
        form.querySelector('[name="motivo"]').value = motivoElement ? motivoElement.textContent.replace('Motivo: ', '').trim() : '';
        
        // Remove o registro sendo editado
        recordItem.remove();
        
        // Foca no primeiro campo para edição
        form.querySelector('[name="nome"]').focus();
    });
    
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