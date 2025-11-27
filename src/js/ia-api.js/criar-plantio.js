// Importa a biblioteca do Google Generative AI
      import { GoogleGenerativeAI } from "https://esm.run/@google/generative-ai";

      // ATENÇÃO: A API Key NUNCA deve ser exposta no lado do cliente em um projeto real.
      // Em um projeto real, NUNCA exponha a API Key no lado do cliente.
      // Use um backend para fazer as chamadas para a API do Gemini.
      const API_KEY = "AIzaSyBxr1ysekwseo6hAGapyedo0aTdKEnvu_E"; // Substitua pela sua chave de API

      const genAI = new GoogleGenerativeAI(API_KEY);

      // Função para converter um arquivo de imagem para Base64
      function toBase64(file) {
        return new Promise((resolve, reject) => {
          const reader = new FileReader();
          reader.readAsDataURL(file);
          reader.onload = () => resolve(reader.result.split(",")[1]);
          reader.onerror = (error) => reject(error);
        });
      }

      // Adiciona a função `generateReport` ao escopo global para ser chamada pelo `onclick`
      window.generateReport = async () => {
        const imageInput = document.getElementById("imageInput");
        const aiOutput = document.getElementById("aiOutput");
        const reportContent = document.getElementById("reportContent");
        const continueLink = document.getElementById("continueLink");

        // 1. Coletar dados do formulário
        const nomeResponsavel = document.getElementById("userName").value;
        const descricaoLocal = document.getElementById("postDescription").value;
        const rua = document.getElementById("street").value;
        const bairro = document.getElementById("neighborhood").value;
        const cidade = document.getElementById("city").value;
        const estado = document.getElementById("state").value;
        const cep = document.getElementById("postalCode").value;
        const latitude = document.getElementById("latitude").value;
        const longitude = document.getElementById("longitude").value;
        const selectedFile = imageInput.files[0];

        // 2. Validar se a imagem foi enviada
        // 2. Validar se os campos obrigatórios foram preenchidos
        if (!descricaoLocal || !rua || !bairro || !cidade || !estado || !latitude || !longitude) {
          alert("Por favor, preencha todos os campos de descrição e endereço antes de gerar o relatório.");
          return;
        }

        if (!selectedFile) {
          alert("Por favor, faça o upload de uma imagem do local antes de gerar o relatório.");
          return;
        }

        // 3. Exibir estado de carregamento
        aiOutput.style.display = "block";
        reportContent.innerHTML = "⏳ Gerando relatório com IA, por favor, aguarde...";
        continueLink.style.display = "none";

        try {
          const base64Image = await toBase64(selectedFile);

          // 4. Construir o prompt para a IA (focado apenas na análise e recomendação)
          const prompt = `
            Você é um especialista em arborização urbana de São Paulo.
            Analise a imagem e a descrição do local a seguir.
            Descrição do local: "${descricaoLocal}".
            Com base na análise, recomende de 3 a 5 espécies de árvores nativas permitidas pelo "Manual Técnico de Arborização Urbana de São Paulo" e pela "Portaria SVMA Nº 26, de 29 de abril de 2024".
            Para cada espécie, forneça uma justificativa técnica breve (ex: porte adequado para a fiação, tipo de raiz não agressiva para a calçada).
            Formate a resposta como uma lista, começando cada item com um hífen ou asterisco. Exemplo:
            - Ipê-amarelo (Handroanthus vellosoi): Árvore de porte médio, ideal para calçadas largas e com floração ornamental.
            - Quaresmeira (Pleroma granulosum): Porte pequeno a médio, não possui raízes agressivas e se adapta bem a ambientes urbanos.
          `;

          // 5. Chamar a API do Gemini
          const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });
          const result = await model.generateContent([prompt, { inlineData: { mimeType: selectedFile.type, data: base64Image } }]);
          const aiResponse = await result.response;
          const recomendacoesIA = aiResponse.text();

          // 6. Gerar data atual por extenso
          const dataAtual = new Date().toLocaleDateString('pt-BR', {
            day: '2-digit',
            month: 'long',
            year: 'numeric'
          });

          // 7. Montar o ofício usando um template string em JavaScript
          const oficioTexto = `
${dataAtual}

À
Secretaria Municipal do Verde e do Meio Ambiente – SVMA
Prefeitura de São Paulo

**Assunto: Solicitação de Autorização para Plantio de Árvores Nativas em Via Pública**

Prezados(as) Senhores(as),

Eu, ${nomeResponsavel}, cidadão residente deste município, venho por meio deste requerer a devida autorização para realizar o plantio voluntário de árvores em área pública.

O local proposto para o plantio está situado no endereço: ${rua}, Bairro ${bairro}, ${cidade} - ${estado}, CEP: ${cep} (Coordenadas: Lat ${latitude}, Long ${longitude}). A iniciativa tem como objetivo principal contribuir para a ampliação da cobertura vegetal urbana, a melhoria da qualidade do ar e o embelezamento paisagístico da nossa cidade, em total alinhamento com as diretrizes municipais de sustentabilidade.

Conforme a descrição fornecida – "${descricaoLocal}" – e a análise da imagem anexa para referência visual, o local apresenta condições adequadas para o plantio.

Com base em uma análise preliminar e em conformidade com o Manual Técnico de Arborização Urbana e a Portaria SVMA Nº 26/2024, sugerimos as seguintes espécies nativas, recomendadas por análise de IA, para avaliação por parte desta secretaria:

${recomendacoesIA}

Declaro que o plantio seguirá todas as normas técnicas vigentes para garantir a integridade da infraestrutura urbana e o desenvolvimento saudável das mudas.

Agradeço a atenção dispensada e coloco-me à disposição para eventuais esclarecimentos ou para acompanhar uma vistoria técnica no local, se necessário.

Atenciosamente,

_________________________
${nomeResponsavel}
          `.trim();

          // 8. Exibir o resultado
          reportContent.innerHTML = oficioTexto.replace(/\n/g, '<br>'); // Mantém as quebras de linha
          continueLink.style.display = "block";

        } catch (error) {
          console.error("Erro ao gerar relatório:", error);
          reportContent.innerHTML = `❌ Ocorreu um erro ao gerar o relatório. Verifique sua chave de API e tente novamente. <br><br>Detalhes: ${error.message}`;
        }
      };