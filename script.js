document.addEventListener('DOMContentLoaded', () => {
    // Seleção de todos os elementos DOM necessários
    const menuToggle = document.querySelector('.menu-toggle');
    const closeSidebarButton = document.querySelector('.close-sidebar');
    const sidebar = document.querySelector('.sidebar');
    const sidebarLinks = document.querySelectorAll('.sidebar-nav ul li a');
    const mainContentArea = document.getElementById('main-content-area');
    const sections = document.querySelectorAll('.section-content');
    const datetimeDisplay = document.getElementById('datetime-display');

    // --- Funções para controle da Sidebar ---
    const openSidebar = () => {
        sidebar.classList.add('active');
        mainContentArea.classList.add('sidebar-open');
        // Adiciona um listener para fechar a sidebar ao clicar fora, mas apenas quando ela está aberta
        document.addEventListener('click', closeSidebarOnClickOutside);
    };

    const closeSidebarFunction = () => {
        sidebar.classList.remove('active');
        mainContentArea.classList.remove('sidebar-open');
        // Remove o listener de clique fora quando a sidebar é fechada
        document.removeEventListener('click', closeSidebarOnClickOutside);
    };

    const closeSidebarOnClickOutside = (event) => {
        // Verifica se o clique não foi dentro da sidebar e não foi no botão de toggle
        if (!sidebar.contains(event.target) && !menuToggle.contains(event.target)) {
            closeSidebarFunction();
        }
    };

    // Event Listeners para abrir e fechar a sidebar
    if (menuToggle) {
        menuToggle.addEventListener('click', openSidebar);
    }
    if (closeSidebarButton) {
        closeSidebarButton.addEventListener('click', closeSidebarFunction);
    }

    // --- Lógica para destacar o link ativo na sidebar e fechar ao clicar ---
    const highlightActiveLink = () => {
        let current = '';
        const scrollY = window.pageYOffset;

        sections.forEach(section => {
            const sectionTop = section.offsetTop - (document.querySelector('.main-header').offsetHeight || 0) - 20; // Ajuste para a altura do cabeçalho
            const sectionHeight = section.clientHeight;
            if (scrollY >= sectionTop && scrollY < sectionTop + sectionHeight) {
                current = section.getAttribute('id');
            }
        });

        sidebarLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href').includes(current)) {
                link.classList.add('active');
            }
        });
    };

    // Adiciona listener para rolar a página
    window.addEventListener('scroll', highlightActiveLink);
    // Destaca o link ativo na carga inicial
    highlightActiveLink();

    // Fecha a sidebar e destaca o link ao clicar em um item da sidebar
    sidebarLinks.forEach(link => {
        link.addEventListener('click', function(event) {
            // event.preventDefault(); // Comentar ou remover se a rolagem suave for tratada pelo CSS (scroll-behavior: smooth)
            closeSidebarFunction(); // Fecha a sidebar
            // highlightActiveLink(); // Re-destaca o link após a rolagem (se necessário, pode ser redundante com o listener de scroll)
            
            // Rolagem suave manual se scroll-behavior não for suficiente ou para maior controle
            const targetId = this.getAttribute('href').substring(1);
            const targetElement = document.getElementById(targetId);
            if (targetElement) {
                const headerOffset = document.querySelector('.main-header').offsetHeight || 0;
                const elementPosition = targetElement.getBoundingClientRect().top + window.pageYOffset;
                const offsetPosition = elementPosition - headerOffset - 20; // Mais um pequeno padding

                window.scrollTo({
                    top: offsetPosition,
                    behavior: "smooth"
                });
            }
        });
    });

    // --- Efeito de fade-in para seções ---
    const observerOptions = {
        root: null, // viewport como root
        rootMargin: '0px',
        threshold: 0.1 // 10% da seção visível para acionar
    };

    const sectionObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('fade-in-visible');
                // observer.unobserve(entry.target); // Para de observar depois de visível (animação única)
            } else {
                // Remove a classe se sair da viewport para animação repetida ao rolar para cima e para baixo
                // entry.target.classList.remove('fade-in-visible');
            }
        });
    }, observerOptions);

    sections.forEach(section => {
        sectionObserver.observe(section);
    });

    // Animação de digitação para o tagline (opcional, pode ser removida se não desejar)
    // const taglineElement = document.querySelector('.tagline');
    // if (taglineElement) {
    //     const originalTagline = taglineElement.textContent;
    //     taglineElement.textContent = ''; // Limpa o texto original

    //     let i = 0;
    //     function typeWriter() {
    //         if (i < originalTagline.length) {
    //             taglineElement.textContent += originalTagline.charAt(i);
    //             i++;
    //             setTimeout(typeWriter, 50); // Ajuste a velocidade de digitação aqui
    //         }
    //     }
    //     typeWriter();
    // }

    // Lógica para expandir/recolher detalhes do projeto
    const detailsButtons = document.querySelectorAll('.details-button');
    detailsButtons.forEach(button => {
        button.addEventListener('click', () => {
            // Usa o data-target para encontrar o div de detalhes correspondente
            const targetId = button.getAttribute('data-target');
            const detailsDiv = document.getElementById(targetId + '-detalhes'); // Assumindo padrão ID-detalhes

            if (detailsDiv) {
                if (detailsDiv.classList.contains('detalhes-ocultos')) {
                    detailsDiv.classList.remove('detalhes-ocultos');
                    detailsDiv.style.display = 'block'; // Garante que é visível
                    button.textContent = 'Ocultar Detalhes';
                } else {
                    detailsDiv.classList.add('detalhes-ocultos');
                    detailsDiv.style.display = 'none'; // Garante que é escondido
                    button.textContent = 'Ver Detalhes';
                }
            }
        });
    });

    // Oculta todos os detalhes inicialmente ao carregar a página
    document.querySelectorAll('.detalhes-ocultos').forEach(div => {
        div.style.display = 'none';
    });

    // --- Lógica para exibir data e hora atual no footer ---
    function updateDateTime() {
        const now = new Date();
        const options = {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit',
            hour12: false // Formato 24h
        };
        // Formato para Luziânia, GO, Brasil (-03:00)
        const formattedDateTime = now.toLocaleString('pt-BR', options) + ' (-03:00)';
        if (datetimeDisplay) {
            datetimeDisplay.textContent = `Última atualização: ${formattedDateTime}`;
        }
    }

    // Atualiza a data/hora a cada segundo
    setInterval(updateDateTime, 1000);
    // Chama a função uma vez ao carregar para exibir imediatamente
    updateDateTime();


    // --- Lógica para filtrar projetos ---
    const filterButtons = document.querySelectorAll('.filter-btn');
    const projectCards = document.querySelectorAll('.project-card');

    filterButtons.forEach(button => {
        button.addEventListener('click', () => {
            // Remove a classe 'active' de todos os botões
            filterButtons.forEach(btn => btn.classList.remove('active'));
            // Adiciona a classe 'active' ao botão clicado
            button.classList.add('active');

            const filterValue = button.getAttribute('data-filter');

            projectCards.forEach(card => {
                const categories = card.getAttribute('data-category').split(' '); // Divide as categorias por espaço
                if (filterValue === 'all' || categories.includes(filterValue)) {
                    card.style.display = 'flex'; // Mostra o cartão
                } else {
                    card.style.display = 'none'; // Esconde o cartão
                }
            });
        });
    });

    // Garante que todos os projetos são visíveis no carregamento inicial se "Todos" estiver ativo
    // Ou pode simular um clique no botão "Todos"
    document.querySelector('.filter-btn[data-filter="all"]').click();
});