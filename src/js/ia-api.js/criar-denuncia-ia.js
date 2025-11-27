// Importa a biblioteca do Google Generative AI
      import { GoogleGenerativeAI } from "https://esm.run/@google/generative-ai";

      // ATENÇÃO: A API Key NUNCA deve ser exposta no lado do cliente em um projeto real.
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
        const postTitle = document.getElementById("postTitle").value;
        const postDescription = document.getElementById("postDescription").value;
        const problemType = document.getElementById("problemType").value;
        const urgencyLevel = document.getElementById("urgencyLevel").value;
        const street = document.getElementById("street").value;
        const number = document.getElementById("number").value;
        const neighborhood = document.getElementById("neighborhood").value;
        const city = document.getElementById("city").value;
        const state = document.getElementById("state").value;
        const postalCode = document.getElementById("postalCode").value;
        const latitude = document.getElementById("latitude").value;
        const longitude = document.getElementById("longitude").value;
        const selectedFile = imageInput.files[0];

        // 2. Validar se os campos obrigatórios foram preenchidos
        if (!postTitle || !postDescription || !problemType || !urgencyLevel || !street || !city || !state) {
          alert("Por favor, preencha todos os campos obrigatórios (*) antes de gerar o relatório.");
          return;
        }
        if (!selectedFile) {
          alert("Por favor, faça o upload de uma imagem do problema antes de gerar o relatório.");
          return;
        }

        // 3. Exibir estado de carregamento
        aiOutput.style.display = "block";
        reportContent.innerHTML = "⏳ Analisando a imagem e gerando denúncia com IA, por favor, aguarde...";
        continueLink.style.display = "none";

        try {
          const base64Image = await toBase64(selectedFile);

          // 4. Construir o prompt para a IA
          const prompt = `
            Você é um especialista em análise de risco ambiental e arborização urbana. Sua tarefa é gerar um relatório de denúncia formal, com 10 a 20 linhas, baseado nos dados e na imagem fornecida.

            **DADOS DO USUÁRIO:**
            - Título: ${postTitle}
            - Descrição: ${postDescription}
            - Tipo de Problema: ${problemType}
            - Urgência (informada pelo usuário): ${urgencyLevel}
            - Endereço: ${street}, ${number || 's/n'}, ${neighborhood}, ${city} - ${state}

            **SUA ANÁLISE:**
            1.  **Análise da Imagem:** Analise detalhadamente a imagem. Procure por: folhagem em fios elétricos, pragas, fungos, cupins, inclinação com risco de queda, galhos quebrados/secos, raízes expostas, erosão, doenças visíveis (manchas, murcha), lixo, poluição, ou qualquer risco para pessoas e infraestrutura.
            2.  **Geração do Relatório Formal:** Com base na sua análise da imagem e nos dados do usuário, redija um texto de denúncia formal. O texto deve descrever de forma clara e técnica:
                - **O problema encontrado:** Confirme e detalhe o problema.
                - **Os riscos envolvidos:** (Ex: risco de queda, risco elétrico, risco ambiental, risco à segurança dos pedestres).
                - **Ação recomendada:** (Ex: poda emergencial, remoção de galhos, supressão da árvore, controle de pragas, isolamento da área, acionamento do órgão competente).
                - **Classificação de Urgência (sua avaliação):** Classifique a urgência como Baixa, Média, Alta ou Crítica, justificando brevemente.

            O texto final deve ser um parágrafo coeso e profissional, pronto para ser enviado a um órgão público.
          `;

          // 5. Chamar a API do Gemini
          const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });
          const result = await model.generateContent([prompt, { inlineData: { mimeType: selectedFile.type, data: base64Image } }]);
          const response = await result.response;
          const text = response.text();

          // 6. Exibir o resultado
          reportContent.innerHTML = text.replace(/\n/g, '<br>');
          continueLink.style.display = "block";

        } catch (error) {
          console.error("Erro ao gerar denúncia:", error);
          reportContent.innerHTML = `❌ Ocorreu um erro ao gerar o relatório. Verifique sua chave de API e se o modelo está correto. <br><br>Detalhes: ${error.message}`;
        }
      };