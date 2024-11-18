document.addEventListener("DOMContentLoaded", () => {
  const pwShowHide = document.querySelectorAll(".showHidePw");  // Todos os ícones
  const pwFields = document.querySelectorAll(".password");  // Todos os campos de senha

  // Alternar visibilidade da senha
  pwShowHide.forEach((eyeIcon, index) => {
    eyeIcon.addEventListener("click", () => {
      // Obter o campo de senha correspondente ao ícone clicado
      const pwField = pwFields[index];

      // Verificar se o campo de senha é do tipo "password" ou "text"
      if (pwField.type === "password") {
        pwField.type = "text";  // Exibe a senha

        // Muda o ícone para "mostrar"
        eyeIcon.classList.replace("uil-eye-slash", "uil-eye");
      } else {
        pwField.type = "password";  // Oculta a senha

        // Muda o ícone para "ocultar"
        eyeIcon.classList.replace("uil-eye", "uil-eye-slash");
      }
    });
  });
});





$(document).ready(function() {
    $('#mobile_btn').on('click', function () {
        $('#mobile_menu').toggleClass('active');
        $('#mobile_btn').find('i').toggleClass('fa-x');
    });
});

const sections = $('section');
const navItems = $('.nav-item');

$(window).on('scroll', function () {
    const header = $('header');
    const scrollPosition = $(window).scrollTop() - header.outerHeight();

    let activeSectionIndex = 0;

    if (scrollPosition <= 0) {
        header.css('box-shadow', 'none');
    } else {
        header.css('box-shadow', '5px 1px 5px rgba(0, 0, 0, 0.1');
    }

    sections.each(function(i) {
        const section = $(this);
        const sectionTop = section.offset().top - 200;
        const sectionBottom = sectionTop+ section.outerHeight();

        if (scrollPosition >= sectionTop && scrollPosition < sectionBottom) {
            activeSectionIndex = i;
            return false;
        }
    })

    navItems.removeClass('active');
    $(navItems[activeSectionIndex]).addClass('active');
});
