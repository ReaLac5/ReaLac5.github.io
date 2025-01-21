 document.addEventListener('DOMContentLoaded', () => {
            const technologiesText = document.querySelector('.technologies-text');
            const technologiesTextContainer = document.querySelector('.technologies-text-container');

            technologiesTextContainer.addEventListener('mouseover', () => {
                technologiesText.style.background = 'linear-gradient(45deg, #8cd0d9, #bae1e0)';
                technologiesText.style.color = '#364f59'; 
            });
            
            technologiesTextContainer.addEventListener('mouseout', () => {
                technologiesText.style.background = '';  
                technologiesText.style.color = '';  
            });


            const sections = document.querySelectorAll('.sections');

            // da na početku ne budu vidljive sekcije
            sections.forEach(section => {
                section.classList.add('section-hidden');
            });

            // funkcija za observera
            const observerCallback = (entries, observer) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        entry.target.classList.add('section-visible');
                        observer.unobserve(entry.target); 
                    }
                });
            };

            // za kreiranje observera pomoću prethodne funkcije
            const observer = new IntersectionObserver(observerCallback, {
                threshold: 0.7 //kada se vidi toliko posto da pokrene animaciju
            });

            // da se pokrene i iskoristi observer za praćenje sekcija
            sections.forEach(section => {
                observer.observe(section);
            });

            // za animaciju vještina
            document.querySelectorAll('.skills-tag-cloud span').forEach(skill => {
                skill.addEventListener('mouseover', () => {
                    skill.classList.add('animate-skill');
                });
                skill.addEventListener('animationend', () => {
                    skill.classList.remove('animate-skill');
                });
            });
});

