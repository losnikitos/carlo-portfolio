// scrroll to top animation
$('a[href=\'#top\']').click(function () {
    $('html, body').animate({scrollTop: 0}, 1000);
    return false;
});

const isMobile = $(window).width() < 576;
const offset = isMobile ? 200 : 0;
const firstOffset = 50; // to give place for menu on mobile

function getPosition(elem) {
    const top = $(elem).offset().top;
    const bottom = top + $(elem).outerHeight();
    return {top, bottom};
}

function getViewport() {
    const top = $(window).scrollTop();
    const bottom = top + $(window).height();
    return {top, bottom}
}

const sectionElems = document.querySelectorAll('#works > section[id]');

const ids = Array.prototype.slice.call(sectionElems).map(section => section.id);

const sections = ids.map(id => {
    const sectionElem = document.getElementById(id);
    const linkElem = document.querySelector(`[href="#${id}"]`);
    const visible = false;
    return {id, sectionElem, linkElem, visible};
});

function onScroll() {

    const {top: viewportTop, bottom: viewportBottom} = getViewport();
    const viewportMiddle = viewportTop + (viewportBottom - viewportTop) / 2;
    let somethingAlreadyVisible = false;

    sections.map(section => {
        const {top: sectionTop, bottom: sectionBottom} = getPosition(section.sectionElem);

        // On mobile offset > 0, which means that description shows up *earlier*, than previous section disappears,
        // except for first section description, which shows *later*, than it should (with same offset)
        // On desktop offset = 0
        let visible = sectionBottom > (viewportMiddle + offset) && sectionTop < (viewportMiddle + offset) && (isMobile ? viewportTop > firstOffset : true);

        // make visible only one section at a time
        if (visible && somethingAlreadyVisible) {
            visible = false;
        }
        if (visible) {
            somethingAlreadyVisible = true;
        }

        if (visible !== section.visible) { // visibility changed
            if (visible) {
                section.linkElem.classList.add('active')
            } else {
                section.linkElem.classList.remove('active')
            }
        }
        section.visible = visible
    })
}

$(window).on('resize scroll', throttle(onScroll, 100));

onScroll();

function throttle(func, ms) {
    let isThrottled = false;
    return () => {
        if (isThrottled) {
            return;
        }
        func();
        isThrottled = true;
        setTimeout(() => isThrottled = false, ms);
    }
}
