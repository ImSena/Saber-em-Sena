const camposAdicionais = document.querySelector('div#camposAdicionais');
const addBtn = document.querySelector('button#add');
const select = document.querySelector('select#opcaoInput');

function addFild(value) {
    if (value === 'textarea') {
        const div = document.createElement('div');
        div.id = 'campoAdd';

        const label = document.createElement('label');
        label.textContent = 'Adicione um texto';
        div.appendChild(label);

        const textarea = document.createElement('textarea');
        textarea.placeholder = 'Digite um texto';
        textarea.name = 'textContent';
        div.appendChild(textarea);

        const deleteButton = document.createElement('button');
        deleteButton.type = 'button';
        deleteButton.id = 'deleteCampo';
        deleteButton.textContent = 'Deletar';
        deleteButton.addEventListener('click', () => {
            div.remove();
        });
        div.appendChild(deleteButton);

        camposAdicionais.appendChild(div);
    } else {
        const div = document.createElement('div');
        div.id = 'campoAdd';
        const input = document.createElement('input');
        input.type = 'file';
        input.name = 'image';
        div.appendChild(input);

        const deleteButton = document.createElement('button');
        deleteButton.type = 'button';
        deleteButton.id = 'deleteCampo';
        deleteButton.textContent = 'Deletar';
        deleteButton.addEventListener('click', () => {
            input.remove();
            deleteButton.remove(); // Se desejar remover o botão de deletar junto
        });
        div.appendChild(deleteButton);
        camposAdicionais.appendChild(div);
    }
}

addBtn.addEventListener('click', () => {
    const value = select.value;

    addFild(value)
})