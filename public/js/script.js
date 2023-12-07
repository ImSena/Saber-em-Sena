const camposAdicionais = document.querySelector('div#camposAdicionais');
const addBtn = document.querySelector('button.add');
const select = document.querySelector('select#opcaoInput');
const btnPreview = document.querySelector('button#preview');
const title = document.querySelector('textarea#title');
const subtitle = document.querySelector('textarea#subt');
const msgt = document.querySelector('p#t');
const msgs = document.querySelector('p#s');

function preview(event) {
    const fileInput = event.target;
    const files = fileInput.files;

    if (files.length > 0) {
        const file = files[0];

        if (file.type.startsWith('image/')) {
            const reader = new FileReader();

            reader.onload = function (e) {
                // Aqui, você está selecionando todas as imagens com a classe '.preview'.
                // Precisamos garantir que estamos selecionando a imagem correta.
                const imagePreview = fileInput.closest('.campoAdd').querySelector('.preview');
                imagePreview.src = e.target.result;
                imagePreview.style.display = 'block';
            };

            reader.readAsDataURL(file);
        } else {
            alert('Por favor, selecione um arquivo de imagem válido.');
            fileInput.value = ''; // Limpa o valor do input para que o mesmo arquivo possa ser selecionado novamente
        }
    }
}

async function readImage(file) {
    return new Promise((resolve) => {
        const reader = new FileReader();
        reader.onload = function (e) {
            resolve(e.target.result);
        };
        reader.readAsDataURL(file);
    });
}

function addFild(value) {
    if (value === 'textarea') {
        const div = document.createElement('div');
        div.className = 'campoAdd';

        const label = document.createElement('label');
        label.textContent = 'Adicione um texto';
        div.appendChild(label);

        const textarea = document.createElement('textarea');
        textarea.placeholder = 'Digite um texto';
        textarea.name = 'textContent';
        div.appendChild(textarea);

        const p = document.createElement('p');
        p.className = 'msg';
        div.appendChild(p);

        const deleteButton = document.createElement('button');
        deleteButton.type = 'button';
        deleteButton.id = 'deleteCampo';
        deleteButton.textContent = 'Deletar';
        deleteButton.addEventListener('click', () => {
            div.remove();
        });
        div.appendChild(deleteButton);
        
        camposAdicionais.appendChild(div);

        textarea.maxLength = 200;

        textarea.addEventListener('input',()=>{
            const resto = 200 - textarea.value.length;
            if(resto <= 30){
                p.innerText = 'Restam '+resto;
                if(resto == 0){
                    p.innerHTML = 'Esgotou o limite'
                }
            }else{
                p.innerHTML = '';
            }
        })
    } else {
        const div = document.createElement('div');
        div.className = 'campoAdd';
        const img = document.createElement('img');
        img.src = '#';
        img.className = 'preview'
        const input = document.createElement('input');
        input.type = 'file';
        input.name = 'image';

        div.appendChild(img);
        div.appendChild(input);

        const deleteButton = document.createElement('button');
        deleteButton.type = 'button';
        deleteButton.id = 'deleteCampo';
        deleteButton.textContent = 'Deletar';
        deleteButton.addEventListener('click', () => {
            input.remove();
            deleteButton.remove();
        });
        div.appendChild(deleteButton);
        camposAdicionais.appendChild(div);

        input.addEventListener('change', preview);
    }
}

addBtn.addEventListener('click', () => {
    const value = select.value;

    addFild(value)
});

btnPreview.addEventListener('click', async () => {
    const form = document.querySelector('form#formPost');
    const formData = new FormData(form);
    let previewContent = `
        <div style="max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f8f8f8; font-family: Arial, sans-serif;">
    `;

    for (const [key, value] of formData.entries()) {
        if (key === 'title') {
            previewContent += `<h1 id='title'>${value}</h1>`;
        } else if (key === 'subtitle') {
            previewContent += `<h2 id='subtitle'>${value}</h2>`;
        } else if (key === 'textContent') {
            previewContent += `<p class='conteudo'>${value}</p>`;
        } else if (key === 'image' && value instanceof File) {
            const imgSrc = await readImage(value);
            previewContent += `<img src="${imgSrc}" alt="Imagem" class='preview'/>`;
        }
    }

    previewContent += '</div>';

    // Abrindo a visualização simulada em uma nova guia/janela
    const previewWindow = window.open('', '_blank');
    previewWindow.document.write(`
        <!DOCTYPE html>
        <html lang="pt-br">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Visualização Simulada</title>
            <link rel="preconnect" href="https://fonts.googleapis.com">
            <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
            <link href="https://fonts.googleapis.com/css2?family=Roboto:wght@400;700&display=swap" rel="stylesheet">
            <style>
                * {
                    margin: 0;
                    padding: 0;
                    box-sizing: border-box;
                }
                body {
                    font-family: 'Roboto', sans-serif;
                }
                #container {
                    max-width: 600px;
                    margin: 20px auto;
                }
                h1 {
                    color: #333;
                    margin-bottom: 10px;
                }
                h2 {
                    color: #555;
                    margin-bottom: 20px;
                }
                .conteudo {
                    color: #666;
                    line-height: 1.6;
                }
                .preview {
                    max-width: 100%;
                    margin-bottom: 20px;
                }
            </style>
        </head>
        <body>
            <div id='container'>
                <h1>Pré-Visualização</h1>
                ${previewContent}
            </div>
        </body>
        </html>
    `);
});

title.addEventListener('input', ()=>{
   const resto = 50 - title.value.length;


   if(resto <= 10){
        msgt.innerHTML = 'Faltam apenas '+resto+' caracter';
   }else{
        msgt.innerHTML = '';
   }
})

subtitle.addEventListener('input', ()=>{
    const resto = 60 - title.value.length;
 
 
    if(resto <= 10){
         msgs.innerHTML = 'Faltam apenas '+resto+' caracter';
    }else{
         msgs.innerHTML = '';
    }
 })