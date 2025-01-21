document.addEventListener('DOMContentLoaded', () => {
    const contactCard = document.querySelector('.contact-card');
    const contactForm = document.querySelector('.contact-form');
    const contactTitle = document.querySelector('.contact-title');

    contactCard.classList.add('scale-bounce', 'card-animation');
    contactForm.classList.add('scale-bounce', 'form-animation');
    contactTitle.classList.add('scale-bounce', 'form-animation');

    // dohvaćanje polja s d3
    const nameField = d3.select('#name');
    const emailField = d3.select('#email');
    const subjectField = d3.select('#subject');
    const messageField = d3.select('#message');
    const submitButton = d3.select('#btn-submit');

    // za provjeru ak oje sve ispunjeno
    function checkFields() {
        const isFilled = nameField.property('value') !== '' &&
                         emailField.property('value') !== '' &&
                         subjectField.property('value') !== '' &&
                         messageField.property('value') !== '';

    
        // onemogućivanje gumba ako nije sve ispunjeno
        submitButton.property('disabled', !(isFilled));
    }

    // praćenje inputa za svako polje
    nameField.on('input', checkFields);
    emailField.on('input', checkFields);
    subjectField.on('input', checkFields);
    messageField.on('input', checkFields);

    // kad napusti polje maila da provjeri ako ima @
    emailField.on('blur', function() {
        const emailValue = emailField.property('value');
        // ako je -1 znači da nema @
        if (emailValue.indexOf('@') === -1) {
            emailField.style('border', '2px solid red');
            emailField.property('value', ''); 
            emailField.attr('placeholder', 'Neispravan unos, Email mora sadržavati "@"');
            submitButton.property('disabled', true); 
        } else {
            // za reset polja
            emailField.style('border', '1px solid #ced4da');
            emailField.attr('placeholder', 'Email');
        }
    });

    // za potvrdu slanja maila
    submitButton.on('click', function(event) {
        event.preventDefault();  // da se submita formu

        // prikaz alerta
        d3.select('body')
        .append('div')
        .attr('id', 'alert')
        .attr('style', 'position: fixed; top: 0; left: 0; width: 100%; height: 100%; background-color: rgba(255, 255, 255, 0.7); z-index: 999;') 
        .append('div')
        .attr('style', 'position: fixed; top: 50%; left: 50%; transform: translate(-50%, -50%); background-color: #364f59; color: white; padding: 50px; text-align: center; font-size: 20px; z-index: 1000;')
        .text('Email je uspješno poslan!');

        // da se makne alert nakon 3 sekunde
        setTimeout(() => {
            d3.select('#alert').remove();
        }, 2000);

        d3.select('#name').property('value', '');
        d3.select('#email').property('value', '');
        d3.select('#subject').property('value', '');
        d3.select('#message').property('value', '');
        submitButton.property('disabled', true);
    });

    checkFields();
});
