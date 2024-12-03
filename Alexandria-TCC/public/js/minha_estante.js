function toggleMenu() {
    const sidebar = document.getElementById("sidebar");
    const content = document.getElementById("content");
    sidebar.classList.toggle("collapsed");
    content.classList.toggle("collapsed");
}
function toggleFilterMenu() {
    const filterMenu = document.getElementById('filterMenu');

    filterMenu.style.display = filterMenu.style.display === 'block' ? 'none' : 'block';
}

function sortBooks(order) {
    const bookGrid = document.getElementById('bookGrid'); 
    const books = Array.from(bookGrid.querySelectorAll('.book-card')); 

    books.sort((a, b) => {
        const titleA = a.querySelector('.book-title').textContent.toLowerCase();
        const titleB = b.querySelector('.book-title').textContent.toLowerCase();

        if (order === 'a-z') {
            return titleA.localeCompare(titleB); 
        } else if (order === 'z-a') {
            return titleB.localeCompare(titleA); 
        }
    });

    books.forEach(book => bookGrid.appendChild(book));

    document.getElementById('filterMenu').style.display = 'none';
}

window.addEventListener('click', (e) => {
    const filterMenu = document.getElementById('filterMenu');
    const filterButton = document.querySelector('.filter-button');

    if (!filterMenu.contains(e.target) && !filterButton.contains(e.target)) {
        filterMenu.style.display = 'none';
    }
});
document.addEventListener('DOMContentLoaded', () => {
    const links = document.querySelectorAll('.sidebar-link');

    links.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault(); 
           
            links.forEach(item => item.classList.remove('active'));

            
            link.classList.add('active');
        });
    });
});

document.querySelectorAll('.editar').forEach(button => {
    button.addEventListener('click', () => {
       
        window.location.href = 'perfil_livro_usuario.html';
    });
});
document.addEventListener("DOMContentLoaded", () => {
   
    const detalhesButtons = document.querySelectorAll(".detalhes");

    detalhesButtons.forEach(button => {
        button.addEventListener("click", () => {
            window.location.href = "../pages/livro.html"; 
        });
    });

    const tenhoButtons = document.querySelectorAll(".tenho");

    tenhoButtons.forEach(button => {
        button.addEventListener("click", () => {
            window.location.href = "../pages/cadastro_livro.html"; 
        });
    });

    const trocaButtons = document.querySelectorAll(".troca");

    trocaButtons.forEach(button => {
        button.addEventListener("click", () => {
            window.location.href = "../pages/chat.html"; 
        });
    });
    const clienteButtons = document.querySelectorAll(".livro-cliente");

    clienteButtons.forEach(button => {
        button.addEventListener("click", () => {
            window.location.href = "../pages/perfil_livro_cliente.html"; 
        });
    });
});


toggleMenu();