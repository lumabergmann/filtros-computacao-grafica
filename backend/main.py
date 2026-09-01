from fastapi import FastAPI, File, UploadFile, Form, HTTPException
from fastapi.responses import Response
from pathlib import Path
from PIL import Image
import io
from filtros import processar_filtro

app = FastAPI()

@app.post("/processar")
async def processar_imagem(file: UploadFile = File(...), filtro: str = Form(...)):  # O envio da imagem e do nome do filtro é obrigatório (os parâmetros recebidos não podem ser nulos)
    extensoes_permitidas = {".jpg", ".jpeg", ".png", ".webp"}
    extensao = Path(file.filename).suffix.lower()

    if extensao not in extensoes_permitidas:
        raise HTTPException(status_code = 400, detail = f"Extensão de arquivo {extensao} não é permitida. Tipos aceitos: {', '.join(extensoes_permitidas)}.")

    try:
        conteudo_bytes = await file.read()
        imagem_original = Image.open(io.BytesIO(conteudo_bytes))  # Salva os arquivos na memória RAM (temporária)

        imagem_processada = processar_filtro(imagem_original, filtro)
        formato_original = imagem_original.format or "PNG"  # Pega o formato original da imagem

        # Salvando na memória RAM
        buffer_saida = io.BytesIO()
        imagem_processada.save(buffer_saida, format=formato_original)

        media_type = f"image/{formato_original.lower()}"

        return Response(content=buffer_saida.getvalue(), media_type=media_type)  # Retorna tudo que está armazenado no buffer

    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Erro ao processar imagem: {str(e)}")

    