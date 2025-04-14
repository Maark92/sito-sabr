document.addEventListener('DOMContentLoaded', function() {
    // Verifica se il popup è già stato mostrato in questa sessione
    if (!sessionStorage.getItem('popupMostrato')) {
        // Mostra il popup dopo 2 secondi
        setTimeout(function() {
            document.querySelector('.popup-overlay').classList.add('active');
        }, 2000);

        // Salva che il popup è stato mostrato
        sessionStorage.setItem('popupMostrato', 'true');
    }

    // Chiudi popup quando si clicca sulla X
    document.querySelector('.popup-close').addEventListener('click', function() {
        document.querySelector('.popup-overlay').classList.remove('active');
    });

    // Chiudi popup quando si clicca fuori
    document.querySelector('.popup-overlay').addEventListener('click', function(e) {
        if (e.target === this) {
            this.classList.remove('active');
        }
    });
});
