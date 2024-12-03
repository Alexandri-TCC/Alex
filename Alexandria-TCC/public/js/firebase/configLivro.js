const chaves = [
    "AIzaSyCQPl9y2sEgBYOfalW6DneZFwVoi3hnA0M",
    "AIzaSyAD106SBzVbeKN1Akxm8EOd8vDNgA4vsOc",
    "AIzaSyCSUsb2IjSgUuimC5J6zwzED5BS0BAcrT8",
    "AIzaSyDgjExg9i3vYUPKbZb6LHcYodVdvGmLlm4",
    "AIzaSyA0XWsNMwl0S-lHkVayRWF1BZ0o8xRzjpQ",
    "AIzaSyAxAJAngD6Mmj7pBUsOJea_M2CPRhJid1A"
];

const apiKey = chaves[5]

const buscaLivroTexto = async (pesquisa, inicio) => {
    console.log(apiKey);
    try {
        const resultado = await fetch(
            `https://www.googleapis.com/books/v1/volumes?q=${encodeURIComponent(pesquisa)}&orderBy=relevance&key=${apiKey}&startIndex=${inicio}`
        );
        const info = await resultado.json();

        if (info.totalItems > 0) {
            const Filtrado = info.items.filter(item => {
                const identifiers = item.volumeInfo?.industryIdentifiers;
                return identifiers && (identifiers[0]?.type === 'ISBN_13' || identifiers[0]?.type === 'ISBN_10');
            });

            return Filtrado.map((item) => ({
                titulo: item.volumeInfo?.title || "Desconhecido",
                autor: item.volumeInfo?.authors?.[0] || "Desconhecido",
                sinopse: item.volumeInfo?.description || "Sem descrição.",
                imagem: item.volumeInfo?.imageLinks?.thumbnail || "https://res.cloudinary.com/dwxftry8e/image/upload/v1732737936/Desconhecido_k7agsq.png",
                isbn13: item.volumeInfo?.industryIdentifiers?.[0]?.identifier || "Desconhecido",
                editora: item.volumeInfo?.publisher || "Desconhecida",
                paginas: item.volumeInfo?.pageCount || "?"
            }));
        } else {
            console.log("Sem livros.");
            return [];
        }
    } catch (e) {
        console.error("Erro na busca de livros: ", e);
        return [];
    }
};




const buscaLivroISBN2 = async (pesquisa) => {
    try {
        const resultado = await fetch(
            `https://www.googleapis.com/books/v1/volumes?q=${encodeURIComponent(pesquisa)}&orderBy=relevance&key=${apiKey}&startIndex=0`
        );
        const info = await resultado.json();
        
        if (info.totalItems > 0) {
        console.log(info);
        const item = info.items[0];

            return {
                titulo: item.volumeInfo?.title || "Desconhecido",
                autor: item.volumeInfo?.authors?.[0] || "Desconhecido",
                sinopse: item.volumeInfo?.description || "Sem descrição.",
                imagem: item.volumeInfo?.imageLinks?.thumbnail || "https://res.cloudinary.com/dwxftry8e/image/upload/v1732737936/Desconhecido_k7agsq.png",
                isbn13: item.volumeInfo?.industryIdentifiers?.[0]?.identifier || "Desconhecido",
                editora: item.volumeInfo?.publisher || "Desconhecida",
                paginas: item.volumeInfo?.pageCount || "?"
            };
        } else {
            console.log("Sem livros.")
            return [];
        }
    } catch (e) {
        console.error("Erro na busca de livros: ", e);
        return [];
    }
};


const buscaLivroISBN = async (pesquisa) => {
    try {
        const resultado = await fetch(
            `https://www.googleapis.com/books/v1/volumes?q=isbn:${pesquisa}&key=${apiKey}`
        );
        const info = await resultado.json();
        if (info.totalItems > 0) {
            const item = info.items[0];

            return {
                titulo: item.volumeInfo?.title || "Desconhecido",
                autor: item.volumeInfo?.authors?.[0] || "Desconhecido",
                sinopse: item.volumeInfo?.description || "Sem descrição.",
                imagem: item.volumeInfo?.imageLinks?.thumbnail || "https://res.cloudinary.com/dwxftry8e/image/upload/v1732737936/Desconhecido_k7agsq.png",
                isbn13: item.volumeInfo?.industryIdentifiers?.[0]?.identifier || "Desconhecido",
                editora: item.volumeInfo?.publisher || "Desconhecida",
                paginas: item.volumeInfo?.pageCount || "?"
            };
        } else {
            return buscaLivroISBN2(pesquisa);
        }
    } catch (e) {
        console.log("Sem livros.")
        return [];
    }
};

export {buscaLivroISBN, buscaLivroISBN2, buscaLivroTexto};