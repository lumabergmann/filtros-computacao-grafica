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
      alert("Carregue uma imagem.")
      return;
    }

    setCarregando(true);
  };



  return ();
}

export default App
