document.addEventListener('DOMContentLoaded', () => {
    const downloadButton = document.querySelector('.btn-download');
    const cvImage = document.querySelector('.cv-image');

    cvImage.classList.add('fade-in', 'image-animation');
    downloadButton.classList.add('fade-in', 'button-animation');

    downloadButton.addEventListener('click', (event) => {
        event.preventDefault(); 
        showConfirmationModal();  // poziv funkcije za prikaz potvrde
    });

    // funkcija za prikaz potvrde
    function showConfirmationModal(onConfirm) {
        // da se makne postojeća potvrda i uvijek stvori nova
        d3.select('#modal-container').selectAll('*').remove();

        // stvaranje potvrde - pozadina i centriranje
        const modal = d3.select('#modal-container')
            .append('div')
            .attr('class', 'modal-backdrop')
            .style('position', 'fixed')
            .style('top', '0')
            .style('left', '0')
            .style('width', '100%')
            .style('height', '100%')
            .style('background-color', 'rgba(0, 0, 0, 0.5)')
            .style('display', 'flex')
            .style('justify-content', 'center')
            .style('align-items', 'center');

        // pravokutnik za potvrdu
        const modalContent = modal.append('div')
            .attr('class', 'modal-content')
            .style('background', '#e0f7fa')
            .style('padding', '20px')
            .style('border-radius', '0px')
            .style('box-shadow', '0 4px 8px rgba(0, 0, 0, 0.2)')
            .style('text-align', 'center')
            .style('max-width', '400px');
        
        // sadržaj
        modalContent.append('p')
            .text('Želite li preuzeti moj životopis?')
            .style('font-size', '18px')
            .style('margin-bottom', '20px');

        // gumbi
        const buttonGroup = modalContent.append('div').style('display', 'flex').style('justify-content', 'space-around');

        // gumb za potvrdu
        buttonGroup.append('button')
            .text('Da')
            .attr('class', 'btn btn-primary')
            .style('padding', '10px 20px')
            .style('background-color', '#364f59')
            .style('color', '#e0f7fa')
            .style('border', 'none')
            .style('border-radius', '0px')
            .on('click', () => {
                window.open(downloadButton.href, '_blank');
                modal.remove(); 
            });

        // gumb za otkazivnje
        buttonGroup.append('button')
            .text('Ne')
            .attr('class', 'btn btn-secondary')
            .style('padding', '10px 20px')
            .style('background-color', '#e0f7fa')
            .style('color', '#364f59')
            .style('border', '1px solid #364f59')
            .style('border-radius', '0px')
            .on('click', () => {
                modal.remove(); 
            });
    }
});
