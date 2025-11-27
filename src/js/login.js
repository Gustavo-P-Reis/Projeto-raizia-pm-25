function switchTab(tab) {
            // Update tabs
            const tabs = document.querySelectorAll('.tab');
            tabs.forEach(t => t.classList.remove('active'));
            event.target.classList.add('active');

            // Update forms
            const forms = document.querySelectorAll('.form-container');
            forms.forEach(f => f.classList.remove('active'));

            if (tab === 'login') {
                document.getElementById('loginForm').classList.add('active');
            } else {
                document.getElementById('registerForm').classList.add('active');
            }
        }

        function togglePassword(inputId, icon) {
            const input = document.getElementById(inputId);
            if (input.type === 'password') {
                input.type = 'text';
                icon.classList.remove('fa-eye');
                icon.classList.add('fa-eye-slash');
            } else {
                input.type = 'password';
                icon.classList.remove('fa-eye-slash');
                icon.classList.add('fa-eye');
            }
        }

        function handleLogin(event) {
            event.preventDefault();
            // Para a simulação, vamos usar o nome do registro para "logar"
            // Em um backend real, você validaria email e senha.
            const name = "Usuário Logado"; // Nome genérico para login
            const email = document.getElementById('loginEmail').value;
            
            // **CORREÇÃO:** Salva os dados do usuário usando a API
            API.login(name, email);

            alert('Login realizado com sucesso!');
            window.location.href = 'index.html';
        }

        function handleRegister(event) {
            event.preventDefault();
            
            const name = document.getElementById('registerName').value;
            const email = document.getElementById('registerEmail').value;
            const password = document.getElementById('registerPassword').value;
            const confirmPassword = document.getElementById('registerConfirmPassword').value;
            
            if (password !== confirmPassword) {
                alert('As senhas não coincidem!');
                return;
            }

            // **CORREÇÃO:** Salva os dados do usuário usando a API
            API.login(name, email);

            alert('Conta criada com sucesso!');
            window.location.href = 'index.html';
        }