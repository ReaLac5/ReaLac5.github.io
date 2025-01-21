document.addEventListener('DOMContentLoaded', () => {
            const sections = document.querySelectorAll('.project-section');

            // da na početku ne budu vidljive sekcije
            sections.forEach(section => {
                section.classList.add('project-section-hidden');
            });

            // funkcija za observera
            const observerCallback = (entries, observer) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        entry.target.classList.add('project-section-visible');
                        observer.unobserve(entry.target); 
                    }
                });
            };

            // za kreiranje observera pomoću prethodne funkcije
            const observer = new IntersectionObserver(observerCallback, {
                threshold: 0.9 //kada se vidi toliko posto da pokrene animaciju
            });

            // da se pokrene i iskoristi observer za praćenje sekcija
            sections.forEach(section => {
                observer.observe(section);
            });


            const images = document.querySelectorAll('.result-image');

            images.forEach(image => {
                image.addEventListener('click', () => {
                    // kreiranje dinamičnog modala
                    const overlay = document.createElement('div');
                    overlay.style.position = 'fixed';
                    overlay.style.top = '0';
                    overlay.style.left = '0';
                    overlay.style.width = '100%';
                    overlay.style.height = '100%';
                    overlay.style.backgroundColor = 'rgba(0, 0, 0, 0.8)';
                    overlay.style.display = 'flex';
                    overlay.style.justifyContent = 'center';
                    overlay.style.alignItems = 'center';
                    overlay.style.zIndex = '1000';

                    // kreiranje povećane slike
                    const enlargedImg = document.createElement('img');
                    enlargedImg.src = image.src;
                    enlargedImg.style.maxWidth = '90%';
                    enlargedImg.style.maxHeight = '90%';
                    enlargedImg.style.border = '2px solid white';
                    enlargedImg.style.boxShadow = '0 4px 8px rgba(255, 255, 255, 0.2)';
                    enlargedImg.style.cursor = 'pointer';

                    // dodavanje slike na modal
                    overlay.appendChild(enlargedImg);

                    // dodavanje modala na body od html dokumenta
                    document.body.appendChild(overlay);

                    // micanje modala s ekrana 
                    overlay.addEventListener('click', () => {
                        document.body.removeChild(overlay);
                    });
                });
            });

});