#!/usr/bin/env python3
from urllib.parse import urlparse
import re

def extract_product_name(url):
    parsed = urlparse(url)
    pathname = parsed.path.lower()
    
    # Split por '/' e filtra partes vazias e que começam com dígito
    parts = [part for part in pathname.split('/') if part and not re.match(r'^\d', part)]
    
    # Junta com '-'
    name = '-'.join(parts)
    
    # Aplica as substituições
    name = re.sub(r'-p-', '-', name)
    name = re.sub(r'-\d+$', '', name)
    name = re.sub(r'mlb-\d+', '', name, flags=re.IGNORECASE)
    name = re.sub(r'[^a-z0-9-]', '', name)
    name = re.sub(r'-+', '-', name)
    name = name.strip('-')
    
    # Converte para display (primeira letra maiúscula)
    display = name.replace('-', ' ').title()
    
    return display if name else 'produto'

urls = [
    "https://www.mercadolivre.com.br/manta-fleece-casal-maciez-e-conforto-1-80-2-20-cor-bege/p/MLB40969826",
    "https://www.mercadolivre.com.br/escorredor-de-silicone-macarrao-alimento-retratil-borracha/up/MLBU3796784893",
    "https://www.mercadolivre.com.br/escorredor-de-louca-inoxidavel-2-andares-drenagem-automatica-bandeja-grande-360o-organizador-pia-com-porta-pratos-tigelas-talheres-copos/p/MLB75829923",
    "https://www.mercadolivre.com.br/balanca-digital-10kg-aco-inox-para-cozinha-dieta-pesar/up/MLBU4790177298",
    "https://www.amazon.com.br/Kit-60-Prendedores-Roupa-Pl%C3%A1stico/dp/B0H95JNT57",
    "https://www.riachuelo.com.br/edredom-casal-microfibra-dupla-face-liso-bege-casa-riachuelo-15999335001_sku_sku",
    "https://www.mercadolivre.com.br/edredom-plumage-casal-220-x-240-toque-de-pluma-400-fios-cor-branco/p/MLB53264816",
    "https://www.mercadolivre.com.br/edredom-casal-padrao-pele-carneiro-coberdrom-super-quente-cor-avela/p/MLB46831068",
    "https://www.mercadolivre.com.br/kit-10-potes-hermeticos-alimentos-480-1000-2200ml-paramount/p/MLB23666833",
    "https://www.mercadolivre.com.br/electrolux-kit-12-potes-hermeticos-de-plastico-retangulares/p/MLB23191928",
    "https://www.mercadolivre.com.br/faqueiro-dourado-kit-24-pcs-luxo-com-maleta-premium--complet/up/MLBU3244916895",
]

for url in urls:
    name = extract_product_name(url)
    print(f'"{name}": true,')
