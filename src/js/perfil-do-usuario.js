let currentStatusElement = null;

/**
 * Cria o HTML para um card de postagem na página de perfil.
 * @param {object} post - O objeto da postagem.
 * @returns {string} O HTML do card.
 */
function createProfilePostCardHTML(post) {
  const badgeClass = `badge-${post.type}`;
  const badgeIcon = {
    denuncia: "fa-exclamation-triangle",
    plantio: "fa-seedling",
    comunidade: "fa-users",
  };

  const postImage = post.imageUrl || "https://images.unsplash.com/photo-1527004013197-933c4bb611b3?w=500";

  // Define o status e o botão de edição
  let statusHTML = '';
  if (post.type === 'denuncia' || post.type === 'plantio') {
    const statusClass = post.status === 'Resolvido' ? 'status-resolvido' : (post.status === 'Em Progresso' ? 'status-progresso' : 'status-nao-resolvido');
    const statusIcon = post.status === 'Resolvido' ? 'fa-check-circle' : (post.status === 'Em Progresso' ? 'fa-spinner' : 'fa-clock');
    statusHTML = `
      <div class="workflow-status ${statusClass}">
        <i class="fas ${statusIcon}"></i>
        ${post.status}
      </div>
      <button class="edit-status-btn" onclick="openStatusModal(this)">
        <i class="fas fa-edit"></i> Alterar Status
      </button>
    `;
  }

  return `
    <div class="post-card" id="profile-${post.id}">
      <div class="post-card-header">
        <span class="post-badge ${badgeClass}">
            <i class="fas ${badgeIcon[post.type]}"></i> ${post.type.charAt(0).toUpperCase() + post.type.slice(1)}
        </span>
        <i class="fas fa-ellipsis-v post-menu"></i>
      </div>
      <img src="${postImage}" alt="${post.title}" class="post-image" />
      <h3 class="post-title">${post.title}</h3>
      <p class="post-description">${post.description}</p>
      ${statusHTML}
      <div class="post-stats">
        <span class="post-stat"><i class="fas fa-heart"></i> ${post.likes}</span>
        <span class="post-stat"><i class="fas fa-comment"></i> ${post.comments}</span>
      </div>
    </div>
  `;
}

document.addEventListener("DOMContentLoaded", () => {
  const currentUser = API.getCurrentUser();

  // 1. Se não houver usuário, volta para a página de login
  if (!currentUser) {
    alert("Você precisa estar logado para ver seu perfil.");
    window.location.href = "login.html";
    return;
  }

  // 2. Carrega os dados do usuário no cabeçalho do perfil
  document.getElementById("profile-name").textContent = currentUser.name;
  document.getElementById("profile-username").textContent = `@${currentUser.username}`;
  document.getElementById("profile-avatar-img").src = currentUser.avatarUrl;
  // Carrega a imagem de capa se ela existir
  if (currentUser.coverUrl) document.getElementById("profile-cover-img").src = currentUser.coverUrl;
  document.getElementById("profile-bio").textContent = "🌳 Apaixonado por natureza e sustentabilidade | Defensor das árvores urbanas 🌿"; // Bio padrão

  // Preenche o modal de edição com os dados atuais
  document.getElementById('editName').value = currentUser.name;
  document.getElementById('editUsername').value = currentUser.username;
  document.getElementById('editEmail').value = currentUser.email;

  // 3. Busca e filtra as postagens do usuário
  const allPosts = API.getPosts();
  const userPosts = allPosts.filter(post => post.author && post.author.email === currentUser.email);

  // 4. Atualiza as estatísticas
  document.getElementById("stats-posts").textContent = userPosts.length;
  document.getElementById("stats-denuncias").textContent = userPosts.filter(p => p.type === 'denuncia').length;
  document.getElementById("stats-plantios").textContent = userPosts.filter(p => p.type === 'plantio').length;
  // A soma de curtidas seria mais complexa, vamos deixar 0 por enquanto
  document.getElementById("stats-likes").textContent = userPosts.reduce((sum, post) => sum + post.likes, 0);


  // 5. Renderiza as postagens em TODAS as abas, filtrando por tipo
  const renderPostsInTab = (tabId, posts, emptyMessage) => {
    const grid = document.querySelector(`#${tabId} .posts-grid`);
    if (posts.length > 0) {
      grid.innerHTML = posts.map(createProfilePostCardHTML).join('');
    } else {
      grid.innerHTML = `<p style="text-align: center; color: #666; grid-column: 1 / -1;">${emptyMessage}</p>`;
    }
  };

  // Aba "Todas Postagens"
  renderPostsInTab('postsTab', userPosts, 'Você ainda não fez nenhuma postagem.');

  // Aba "Plantios"
  const plantioPosts = userPosts.filter(p => p.type === 'plantio');
  renderPostsInTab('plantioTab', plantioPosts, 'Nenhuma postagem de plantio encontrada.');

  // Aba "Denúncias"
  const denunciaPosts = userPosts.filter(p => p.type === 'denuncia');
  renderPostsInTab('denunciaTab', denunciaPosts, 'Nenhuma denúncia encontrada.');

  // Aba "Comunidade"
  const comunidadePosts = userPosts.filter(p => p.type === 'comunidade');
  renderPostsInTab('comunidadeTab', comunidadePosts, 'Nenhuma postagem da comunidade encontrada.');

  // Adiciona evento de logout
  document.getElementById('logout-btn').addEventListener('click', () => {
      API.logout();
      window.location.href = 'index.html';
  });
});

        function switchTab(event, tabName) {
            // Remove active from all tabs and content
            document.querySelectorAll('.tab-btn').forEach(btn => btn.classList.remove('active'));
            document.querySelectorAll('.tab-content').forEach(content => content.classList.remove('active'));

            // Add active to clicked tab
            const clickedButton = event.currentTarget;
            clickedButton.classList.add('active');

            // Show corresponding content
            // O nome da aba (tabName) corresponde ao ID do conteúdo com 'Tab' no final
            const tabContentId = `${tabName}Tab`;
            const tabContent = document.getElementById(tabContentId);
            if (tabContent) {
                tabContent.classList.add('active');
            }
            /* Código antigo removido para simplificação
            if (tabName === 'posts') {
                document.getElementById('postsTab').classList.add('active');
            } else if (tabName === 'plantio') {
                document.getElementById('plantioTab').classList.add('active');
            } else if (tabName === 'denuncia') {
                document.getElementById('denunciaTab').classList.add('active');
            } else if (tabName === 'comunidade') {
                document.getElementById('comunidadeTab').classList.add('active');
            }*/
        }

        function openEditModal() {
            document.getElementById('editModal').classList.add('active');
        }

        function closeEditModal() {
            document.getElementById('editModal').classList.remove('active');
        }

        function saveProfile(event) {
            event.preventDefault();
            const name = document.getElementById('editName').value;
            const username = document.getElementById('editUsername').value;
            const email = document.getElementById('editEmail').value;
            const bio = document.getElementById('editBio').value;

            // 1. Cria um objeto com os dados atualizados
            const updatedData = { name, username, email, bio };

            // 2. Usa a API para salvar os dados permanentemente (no localStorage)
            const updatedUser = API.updateUser(updatedData);

            // 3. Atualiza a exibição na página com os novos dados
            if (updatedUser) {
                document.getElementById('profile-name').textContent = updatedUser.name;
                document.getElementById('profile-username').textContent = `@${updatedUser.username}`;
                document.getElementById('profile-bio').textContent = updatedUser.bio;
            }

            alert('Perfil atualizado com sucesso!');
            closeEditModal();
        }

        function openStatusModal(button) {
            currentStatusElement = button.previousElementSibling;
            document.getElementById('statusModal').classList.add('active');
        }

        function closeStatusModal() {
            document.getElementById('statusModal').classList.remove('active');
            currentStatusElement = null;
        }

        function changeStatus(status) {
            if (!currentStatusElement) return;

            // Remove all status classes
            currentStatusElement.classList.remove('status-nao-resolvido', 'status-progresso', 'status-resolvido');

            // Add new status class and update content
            let icon, text;
            if (status === 'nao-resolvido') {
                currentStatusElement.classList.add('status-nao-resolvido');
                icon = '<i class="fas fa-clock"></i>';
                text = 'Não Resolvido';
            } else if (status === 'progresso') {
                currentStatusElement.classList.add('status-progresso');
                icon = '<i class="fas fa-spinner"></i>';
                text = 'Em Progresso';
            } else if (status === 'resolvido') {
                currentStatusElement.classList.add('status-resolvido');
                icon = '<i class="fas fa-check-circle"></i>';
                text = 'Resolvido';
            }

            currentStatusElement.innerHTML = icon + ' ' + text;
            
            alert('Status atualizado com sucesso!');
            closeStatusModal();
        }

        // Close modals when clicking outside
        window.onclick = function(event) {
            const editModal = document.getElementById('editModal');
            const statusModal = document.getElementById('statusModal');
            
            if (event.target === editModal) {
                closeEditModal();
            }
            if (event.target === statusModal) {
                closeStatusModal();
            }
        }

/**
 * Lida com a mudança da imagem de avatar.
 */
function handleAvatarChange(event) {
    const file = event.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = function(e) {
        const newAvatarUrl = e.target.result;
        // Atualiza a imagem na tela
        document.getElementById('profile-avatar-img').src = newAvatarUrl;
        // Salva a alteração usando a API
        API.updateUser({ avatarUrl: newAvatarUrl });
        alert('Foto de perfil atualizada!');
    };
    reader.readAsDataURL(file);
}

/**
 * Lida com a mudança da imagem de capa.
 */
function handleCoverChange(event) {
    const file = event.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = function(e) {
        const newCoverUrl = e.target.result;
        // Atualiza a imagem na tela
        document.getElementById('profile-cover-img').src = newCoverUrl;
        // Salva a alteração usando a API
        API.updateUser({ coverUrl: newCoverUrl });
        alert('Foto de capa atualizada!');
    };
    reader.readAsDataURL(file);
}