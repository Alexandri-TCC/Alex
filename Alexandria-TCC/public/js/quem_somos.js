document.addEventListener('DOMContentLoaded', () => {
  
const hiddenElements = document.querySelectorAll('.animacao');


const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            
            entry.target.classList.add('aparecer');
        } else {
            
            entry.target.classList.remove('aparecer');
        }
    });
}, { threshold: 0.1 }); 

hiddenElements.forEach(element => {
    observer.observe(element);
});

});
