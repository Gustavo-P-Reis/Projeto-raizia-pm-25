// =================================================================
// API SIMULATOR (usando localStorage para preparar para o backend)
// =================================================================

const API = {
  // Simula o login de um usuário e salva seus dados
  login: (name, email) => {
    const user = {
      name: name,
      email: email,
      username: name.toLowerCase().replace(" ", ""),
      avatarUrl: `https://ui-avatars.com/api/?name=${name.replace(" ", "+")}&length=2&background=random`,
    };
    localStorage.setItem("currentUser", JSON.stringify(user));
    return user;
  },

  // Simula o logout
  logout: () => {
    localStorage.removeItem("currentUser");
  },

  // Pega o usuário atualmente logado
  getCurrentUser: () => {
    try {
      const user = JSON.parse(localStorage.getItem("currentUser"));
      
      // **CORREÇÃO AUTOMÁTICA DO AVATAR**
      // Verifica se o avatar é do ui-avatars e não tem o parâmetro 'length=2'
      if (user && user.avatarUrl && user.avatarUrl.includes('ui-avatars.com') && !user.avatarUrl.includes('length=2')) {
        // Reconstrói a URL com o parâmetro correto
        const nameParam = user.name.replace(" ", "+");
        user.avatarUrl = `https://ui-avatars.com/api/?name=${nameParam}&length=2&background=random`;
        // Salva a correção de volta no localStorage para não precisar fazer de novo
        localStorage.setItem("currentUser", JSON.stringify(user));
      }

      return user;
    } catch (e) {
      return null;
    }
  },

  // Atualiza os dados do usuário logado
  updateUser: (updatedData) => {
    let currentUser = API.getCurrentUser();
    if (!currentUser) {
      console.error("Nenhum usuário para atualizar.");
      return null;
    }

    // Mescla os dados novos com os existentes
    currentUser = { ...currentUser, ...updatedData };

    // Se o nome foi alterado, mas o avatar não, gera um novo avatar com as iniciais
    if (updatedData.name && !updatedData.avatarUrl && !currentUser.avatarUrl.startsWith('data:image')) {
        currentUser.avatarUrl = `https://ui-avatars.com/api/?name=${updatedData.name.replace(" ", "+")}&length=2&background=random`;
    }

    localStorage.setItem("currentUser", JSON.stringify(currentUser));
    return currentUser;
  },

  // Salva uma nova postagem
  savePost: (postData) => {
    let posts = JSON.parse(localStorage.getItem("posts")) || [];
    // Adiciona dados extras que o backend normalmente adicionaria
    postData.id = `post_${Date.now()}`;
    postData.createdAt = new Date().toISOString();
    postData.author = API.getCurrentUser(); // Associa o post ao usuário logado
    postData.likes = 0;
    postData.comments = 0;

    posts.unshift(postData); // Adiciona no início para aparecer primeiro
    localStorage.setItem("posts", JSON.stringify(posts));
    return postData;
  },

  // Carrega todas as postagens
  getPosts: () => {
    return JSON.parse(localStorage.getItem("posts")) || [];
  },
};

// =================================================================
// FUNÇÕES DE RENDERIZAÇÃO (que usam a API)
// =================================================================

/**
 * Cria o HTML para um card de postagem.
 * @param {object} post - O objeto da postagem.
 * @returns {string} O HTML do card.
 */
function createPostCardHTML(post) {
  const postDate = new Date(post.createdAt);
  const timeAgo = `Há ${Math.round((new Date() - postDate) / 60000)} minutos`; // Simples, para exemplo

  const badgeClass = `badge-${post.type}`;
  const badgeIcon = {
    denuncia: "fa-exclamation-triangle",
    plantio: "fa-seedling",
    comunidade: "fa-users",
  };

  // Simula uma imagem de post se não houver
  const postImage = post.imageUrl || "https://images.unsplash.com/photo-1527004013197-933c4bb611b3?w=500";

  return `
    <div class="post-card" id="${post.id}">
      <div class="post-header">
        <div class="post-user">
          <img src="${post.author.avatarUrl}" alt="Avatar de ${post.author.name}" class="post-author-avatar" style="width: 40px; height: 40px; border-radius: 50%; object-fit: cover;">
          <div class="user-info">
            <h3 style="font-weight: 600; color: #14171a;">${post.author.name}</h3>
            <p>${timeAgo}</p>
          </div>
        </div>
        <span class="post-badge ${badgeClass}">
            <i class="fas ${badgeIcon[post.type]}"></i> ${post.type.charAt(0).toUpperCase() + post.type.slice(1)}
        </span>
      </div>
      <div class="post-content">
        <h2>${post.title}</h2>
        <p>${post.description}</p>
        ${post.location ? `
        <div class="post-location">
          <i class="fas fa-map-marker-alt"></i>
          <span>${post.location}</span>
        </div>` : ''}
        ${post.status ? `
        <span class="workflow-status status-nao-resolvido">
          <i class="fas fa-clock"></i>
          ${post.status}
        </span>` : ''}
      </div>
      <div class="post-media">
        <img src="${postImage}" alt="${post.title}" class="post-image" />
      </div>
      <div class="post-actions">
        <button class="action-btn" onclick="toggleLike(this)">
          <i class="far fa-heart"></i>
          <span>${post.likes}</span>
        </button>
        <button class="action-btn">
          <i class="far fa-comment"></i>
          <span>${post.comments}</span>
        </button>
        <button class="action-btn">
          <i class="fas fa-share"></i>
          <span>Compartilhar</span>
        </button>
      </div>
    </div>
  `;
}

/**
 * Carrega os posts da API e os insere no feed.
 */
function loadPostsIntoFeed() {
    const postsFeed = document.getElementById('postsFeed');
    if (!postsFeed) return;

    const posts = API.getPosts();
    if (posts.length === 0) {
        postsFeed.innerHTML = '<p style="text-align: center; color: #666; padding: 40px 0;">Nenhuma postagem encontrada. Que tal criar a primeira?</p>';
    } else {
        postsFeed.innerHTML = posts.map(createPostCardHTML).join('');
    }
}