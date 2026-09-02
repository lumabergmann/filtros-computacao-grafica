import { useState } from 'react'
import './App.css'

function App() {
  const [imagem, setImagem] = useState(null);
  const [previewEntrada, setPreviewEntrada] = useState(null);
  const [filtro, setFiltro] = useState("cinza");
  const [imagemSaida, setImagemSaida] = useState(null);
  const [carregando, setCarregando] = useState(false);

  const handleImagemChange = (e) => {
    const file = e.target.files[0];   // Pega o primeiro arquivo da lista de arquivos

    if(file){
      setImagem(file);
      setPreviewEntrada(URL.createObjectURL(file));  // Cria uma URL para renderizar e exibir a imagem selecionada sem precisar fazer uploads prévios
      setImagemSaida(null);  // Elimina imagens de saída anteriores
    }
  };

  const handleSubmit = async (e) => {   // Método que chama a API após o envio do formulário
    e.preventDefault();  // Evita que a página seja recarregada ao enviar o formulário

    if(!imagem){
      alert("Carregue uma imagem.");
      return;
    }

    setCarregando(true);

    const formData = new FormData();  // Classe usada para simular o envio de formulários HTML fo formato multipart/form-data. É a única forma correta de enviar arquivos com texto via requisições HTTP
    formData.append("file", imagem);
    formData.append("filtro", filtro);

    try{
      const response = await fetch("http://127.0.0.1:8000/processar", {
        method: "POST",
        body: formData,
      });

      if(!response.ok){
        throw new Error("Erro ao processar imagem.");
      }

      const blob = await response.blob();   // BLOB: Binary Large Object
      setImagemSaida(URL.createObjectURL(blob));
    }
    
    catch(error){
      alert(error.message);
    }

    finally{
      setCarregando(false);
    }
  };


  return (
    <div>
      <h1>Filtros de Imagem</h1>
      <form onSubmit={handleSubmit}>

        <div>
          <label>Selecione a imagem</label>
          <input onChange={handleImagemChange} type='file' accept='image/*' />
        </div>

        <div>
          <label>Escolha o filtro</label>
          <select value={filtro} onChange={(e) => setFiltro(e.target.value)}>
            <option value="cinza">Cinza</option>
            <option value="equalizar">Contraste</option>
            <option value="binarizar">Preto e Branco</option>
            <option value="blur">Blur</option>
            <option value="bordas">Enfatizar bordas</option>
            <option value="emboss">Emboss</option>
            <option value="motionBlur">Motion Blur</option>
            <option value="sobel">Sobel</option>
            <option value="prewitt">Prewitt</option>
            <option value="mediana">Mediana</option>
            <option value="dilatacao">Dilatação</option>
            <option value="erosao">Erosão</option>
            <option value="abertura">Abertura</option>
            <option value="fechamento">Fechamento</option>
          </select>
        </div>

          <button type='submit' disabled={carregando}>{carregando ? 'Processando...' : 'Aplicar Filtro'}</button>
      </form>

      <div>
        {previewEntrada && (
          <div>
            <h2>Imagem de Entrada</h2>
            <img src={previewEntrada} alt='Imagem de entrada'/>
          </div>
        )}
        {imagemSaida &&(
          <div>
            <h2>Resultado</h2>
            <img src={imagemSaida} alt='Resultado'/>
          </div>
        )}
      </div>
    </div>
  );
}

export default App
