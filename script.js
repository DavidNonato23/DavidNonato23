document.addEventListener('DOMContentLoaded', () => {
    // =========================================================================
    // SELEÇÃO DE ELEMENTOS DOM
    // =========================================================================
    const menuToggle = document.querySelector('.menu-toggle');
    const closeSidebarButton = document.querySelector('.close-sidebar');
    const sidebar = document.querySelector('.sidebar');
    const sidebarLinks = document.querySelectorAll('.sidebar-nav a');
    const sections = document.querySelectorAll('section[id]');
    const datetimeDisplay = document.getElementById('datetime-display');
    const header = document.querySelector('.main-header');

    // =========================================================================
    // FUNÇÃO UTILITÁRIA: THROTTLE (Para otimização de performance)
    // =========================================================================
    const throttle = (func, limit) => {
        let inThrottle;
        return function(...args) {
            if (!inThrottle) {
                func.apply(this, args);
                inThrottle = true;
                setTimeout(() => inThrottle = false, limit);
            }
        };
    };

    // =========================================================================
    // LÓGICA DA SIDEBAR
    // =========================================================================
    const openSidebar = () => sidebar.classList.add('active');
    const closeSidebar = () => sidebar.classList.remove('active');

    const closeSidebarOnClickOutside = (event) => {
        if (sidebar.classList.contains('active') && !sidebar.contains(event.target) && !menuToggle.contains(event.target)) {
            closeSidebar();
        }
    };

    if (menuToggle) menuToggle.addEventListener('click', openSidebar);
    if (closeSidebarButton) closeSidebarButton.addEventListener('click', closeSidebar);
    document.addEventListener('click', closeSidebarOnClickOutside);

    // =========================================================================
    // DESTAQUE DE LINK ATIVO NA SIDEBAR COM SCROLL OTIMIZADO
    // =========================================================================
    const highlightActiveLink = () => {
        const scrollY = window.pageYOffset;
        let currentSectionId = '';

        sections.forEach(section => {
            const sectionTop = section.offsetTop - header.offsetHeight - 20;
            if (scrollY >= sectionTop) {
                currentSectionId = section.getAttribute('id');
            }
        });

        sidebarLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href')?.substring(1) === currentSectionId) {
                link.classList.add('active');
            }
        });
    };

    window.addEventListener('scroll', throttle(highlightActiveLink, 150));
    highlightActiveLink();

    // =========================================================================
    // ROLAGEM SUAVE AO CLICAR NOS LINKS DA SIDEBAR
    // =========================================================================
    sidebarLinks.forEach(link => {
        link.addEventListener('click', function(event) {
            event.preventDefault();
            closeSidebar();
            
            const targetId = this.getAttribute('href');
            const targetElement = document.querySelector(targetId);
            
            if (targetElement) {
                const offsetPosition = targetElement.offsetTop - header.offsetHeight - 15;
                window.scrollTo({ top: offsetPosition, behavior: "smooth" });
            }
        });
    });

    // =========================================================================
    // ANIMAÇÃO DE FADE-IN PARA SEÇÕES (Intersection Observer)
    // =========================================================================
    const sectionObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('fade-in-visible');
            }
        });
    }, { threshold: 0.1 });

    document.querySelectorAll('.section-content').forEach(section => {
        sectionObserver.observe(section);
    });

    // =========================================================================
    // LÓGICA PARA DETALHES DOS PROJETOS
    // =========================================================================
    document.querySelectorAll('.details-button').forEach(button => {
        button.addEventListener('click', () => {
            const targetId = button.getAttribute('data-target');
            const detailsDiv = document.getElementById(targetId);
            
            if (detailsDiv) {
                detailsDiv.classList.toggle('visivel');
                button.textContent = detailsDiv.classList.contains('visivel') ? 'Ocultar Detalhes' : 'Ver Detalhes';
            }
        });
    });
    
    // =========================================================================
    // LÓGICA PARA FILTRAR PROJETOS
    // =========================================================================
    const filterButtons = document.querySelectorAll('.filter-btn');
    const projectCards = document.querySelectorAll('.project-card');

    filterButtons.forEach(button => {
        button.addEventListener('click', () => {
            filterButtons.forEach(btn => btn.classList.remove('active'));
            button.classList.add('active');

            const filterValue = button.getAttribute('data-filter');
            
            projectCards.forEach(card => {
                card.classList.toggle('hide', !(filterValue === 'all' || card.dataset.category.includes(filterValue)));
            });
        });
    });
    
    // =========================================================================
    // DATA E HORA ATUALIZADAS (Com Timezone de Salvador)
    // =========================================================================
    function updateDateTime() {
        if (!datetimeDisplay) return;
        const now = new Date();
        const formatter = new Intl.DateTimeFormat('pt-BR', {
            dateStyle: 'full',
            timeStyle: 'short',
            timeZone: 'America/Bahia'
        });
        datetimeDisplay.textContent = `${formatter.format(now)}`;
    }
    
    updateDateTime();
    setInterval(updateDateTime, 1000);
});