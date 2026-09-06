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
uvicorn main:app --reload

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

## 📝 Licença

Este projeto está sob a licença MIT. Veja o arquivo [LICENSE](LICENSE) para mais detalhes.

---
Copyright © 2026 - Luma da Silva Bergmann