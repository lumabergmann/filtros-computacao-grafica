# Processador de Filtros de Imagens 🖼️

Este projeto é uma aplicação web desenvolvida para aplicação de filtros digitais e processamento de imagens. A arquitetura conta com um backend em **Python (FastAPI)** responsável pelas rotas e processamento matemático das matrizes de pixels, e um frontend dinâmico construído com **React (Vite)**.

---

## 🛠️ Tecnologias Utilizadas

* **Backend:**
* Python 3
* FastAPI
* Pillow / PIL (Manipulação de imagens)
* NumPy (Operações com matrizes)
* Uvicorn (Servidor ASGI)


* **Frontend:**
* React.js
* Vite
* JavaScript (ES6+)
* HTML5 & CSS3



---

## 📁 Estrutura de Diretórios

```text
filtros-computacao-grafica/
│
├── backend/
│   ├── filtros.py            # Funções de processamento de imagem e aplicação de kernels
│   ├── main.py               # Servidor FastAPI com rotas e CORS
│   └── requirements.txt      # Dependências do Python
│
└── frontend/
    ├── src/
    │   ├── App.jsx           # Componente principal React
    │   └── App.css           # Estilização da interface
    ├── package.json          # Dependências do Node.js
    └── vite.config.js        # Configurações do Vite

```

---

## 🚀 Como Executar o Projeto

Siga os passos abaixo para rodar a aplicação localmente no seu computador.

### 1. Pré-requisitos

* **Python** (versão 3.8 ou superior)
* **Node.js** (versão 18 ou superior) + **npm**

---

### 2. Configurando e Executando o Backend (API)

1. Abra o terminal e navegue até a pasta do backend:
```bash
cd backend

```


2. Crie um ambiente virtual (opcional, mas recomendado):
```bash
python -m venv venv

```


3. Ative o ambiente virtual:
* **Linux/Mac:** `source venv/bin/activate`
* **Windows (PowerShell):** `.\venv\Scripts\Activate.ps1`
* **Windows (CMD):** `.\venv\Scripts\activate.bat`


4. Instale as dependências:
```bash
pip install -r requirements.txt

```


5. Inicie o servidor da API:
```bash
fastapi dev main.py

```



O backend estará rodando em `[http://127.0.0.1:8000](http://127.0.0.1:8000)` (você pode conferir a documentação interativa em `[http://127.0.0.1:8000/docs](http://127.0.0.1:8000/docs)`).

---

### 3. Configurando e Executando o Frontend (React)

1. Abra um novo terminal e navegue até a pasta do frontend:
```bash
cd frontend

```


2. Instale as dependências do Node:
```bash
npm install

```


3. Inicie o servidor de desenvolvimento do Vite:
```bash
npm run dev

```



O frontend estará acessível no endereço indicado no terminal (geralmente `http://localhost:5173`).

---

## 🎨 Filtros Disponíveis na Aplicação

* **Tons de Cinza & Binarização:** Conversão em escala de cinza e limiarização automática (Algoritmo de Otsu).
* **Contraste & Histograma:** Equalização de histograma.
* **Filtros Espaciais (Convolução):** Blur (Média), Motion Blur, Detecção de Bordas, Emboss, Sobel e Prewitt.
* **Filtros Não-Lineares & Morfológicos:** Mediana, Dilatação, Erosão, Abertura e Fechamento.

---

## 📁 Extensões Aceitas no Upload de Imagem

Apenas imagens com extensão **.jpg**, **.png** e **.webp** são aceitas.

---

## ⚠️ Recomendações de Uso e Desempenho

* **Tamanho do Arquivo:** Recomenda-se enviar imagens de até **4 MB** para evitar espera excessiva.
* **Impacto da Intensidade:** Filtros com tamanho de matriz alto (alta intensidade) em imagens acima de Full HD podem atingir o *timeout* da requisição no servidor.

--- 

## 🖼️ Tratamento de Bordas em Filtros Espaciais e Morfológicos

Ao aplicar filtros baseados em **convolução de matrizes** ou **operações morfológicas**, é possível notar que uma moldura preta é gerada em volta da imagem de saída.

### Por que isso acontece?

Esses filtros calculam o novo valor de um pixel com base na sua **vizinhança** (uma matriz de tamanho $K \times K$, onde $K$ é a intensidade do filtro escolhida pelo usuário):

1. **Pixel Central e Vizinhança completa:** Para um pixel localizado no meio da imagem, o algoritmo consegue ler sem problemas os pixels vizinhos acima, abaixo, à esquerda e à direita.
2. **Pixels das Extremidades (Bordas):** Quando o algoritmo tenta calcular a vizinhança para um pixel localizado nas bordas extremas da imagem, a matriz sobressai para fora dos limites da imagem (índices negativos ou maiores que a largura/altura).

Para evitar erros de índice (*Out of Bounds*) durante o cálculo matricial, os laços de repetição iniciam a partir da margem limite. 

Como a matriz de saída é inicializada com zeros (`0.0`), os pixels pertencentes a essa margem perimétrica mantêm o valor `0` (correspondente ao tom de **preto** absoluto na imagem final). Quanto maior for o tamanho da intensidade ($K$) selecionada no slider, maior será a espessura da borda preta preservada ao redor do resultado.

---

## 📝 Licença

Este projeto está sob a licença MIT. Veja o arquivo [LICENSE](LICENSE) para mais detalhes.

---
Copyright © 2026 - Luma da Silva Bergmann
