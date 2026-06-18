(function() {
    let current = 0;
    const total = 3;
    let autoTimer;

    function goSlide(idx) {
        current = (idx + total) % total;
        document.getElementById('hsTrack').style.transform = `translateX(-${current * 100}%)`;
        document.querySelectorAll('.hs-dot').forEach((d, i) => d.classList.toggle('active', i === current));
    }

    window.goSlide = goSlide;
    window.changeSlide = function(dir) { clearInterval(autoTimer); goSlide(current + dir); startAuto(); };

    function startAuto() { autoTimer = setInterval(() => goSlide(current + 1), 5000); }
    startAuto();
})();