document.addEventListener("DOMContentLoaded", () => {
  // Verifica se o usuário está logado
  const currentUser = API.getCurrentUser();
  if (!currentUser) {
    alert("Você precisa estar logado para criar uma postagem na comunidade.");
    window.location.href = "login.html";
    return;
  }
  // Preenche o nome do autor (se houver o campo no HTML)
  // document.getElementById('userName').value = currentUser.name;

  // Inicializa o mapa Leaflet
  const map = L.map('map').setView([-15.7801, -47.9292], 4); // Centralizado no Brasil

  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
  }).addTo(map);

  // Adiciona um marcador inicial (opcional)
  const marker = L.marker([-15.7801, -47.9292]).addTo(map)
      .bindPopup('Arraste o marcador para o local da sua foto.')
      .openPopup();
});

function previewImage(event) {
            const file = event.target.files[0];
            if (file) {
                const reader = new FileReader();
                reader.onload = function(e) {
                    document.getElementById('previewImg').src = e.target.result;
                    document.getElementById('imagePreview').classList.add('active');
                }
                reader.readAsDataURL(file);
            }
        }

        function toggleHashtag(element) {
            element.classList.toggle('selected');
        }

        function selectPrivacy(element, level) {
            document.querySelectorAll('.privacy-option').forEach(opt => {
                opt.classList.remove('selected');
            });
            element.classList.add('selected');
            document.getElementById('privacyLevel').value = level;
        }

        function handleSubmit(event) {
            event.preventDefault();

            const title = document.getElementById('postTitle').value;
            const description = document.getElementById('postDescription').value;
            const imageInput = document.getElementById('imageInput');
            const imageUrl = document.getElementById('previewImg').src;

            if (!title || !description) {
                alert('Por favor, preencha o título e a descrição!');
                return;
            }

            if (!imageUrl || imageUrl.endsWith('/')) { // Verifica se a imagem foi carregada
                alert('Por favor, adicione uma foto!');
                return;
            }

            // 1. Coleta os dados do formulário
            const postData = {
                type: "comunidade",
                title: title,
                description: description,
                imageUrl: imageUrl,
                location: `${document.getElementById('city').value}, ${document.getElementById('state').value}`,
                // Hashtags podem ser adicionadas aqui se necessário
            };

            // 2. Usa a API para salvar a postagem
            API.savePost(postData);

            // 3. Exibe uma mensagem de sucesso e redireciona
            alert('Postagem publicada com sucesso na comunidade!');
            window.location.href = 'index.html';
        }

        // Mostrar mapa quando houver dados de localização
        document.getElementById('city').addEventListener('input', function() {
            const mapContainer = document.getElementById('map');
            if (this.value) {
                mapContainer.style.display = 'block';
            } else {
                mapContainer.style.display = 'none';
            }
        });

        // Auto-completar coordenadas (simulado)
        document.getElementById('postalCode').addEventListener('blur', function() {
            const mapContainer = document.getElementById('map');
            if (this.value) { mapContainer.style.display = 'block'; }
        });