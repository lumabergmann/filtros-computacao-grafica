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
  }

  

  return ();
}

export default App
