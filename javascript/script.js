// za animaciju strelice na splash
const arrow = document.querySelector('.scroll-down');
// Za prijelaz na home.html, odabir splash page elementa
const splash = document.querySelector('.splash-page');
// za praćenje vidljivosti
let opacity = 1.0;
// za praćenje dodira na mobitelu
let lastTouchY = 0; 

//klikanje na strelicu 
arrow.addEventListener('click', function(event)
{
    event.preventDefault() // da ne navigira odmah
    splash.classList.add('fade_out');
    // nakon 1 sekunde, prebaci na home.html
    setTimeout(() => {
        window.location.href = "html/home.html";
    }, 1000);
}
);
// čekanje na skrolanje ili pomicanje prema dole s dodirom
window.addEventListener('wheel', handleScroll);
window.addEventListener('touchmove', handleScroll);
window.addEventListener('touchend', () => {
    lastTouchY = 0; // za reset kad prestane dodir
});

function handleScroll(event) {
    let delta = 0;

    if (event.type === 'wheel') {
        delta = event.deltaY; // za skrol na računalu i detekciju smjera
    } else if (event.type === 'touchmove') {
        if (lastTouchY) {
            delta = lastTouchY - event.touches[0].clientY; // ako je pozitivnoi ide prema dole
        }
        lastTouchY = event.touches[0].clientY;
    }

 
    if (delta > 0) {
         // ako je pozitivno, ide prema dole, znači smanji vidljivost
        opacity -= 0.05;
    } else if (delta < 0) {
        opacity += 0.05;
    }

    //da ne ide više od 1 i manje od 0
    opacity = Math.max(0, Math.min(1, opacity));
    splash.style.opacity = opacity;

     // kad je blizu 0, prebaci na home.html
     if (opacity <= 0) {
        splash.classList.add('fade_out');
        // nakon 1 sekunde, prebaci na home.html
        setTimeout(() => {
            window.location.href = "html/home.html";
        }, 500);
    }
}

