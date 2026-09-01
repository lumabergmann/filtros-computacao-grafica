import { useState } from 'react'
import './App.css'

function App() {
  const [imagem, setImagem] = useState(null);
  const [previewEntrada, setPreviewEntrada] = useState(null);
  const [filtro, setFiltro] = useState(null);
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
    e.preventDefault;  // Evita que a página seja recarregada ao enviar o formulário

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



  return ();
}

export default App
