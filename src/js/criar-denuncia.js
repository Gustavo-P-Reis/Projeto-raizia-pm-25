// =================================================================
// LÓGICA PARA A PÁGINA DE CRIAR DENÚNCIA
// =================================================================

document.addEventListener("DOMContentLoaded", () => {
  // Pré-preenche o nome do usuário se ele estiver logado
  const currentUser = API.getCurrentUser();
  if (currentUser) {
    document.getElementById("userName").value = currentUser.name;
  } else {
    // Se não estiver logado, redireciona para o login, pois não pode postar.
    alert("Você precisa estar logado para criar uma denúncia.");
    window.location.href = "login.html";
  }

  // Inicializa o mapa Leaflet
  const map = L.map('map').setView([-15.7801, -47.9292], 4); // Centralizado no Brasil

  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
  }).addTo(map);

  // Adiciona um marcador inicial (opcional)
  const marker = L.marker([-15.7801, -47.9292]).addTo(map)
      .bindPopup('Arraste o marcador para o local exato da denúncia.')
      .openPopup();
});

function handleSubmit(event) {
  event.preventDefault(); // Impede o envio padrão do formulário

  // Coleta todos os dados do formulário
  const postData = {
    type: "denuncia",
    title: document.getElementById("postTitle").value,
    description: document.getElementById("postDescription").value,
    problemType: document.getElementById("problemType").value,
    timeOccurred: document.getElementById("timeOccurred").value,
    urgency: document.getElementById("urgencyLevel").value,
    location: `${document.getElementById("street").value}, ${document.getElementById("city").value}`,
    // Em um app real, a imagem seria enviada para um servidor e a URL seria salva.
    // Aqui, vamos apenas simular.
    imageUrl: document.getElementById("previewImg").src || null,
    status: "Não Resolvido",
  };

  // Validação simples
  if (!postData.title || !postData.description || !postData.location) {
    alert("Por favor, preencha todos os campos obrigatórios.");
    return;
  }

  // Usa a API para salvar a postagem
  API.savePost(postData);

  // Exibe uma mensagem de sucesso e redireciona para a home
  alert("Denúncia publicada com sucesso!");
  window.location.href = "index.html";
}

// Funções auxiliares do formulário (seleção de opções, preview de imagem)
function selectProblem(element, value) {
  document.querySelectorAll("#problemTypes .problem-option").forEach(el => el.classList.remove("selected"));
  element.classList.add("selected");
  document.getElementById("problemType").value = value;
}

function selectTime(element, value) {
  document.querySelectorAll("#timeSelector .time-option").forEach(el => el.classList.remove("selected"));
  element.classList.add("selected");
  document.getElementById("timeOccurred").value = value;
}

function selectUrgency(element, value) {
  document.querySelectorAll("#urgencyLevels .urgency-option").forEach(el => el.classList.remove("selected"));
  element.classList.add("selected");
  document.getElementById("urgencyLevel").value = value;
}

function previewImage(event) {
  const reader = new FileReader();
  reader.onload = function () {
    const preview = document.getElementById("imagePreview");
    const img = document.getElementById("previewImg");
    img.src = reader.result;
    preview.style.display = "block";
    document.querySelector(".image-upload").style.display = "none";
  };
  reader.readAsDataURL(event.target.files[0]);
}

function generateReport() {
    // Função da IA (mantida como está)
    const title = document.getElementById('postTitle').value;
    const description = document.getElementById('postDescription').value;
    const location = document.getElementById('street').value;
    const urgency = document.getElementById('urgencyLevel').value;

    if(!title || !description || !location || !urgency) {
        alert('Por favor, preencha o título, descrição, endereço e nível de urgência antes de gerar o relatório.');
        return;
    }

    const reportContent = `
        <strong>Assunto:</strong> Relatório de Denúncia - ${title}<br>
        <strong>Localização:</strong> ${location}<br>
        <strong>Nível de Urgência:</strong> ${urgency.charAt(0).toUpperCase() + urgency.slice(1)}<br><br>
        <strong>Descrição do Problema:</strong><br>${description}<br><br>
        <strong>Ações Recomendadas:</strong> Avaliação técnica no local para determinar a estabilidade da árvore e o risco iminente. Remoção ou poda de galhos, se necessário, para garantir a segurança pública.
    `;

    document.getElementById('reportContent').innerHTML = reportContent;
    document.getElementById('aiOutput').style.display = 'block';
    document.getElementById('continueLink').style.display = 'block';
}