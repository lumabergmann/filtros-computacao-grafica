import { useState } from 'react'
import './App.css'

const API = "https://filtros-computacao-grafica.vercel.app" || "http://127.0.0.1:8000/processar";

const TEXTO_FILTROS = {
  cinza: 
    "Converte uma imagem colorida em tons de cinza, removendo a informação de cor e mantendo apenas a luminosidade. O cálculo é feito aplicando uma média ponderada entre os canais vermelho, verde e azul para refletir a sensibilidade da visão humana.",

  equalizar: 
    "Aumenta o contraste global da imagem redistribuindo os níveis de cinza ao longo do histograma. Esse processo destaca detalhes em áreas muito escuras ou muito claras ao balancear as intensidades de forma mais uniforme.",

  binarizar: 
    "Transforma a imagem em apenas duas cores puras: preto e branco. O processamento é feito convertendo a imagem para tons de cinza e comparando a intensidade de cada pixel com um limite calculado automaticamente pelo método de Otsu.",

  blur: 
    "Suaviza a imagem e reduz ruídos gerando um efeito de desfoque uniforme. O valor de cada pixel é substituído pela média aritmética dos valores de seus pixels vizinhos.",

  motionBlur: 
    "Simula o efeito de desfoque de movimento, como o rastro de uma câmera ou objeto se deslocando rapidamente. O cálculo realiza a média dos pixels vizinhos apenas ao longo de uma linha direcionada.",

  mediana: 
    "Remove ruídos isolados (como o efeito 'sal e pimenta') sem borrar as bordas principais. Ele analisa a vizinhança de cada pixel, ordena os valores e substitui o pixel central pela mediana exata dessa lista.",

  bordas: 
    "Aumenta a nitidez visual e acentua os contornos da imagem. Isola os detalhes de alta frequência subtraindo uma versão suavizada da imagem original e, em seguida, soma esses detalhes de volta à imagem.",

  emboss: 
    "Cria um efeito tridimensional na imagem, fazendo com que ela pareça esculpida em alto-relevo. O cálculo destaca transições na diagonal e adiciona uma tonalidade cinza de fundo.",

  sobel: 
    "Identifica e destaca os contornos e bordas da imagem calculando as variações abruptas de intensidade nas direções horizontal e vertical de forma combinada.",

  prewitt: 
    "Detecta bordas da imagem de forma semelhante ao filtro Sobel, medindo as mudanças de intensidade. Utiliza pesos uniformes nos pixels vizinhos para mapear as variações verticais e horizontais.",

  erosao: 
    "Desgasta ou encolhe as regiões claras da imagem. Esse filtro morfológico é ideal para eliminar pequenos ruídos brancos isolados e afinar estruturas e objetos claros.",

  dilatacao: 
    "Expande ou engrossa as regiões claras da imagem. Esse filtro morfológico ajuda a preencher pequenos buracos e a conectar regiões claras que estão muito próximas.",

  abertura: 
    "Remove pequenos objetos e ruídos claros da imagem sem alterar significativamente o tamanho e a forma dos objetos maiores. Funciona aplicando uma erosão seguida por uma dilatação.",

  fechamento: 
    "Preenche pequenos buracos, fendas e lacunas escuras dentro de áreas claras. Funciona aplicando uma dilatação seguida por uma erosão."
};

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
      const response = await fetch(API, {
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

  const handleDownload = () => {
    if(!imagemSaida || !imagem){
      return;
    }

    const nomeImagem = imagem.name;  // Extrai o nome do arquivo anexado
    const pontoExtensao = nomeImagem.lastIndexOf(".");  // Pega o índice do último ponto do nome do arquivo para extrair a extensão

    const extensao = pontoExtensao !== -1 ? nomeImagem.slice(pontoExtensao) : '.png';   // Extrai a extensão do arquivo. Se não houver extensão, seta para png
    const nomeImagemSemExtensao = pontoExtensao !== -1 ? nomeImagem.slice(0, pontoExtensao) : nomeImagem;  // Extrai apenas o nome do arquivo, sem a extensão

    const nomeDownload = `${nomeImagemSemExtensao}_${filtro}${extensao}`;

    const link = document.createElement('a');
    link.href = imagemSaida;
    link.download = nomeDownload;

    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className='root'>
      <h1>Filtros de Imagem</h1>
      <form className='btn-submit' onSubmit={handleSubmit}>

      <div className='form-row'>
          <div className='imageChoice'>
            <label>Selecione a imagem</label>
            <input onChange={handleImagemChange} type='file' accept='image/*' />
          </div>

          <div className='filterChoice'>
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
        </div>
        <div className='texto-filtro'>{TEXTO_FILTROS[filtro]}</div>
        <div className='form-actions'>
          <button className='btn-primary' type='submit' disabled={carregando}>{carregando ? 'Processando...' : 'Aplicar Filtro'}</button>
        </div>
      </form>

      <div className='images'>
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
            <div>
              <button className='btn-download' type='button' onClick={handleDownload}>Fazer download da imagem</button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default App
