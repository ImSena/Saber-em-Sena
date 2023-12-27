window.addEventListener('load', ()=>{
    const year = document.querySelector('span#ano');
    const ano = new Date().getFullYear();

    year.innerHTML = ano
})
