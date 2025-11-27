 // ===== ESCONDER/MOSTRAR HEADER AO ROLAR =====
        let lastScrollTop = 0;
        let scrollTimeout;
        const mobileHeader = document.querySelector('.mobile-header');
        const scrollThreshold = 5;

        window.addEventListener('scroll', function() {
            clearTimeout(scrollTimeout);
            
            scrollTimeout = setTimeout(function() {
                if (!mobileHeader) return;
                
                let scrollTop = window.pageYOffset || document.documentElement.scrollTop;
                
                // Se estiver no topo, sempre mostra
                if (scrollTop < 10) {
                    mobileHeader.classList.remove('hidden');
                    return;
                }
                
                // Verifica direção do scroll
                if (Math.abs(scrollTop - lastScrollTop) > scrollThreshold) {
                    if (scrollTop > lastScrollTop && scrollTop > 60) {
                        // Rolando para baixo - esconde
                        mobileHeader.classList.add('hidden');
                    } else {
                        // Rolando para cima - mostra
                        mobileHeader.classList.remove('hidden');
                    }
                    lastScrollTop = scrollTop;
                }
            }, 10);
        });

        // ===== FUNÇÕES DAS NOTIFICAÇÕES =====
        function openNotifications() {
            const popup = document.getElementById('notificationPopup');
            const overlay = document.getElementById('notificationOverlay');
            if (popup) popup.classList.add('active');
            if (overlay) overlay.classList.add('active');
            document.body.style.overflow = 'hidden';
        }

        function closeNotifications() {
            const popup = document.getElementById('notificationPopup');
            const overlay = document.getElementById('notificationOverlay');
            if (popup) popup.classList.remove('active');
            if (overlay) overlay.classList.remove('active');
            document.body.style.overflow = '';
        }

        function markAllAsRead() {
            alert('Todas as notificações foram marcadas como lidas!');
            // Aqui você implementaria a lógica real
        }

        // Fechar ao clicar no overlay
        document.getElementById('notificationOverlay')?.addEventListener('click', closeNotifications);

        // Fechar com ESC
        document.addEventListener('keydown', function(e) {
            if (e.key === 'Escape') {
                closeNotifications();
            }
        });