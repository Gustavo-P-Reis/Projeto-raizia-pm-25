document.addEventListener("DOMContentLoaded", () => {
  // Verifica se o usuário está logado e preenche o nome
  const currentUser = API.getCurrentUser();
  if (currentUser) {
    document.getElementById("userName").value = currentUser.name;
  } else {
    alert("Você precisa estar logado para cadastrar um local de plantio.");
    window.location.href = "login.html";
    return;
  }

  // Inicializa o mapa Leaflet
  const map = L.map('map').setView([-15.7801, -47.9292], 4); // Centralizado no Brasil

  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
  }).addTo(map);

  // Adiciona um marcador inicial (opcional)
  const marker = L.marker([-15.7801, -47.9292]).addTo(map)
      .bindPopup('Arraste o marcador para o local exato do plantio.')
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

        function generateReport() {
            const title = document.getElementById('postTitle').value;
            const description = document.getElementById('postDescription').value;
            const userName = document.getElementById('userName').value;
            const neighborhood = document.getElementById('neighborhood').value;
            const city = document.getElementById('city').value;

            if (!title || !description) {
                alert('Por favor, preencha o nome da postagem e a descrição primeiro!');
                return;
            }

            const report = `
                <strong>RELATÓRIO DE PLANTIO - RAIZIA</strong><br><br>
                
                <strong>Título:</strong> ${title}<br>
                <strong>Responsável:</strong> ${userName}<br>
                <strong>Localização:</strong> ${neighborhood}, ${city}<br><br>
                
                <strong>Descrição do Local:</strong><br>
                ${description}<br><br>
                
                <strong>Análise:</strong><br>
                Com base nas informações fornecidas, este local apresenta características favoráveis para o plantio de árvores. 
                Recomenda-se a avaliação técnica de um engenheiro ambiental para determinar as espécies mais adequadas 
                ao solo e clima da região.<br><br>
                
                <strong>Próximos Passos:</strong><br>
                1. Análise técnica do solo<br>
                2. Aprovação dos órgãos competentes<br>
                3. Seleção de espécies nativas<br>
                4. Execução do plantio<br><br>
                
                <em>Relatório gerado automaticamente em ${new Date().toLocaleDateString('pt-BR')}</em>
            `;

            document.getElementById('reportContent').innerHTML = report;
            document.getElementById('aiOutput').classList.add('active');
            document.getElementById('continueLink').style.display = 'inline-flex';
            document.getElementById('continueLink').href = 'https://relatorio.raizia.com/' + Math.random().toString(36).substr(2, 9);
        }

        function handleSubmit(event) {
            event.preventDefault();

            const title = document.getElementById('postTitle').value;
            const description = document.getElementById('postDescription').value;
            const imageUrl = document.getElementById('previewImg').src;

            if (!title || !description || !imageUrl || imageUrl.endsWith('/')) {
                alert('Por favor, preencha todos os campos e adicione uma imagem.');
                return;
            }

            // 1. Coleta os dados do formulário
            const postData = {
                type: "plantio",
                title: title,
                description: description,
                imageUrl: imageUrl,
                location: `${document.getElementById('neighborhood').value}, ${document.getElementById('city').value}`,
                status: "Não Resolvido",
            };

            // 2. Usa a API para salvar a postagem
            API.savePost(postData);

            alert('Postagem de plantio publicada com sucesso!');
            window.location.href = 'index.html';
        }

        // Auto-completar coordenadas (simulado)
        document.getElementById('postalCode').addEventListener('blur', function() {
            if (this.value) {
                document.getElementById('latitude').value = '-23.' + Math.floor(Math.random() * 900000 + 100000);
                document.getElementById('longitude').value = '-46.' + Math.floor(Math.random() * 900000 + 100000);
            }
        });