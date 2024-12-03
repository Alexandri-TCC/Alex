document.querySelectorAll('.item-faq').forEach(item => {
    item.addEventListener('click', () => {
      const resposta = item.querySelector('.resposta-faq');
      const toggle = item.querySelector('.toggle-faq');
      
      if (resposta.style.display === 'block') {
        resposta.style.display = 'none';
        item.classList.remove('ativo');
      } else {
        resposta.style.display = 'block';
        item.classList.add('ativo');
      }
    });
  });
  