$(document).ready(function () {
    const $cardsContainer = $('.cards-container');
    const $dotsContainer = $('.card-bar');
    const $prevBtn = $('.button-back');
    const $nextBtn = $('.button-next');

    const originalCards = $cardsContainer.find('.card').toArray();
    let cards = [...originalCards];

    function cloneCards() {
        const clonesBefore = originalCards.map(card => $(card).clone(true)[0]);
        const clonesAfter = originalCards.map(card => $(card).clone(true)[0]);

        $cardsContainer.prepend(clonesBefore);
        $cardsContainer.append(clonesAfter);

        cards = [...clonesBefore, ...originalCards, ...clonesAfter];

        const firstOriginalCard = $(cards[originalCards.length]);
        $cardsContainer.animate({
            scrollLeft: firstOriginalCard.position().left + $cardsContainer.scrollLeft()
        }, 0);
    }

    function initDots() {
        $dotsContainer.empty();
        originalCards.forEach((_, index) => {
            $('<span>').addClass('bar')
                .on('click', () => scrollToOriginalCard(index))
                .appendTo($dotsContainer);
        });
        updateDots();
    }

    function scrollToOriginalCard(index) {
        const targetCard = $(cards[originalCards.length + index]);
        $cardsContainer.animate({
            scrollLeft: targetCard.position().left + $cardsContainer.scrollLeft()
        }, 500);
    }

    function updateDots() {
        const scrollPosition = $cardsContainer.scrollLeft();
        const cardWidth = $(cards[0]).outerWidth(true);
        const activeIndex = Math.round((scrollPosition - (cardWidth * originalCards.length)) / cardWidth) % originalCards.length;
        const normalizedIndex = (activeIndex + originalCards.length) % originalCards.length;

        $dotsContainer.find('.bar').removeClass('active')
            .eq(normalizedIndex).addClass('active');
    }

    function checkBoundaries() {
        const scrollPosition = $cardsContainer.scrollLeft();
        const containerWidth = $cardsContainer.outerWidth();
        const totalWidth = $cardsContainer[0].scrollWidth;

        if (scrollPosition < containerWidth) {
            $cardsContainer.scrollLeft(scrollPosition + (originalCards.length * $(cards[0]).outerWidth(true)));
        }
        else if (scrollPosition > totalWidth - 2 * containerWidth) {
            $cardsContainer.scrollLeft(scrollPosition - (originalCards.length * $(cards[0]).outerWidth(true)));
        }

        updateDots();
    }

    cloneCards();
    initDots();

    $cardsContainer.on('scroll', function () {
        requestAnimationFrame(checkBoundaries);
    });

    $prevBtn.on('click', function () {
        const cardWidth = $(cards[0]).outerWidth(true);
        $cardsContainer.animate({
            scrollLeft: $cardsContainer.scrollLeft() - cardWidth
        }, 300);
    });

    $nextBtn.on('click', function () {
        const cardWidth = $(cards[0]).outerWidth(true);
        $cardsContainer.animate({
            scrollLeft: $cardsContainer.scrollLeft() + cardWidth
        }, 300);
    });

});