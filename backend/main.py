from fastapi import FastAPI, File, UploadFile, Form

app = FastAPI()

@app.post("/processar")
async def processar_imagem(file: UploadFile = File(...), filtro: str = Form(...)):  # O envio da imagem é obrigatório (os parâmetros recebidos não podem ser nulos)
    