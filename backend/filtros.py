from PIL import Image
import numpy as np
import math

def processar_filtro(img_pil: Image.Image, filtro: str) -> Image.Image:
    largura, altura = img_pil.size
    pixels = img_pil.load()

    # Transforma a imagem para tons de cinza
    img_cinza = transformar_cinza(largura, altura, pixels)
    pixels_cinza = img_cinza.load()
    matriz_pixels = [[pixels_cinza[x, y] for x in range(largura)] for y in range (altura)]

    # Cálculo do histograma
    h = histograma(largura, altura, pixels_cinza)

    # Transforma a imagem em preto e branco (binarizada)
    img_binarizada = limiarizar(largura, altura, h, pixels_cinza) 
    pixels_binarizada = img_binarizada.load()
    matriz_binarizada = [[pixels_binarizada[x, y] for x in range (largura)] for y in range (altura)]

    # ========== ESCOLHA DO FILTRO ==========
    
    if filtro == "cinza":
        return img_cinza

    elif filtro == "equalizar":
        return equalizar(largura, altura, pixels_cinza, h)

    elif filtro == "binarizar":
        return img_binarizada

    elif filtro == "blur":
        kernel_media = [[1/81]*9 for _ in range(9)]
        return matriz_para_array(aplicar_kernel(matriz_pixels, kernel_media, altura, largura))

    elif filtro == "bordas":
        kernel_bordas = [[-1, -1, -1], [-1, 8, -1], [-1, -1, -1]]
        return matriz_para_array(aplicar_kernel(matriz_pixels, kernel_bordas, altura, largura))

    elif filtro == "emboss":
        kernel_emboss = [[-2, -1, 0], [-1, 1, 1], [0, 1, 2]]
        return matriz_para_array(aplicar_kernel(matriz_pixels, kernel_emboss, altura, largura))

    elif filtro == "motionBlur":
        kernel_motion_blur = create_kernel_motion_blur(9)
        return matriz_para_array(aplicar_kernel(matriz_pixels, kernel_motion_blur, altura, largura))

    elif filtro == "sobel":
        sobel_x = [[-1, 0, 1], [-2, 0, 2], [-1, 0, 1]]
        sobel_y = [[-1, -2, -1], [0, 0, 0], [1, 2, 1]]

        gx_sobel = aplicar_kernel_bruto(matriz_pixels, sobel_x, altura, largura)
        gy_sobel = aplicar_kernel_bruto(matriz_pixels, sobel_y, altura, largura)

        return matriz_para_array(combina_magnitude(gx_sobel, gy_sobel, altura, largura))

    elif filtro == "prewitt":
        prewitt_x = [[-1,0,1],[-1,0,1],[-1,0,1]]
        prewitt_y = [[-1,-1,-1],[0,0,0],[1,1,1]]

        gx_prewitt = aplicar_kernel_bruto(matriz_pixels, prewitt_x, altura, largura)
        gy_prewitt = aplicar_kernel_bruto(matriz_pixels, prewitt_y, altura, largura)

        return matriz_para_array(combina_magnitude(gx_prewitt, gy_prewitt, altura, largura))

    elif filtro == "mediana":
        return matriz_para_array(filtro_mediana(matriz_pixels, 3, altura, largura))

    elif filtro == "dilatacao":
        return matriz_para_array(filtro_dilatacao(matriz_binarizada, 3, altura, largura))

    elif filtro == "erosao":
        return matriz_para_array(filtro_erosao(matriz_binarizada, 3, altura, largura))

    elif filtro == "abertura":
        return matriz_para_array(filtro_abertura(matriz_binarizada, 3, altura, largura))

    elif filtro == "fechamento":
        return matriz_para_array(filtro_fechamento(matriz_binarizada, 3, altura, largura))

    else:
        raise ValueError ("Filtro não reconhecido")



def matriz_para_array(saida_original):
    # Converte a matriz para um array do numpy do tipo uint8
    saida_np = np.array(saida_original, dtype = np.uint8)
    imagem_saida = Image.fromarray(saida_np)

    return imagem_saida


def transformar_cinza(largura, altura, pixels):
    imagem_cinza = Image.new("RGB", (largura, altura))   
    pixels_cinza = imagem_cinza.load()

    for x in range (largura):
        for y in range (altura):
            r, g, b = pixels[x, y]

            novo_rgb = (r + g + b)//3
            pixels_cinza[x,y] = (novo_rgb, novo_rgb, novo_rgb)

    imagem_cinza.save("./saida_cinza.webp")
    return imagem_cinza


def histograma(largura, altura, pixels_cinza):
    h = [0]*256  # Vetor de 256 posições com 0
    for x in range (largura):
        for y in range (altura):
            i = pixels_cinza[x,y][0]
            h[i] += 1

    return h
   

def equalizar(largura, altura, pixels_cinza, h):
    N = largura * altura

    # CDF (distribuição acumulada)
    cdf = [0] * 256
    soma = 0
    for i in range (256):
        soma += h[i]
        cdf[i] = soma

    # Tabela com novas intensidades
    nova_tabela = [0] * 256
    for i in range (256):
        nova_tabela[i] = round((cdf[i] * 255)/N)

    imagem_equalizada = Image.new("RGB", (largura, altura))
    pixels_saida = imagem_equalizada.load()

    for x in range (largura):
        for y in range (altura):
            novo_tom = nova_tabela[pixels_cinza[x,y][0]]
            pixels_saida[x, y] = (novo_tom, novo_tom, novo_tom)

    imagem_equalizada.save("./saida_equalizada.webp")
    return imagem_equalizada


# Função para encontrar o melhor T para a função de limiarização
def encontrar_melhor_t(largura, altura, h):
    total_pixels = largura*altura
    soma_total = sum(i * h[i] for i in range (256))  # Realiza uma soma ponderada para armazenar a intensidade total

    soma_fundo = pixels_fundo = maior_variancia = melhor_t = 0

    for t in range (256):
        pixels_fundo += h[t]  # Quantidade de pixels considerados "do fundo"

        if pixels_fundo == 0:
            continue

        pixels_objeto = total_pixels - pixels_fundo  # Quantidade de pixels que representam objetos
        if pixels_objeto == 0:
            break

        soma_fundo += t * h[t]
        media_fundo = soma_fundo/pixels_fundo  # Calcula a média de RGB dos pixels no fundo
        soma_objeto = soma_total - soma_fundo
        media_objeto = soma_objeto/pixels_objeto  # Calcula a média de RGB dos pixels de objetos

        # Aplicando a fórmula da separabilidade de Otsu
        variancia = pixels_fundo * pixels_objeto * ((media_fundo - media_objeto)**2)

        if variancia > maior_variancia:
            maior_variancia = variancia
            melhor_t = t

    return melhor_t

def limiarizar(largura, altura, h, pixels_cinza):
    T = encontrar_melhor_t(largura, altura, h)
    imagem_binarizada = Image.new("RGB", (largura, altura))
    pixels_saida = imagem_binarizada.load()

    for x in range (largura):
        for y in range (altura):
            if pixels_cinza[x, y][0] <= T:
                pixels_saida[x, y] = (0, 0, 0)
            else:
                pixels_saida[x, y] = (255, 255, 255)

    imagem_binarizada.save("./saida_binarizada.webp")
    return imagem_binarizada


def aplicar_kernel(imagem, kernel, altura, largura):
    k = len(kernel)
    borda = k // 2

    saida = [[0] * largura for _ in range (altura)]

    # Passa por todos os pixels (tirando as bordas)
    for y in range(borda, altura - borda):
        for x in range(borda, largura - borda):
            soma = 0.0

            # Aplica a matriz k x k sobre o pixel [x, y]
            for i in range(k):
                idx_y = y + i - borda
                for j in range(k):
                    idx_x = x + j - borda
                    soma += imagem[idx_y][idx_x][0] * kernel[i][j]

            saida[y][x] = max(0, min(255, round(soma)))

    return saida


def aplicar_kernel_bruto(imagem, kernel, altura, largura):   # Função da aplicação de kernel sem arredondamentos
    k = len(kernel)
    borda = k // 2

    saida = [[0] * largura for _ in range (altura)]

    # Passa por todos os pixels (tirando as bordas)
    for y in range(borda, altura - borda):
        for x in range(borda, largura - borda):
            soma = 0.0

            # Aplica a matriz k x k sobre o pixel [x, y]
            for i in range(k):
                idx_y = y + i - borda
                for j in range(k):
                    idx_x = x + j - borda
                    soma += imagem[idx_y][idx_x][0] * kernel[i][j]

            saida[y][x] = soma

    return saida


def create_kernel_motion_blur(n):
    kernel = [[0] * n for _ in range (n)]

    for i in range (n):
        kernel[i][i] = 1/n

    return kernel


def combina_magnitude(gx, gy, altura, largura):
    nova_saida = [[0] * largura for _ in range (altura)]
    for y in range (altura):
        for x in range (largura):
            mag = math.sqrt((gx[y][x])**2 + (gy[y][x])**2)
            nova_saida[y][x] = min(255, round(mag))

    return nova_saida


def filtro_mediana(imagem, n, altura, largura):
    borda = n // 2
    saida = [[0] * largura for _ in range (altura)]

    for y in range(borda, altura - borda):
        for x in range(borda, largura - borda):
            vizinhos = []
            for i in range(n):
                for j in range(n):
                    vizinhos.append(imagem[y+i-borda][x+j-borda][0])

            vizinhos.sort()
            mediana = len(vizinhos) // 2
            saida[y][x] = vizinhos[mediana]

    return saida


def filtro_dilatacao(imagem, n, altura, largura):
    borda = n // 2
    saida = [[0] * largura for _ in range (altura)]

    for y in range(borda, altura - borda):
        for x in range(borda, largura - borda):
            vizinhos = []

            for i in range(n):
                for j in range(n):
                    idx_y = y + i - borda
                    idx_x = x + j - borda

                    valor = imagem[idx_y][idx_x]
                    pixel_valor = valor[0] if isinstance(valor, (tuple, list)) else valor  # Se for tupla ou lista, pega o primeiro valor RGB

                    vizinhos.append(pixel_valor)                    

            saida[y][x] = max(vizinhos)

    return saida

def filtro_erosao(imagem, n, altura, largura):
    borda = n // 2
    saida = [[0] * largura for _ in range (altura)]

    for y in range (borda, altura - borda):
        for x in range(borda, largura - borda):
            vizinhos = []

            for i in range(n):
                for j in range(n):
                    idx_y = y + i - borda
                    idx_x = x + j - borda

                    valor = imagem[idx_y][idx_x]
                    pixel_valor = valor[0] if isinstance(valor, (tuple, list)) else valor  # Se for tupla ou lista, pega o primeiro valor RGB

                    vizinhos.append(pixel_valor)

            saida[y][x] = min(vizinhos)

    return saida

def filtro_abertura(imagem, n, altura, largura):
    return filtro_dilatacao(filtro_erosao(imagem, n, altura, largura), n, altura, largura)

def filtro_fechamento(imagem, n, altura, largura):
    return filtro_erosao(filtro_dilatacao(imagem, n, altura, largura), n, altura, largura)