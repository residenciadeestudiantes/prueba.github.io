document.addEventListener('DOMContentLoaded', function() {
    var controller = new ScrollMagic.Controller();
  
    // Animación para los elementos <mark>
    const subrayados = document.querySelectorAll('mark');
    subrayados.forEach((subrayado) => {
      new ScrollMagic.Scene({
        triggerElement: subrayado,
        triggerHook: 0.7,
        reverse: true
      
      })
        .setClassToggle(subrayado, 'active')
        .addTo(controller);
    });
  });
  