document.addEventListener("DOMContentLoaded", () => {
    const projectCards = document.querySelectorAll(".project-card");
    
    const onScroll = () => {
        const triggerPoint = window.innerHeight * 0.9; // da se animacija pokrene kada je visina vp * određeni broj (koliko posto da se vidi)
        projectCards.forEach((card, index) => {
            const cardBottom = card.getBoundingClientRect().bottom; // za dobit udaljenost dna kartice i vrha vp
            if (cardBottom < triggerPoint) {
                // alternativne animacije, s lijevo ili desno
                card.classList.add(index % 2 === 0 ? "animate-left" : "animate-right");
                card.classList.remove("hidden");
            }
        });
    };

    // za praćenje skrola pomoću kreirane funkcije
    window.addEventListener("scroll", onScroll);
    onScroll(); // da se odmah pokrene funkcija i ako nema skrola
});


