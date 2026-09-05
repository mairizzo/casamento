// Dados globais
let allProducts = [];
let filteredProducts = [];
let currentProduct = null;
let selectedPriceRange = 'all';

// Mapeamento de imagens da pasta imagens_unidas (carregado do arquivo imagens_links.json)
let imageLinksMap = {};

// Carrega o mapeamento de imagens do arquivo imagens_links.json
async function loadImageLinks() {
    try {
        const response = await fetch('imagens_links.json');
        imageLinksMap = await response.json();
        console.log('Mapeamento de imagens carregado com sucesso:', Object.keys(imageLinksMap).length, 'imagens');
    } catch (error) {
        console.error('Erro ao carregar mapeamento de imagens:', error);
        // Fallback: cria um mapeamento vazio
        imageLinksMap = {};
    }
}

// Função para normalizar nomes de arquivos (remover acentos e caracteres especiais)
function normalizeFileName(filename) {
    return filename
        .normalize('NFD') // Decompor caracteres acentuados
        .replace(/[\u0300-\u036f]/g, '') // Remover diacríticos
        .replace(/[^a-zA-Z0-9\s.\-()]/g, ' ') // Remover caracteres especiais, manter espaço, ponto, hífen
        .replace(/\s+/g, ' ') // Remover múltiplos espaços
        .trim();
}

// Função para obter nome de arquivo normalizado de um caminho
function getNormalizedImagePath(imagePath) {
    // Extrai o nome do arquivo do caminho
    const fileName = imagePath.split('/').pop();
    // Normaliza o nome do arquivo
    const normalizedName = normalizeFileName(fileName);
    // Retorna o caminho com nome normalizado
    return `imagens_unidas/${normalizedName}`;
}

// Função para encontrar a imagem correta para uma URL
function findImageForUrl(url) {
    // Normaliza a URL para buscar correspondência
    const normalizedUrl = url.toLowerCase();
    
    // Tenta encontrar correspondência direta no mapeamento
    for (const [imageName, imageUrl] of Object.entries(imageLinksMap)) {
        if (imageUrl === url) {
            // Encontrou correspondência exata - retorna o caminho da imagem
            // Usa nome de arquivo normalizado (sem acentos)
            const normalizedImageName = normalizeFileName(imageName);
            return `imagens_unidas/${normalizedImageName}`;
        }
    }
    
    // Mapeamento especial para URLs que apontam para o mesmo produto mas têm URLs diferentes
    const specialMappings = {
        // Máquina de lavar Brastemp - mapeia URLs diferentes para a mesma imagem
        'https://www.brastemp.com.br/maquina-de-lavar-brastemp-16kg-cinza-platinum-bwf16a9/': 'Máquina de Lavar Brastemp 16Kg Cinza Platinum com Ciclo Tira Manchas Advanced e Smart Sensor - BWF16A9.webp',
        'www.brastemp.com.br/maquina-de-lavar-brastemp-16kg-cinza-platinum-bwf16a9': 'Máquina de Lavar Brastemp 16Kg Cinza Platinum com Ciclo Tira Manchas Advanced e Smart Sensor - BWF16A9.webp',
        'brastemp.com.br/maquina-de-lavar-brastemp-16kg-cinza-platinum-bwf16a9': 'Máquina de Lavar Brastemp 16Kg Cinza Platinum com Ciclo Tira Manchas Advanced e Smart Sensor - BWF16A9.webp'
    };
    
    // Verifica mapeamentos especiais
    for (const [pattern, imageName] of Object.entries(specialMappings)) {
        if (normalizedUrl.includes(pattern.toLowerCase())) {
            // Usa nome de arquivo normalizado (sem acentos)
            const normalizedImageName = normalizeFileName(imageName);
            return `imagens_unidas/${normalizedImageName}`;
        }
    }
    
    // Se não encontrou correspondência exata, tenta encontrar por palavras-chave
    const urlParts = normalizedUrl.split('/');
    const lastPart = urlParts[urlParts.length - 1];
    
    // Extrai palavras-chave da URL
    const keywords = lastPart
        .replace(/[^a-z0-9\s]/g, ' ')
        .split(/\s+/)
        .filter(word => word.length > 3);
    
    let bestMatch = null;
    let bestScore = 0;
    
    // Procura pela melhor correspondência nos nomes das imagens
    for (const imageName of Object.keys(imageLinksMap)) {
        // Normaliza o nome da imagem para comparação (remove acentos)
        const normalizedImageName = normalizeFileName(imageName).toLowerCase();
        let score = 0;
        
        // Verifica cada palavra-chave
        for (const keyword of keywords) {
            if (normalizedImageName.includes(keyword)) {
                score += keyword.length; // Pontua baseada no tamanho da palavra
            }
        }
        
        if (score > bestScore) {
            bestScore = score;
            bestMatch = imageName;
        }
    }
    
    // Se encontrou uma correspondência razoável, usa-a
    if (bestScore > 5 && bestMatch) {
        // Usa nome de arquivo normalizado (sem acentos)
        const normalizedImageName = normalizeFileName(bestMatch);
        return `imagens_unidas/${normalizedImageName}`;
    }
    
    // Fallback: placeholder
    return 'imagens/placeholder.jpg';
}

// NOVA FUNÇÃO: Encontra a imagem usando o mapeamento carregado
function findBestImageMatch(url) {
    // Primeiro tenta usar o sistema de mapeamento
    if (Object.keys(imageLinksMap).length > 0) {
        return findImageForUrl(url);
    }
    
    // Fallback para sistema antigo (usado apenas se não houver mapeamento)
    const keywords = extractProductName(url).toLowerCase().split('-').filter(w => w.length > 2);
    
    let bestMatch = 'imagens/placeholder.jpg';
    let maxMatches = 0;
    
    // Lista de imagens da pasta imagens_unidas (fallback)
    const fallbackImages = [
        'imagens_unidas/Fogão Brastemp 4 Bocas Preto Com Mesa De Vidro E Dupla Chama BIVOLT.webp',
        'imagens_unidas/Microondas Panasonic Dupla Refeição 34L Black Glass - NN-ST66NBRU.webp',
        'imagens_unidas/Lava-louça Electrolux 8 Serviços Lava E Seca 50 Min (lp08e) Preto.webp',
        'imagens_unidas/Máquina de Lavar Brastemp 16Kg Cinza Platinum com Ciclo Tira Manchas Advanced e Smart Sensor - BWF16A9.webp',
        'imagens_unidas/Depurador De Ar Electrolux 60cm Preto Alto Poder De Sucção, Preto.webp',
        'imagens_unidas/Purificador Electrolux Água Fria Natural Gelada Preto Pe15p.webp',
        'imagens_unidas/Fritadeira Air Fryer Oven Mondial Afon-12l-fg 12l Digital 20 Preto.webp',
        'imagens_unidas/Multiprocessador Britânia 5 Em 1 Bmp2000 1300w Cor Prateado.webp',
        'imagens_unidas/Batedeira Britânia Diamante Inox Turbo Duo 4,3l 550w Preto.webp',
        'imagens_unidas/Mixer Master Mix 5 Em 1 Elgin 1.000w 110v 5 Funções Prateado.webp'
    ];
    
    for (const imgPath of fallbackImages) {
        const cleanImgName = imgPath.toLowerCase();
        let matches = 0;
        
        keywords.forEach(kw => {
            if (cleanImgName.includes(kw)) {
                matches++;
            }
        });
        
        if (matches > maxMatches) {
            maxMatches = matches;
            bestMatch = imgPath;
        }
    }
    
    return maxMatches >= 1 ? bestMatch : 'imagens/placeholder.jpg';
}

function extractProductName(url) {
    const urlObj = new URL(url);
    const pathname = urlObj.pathname.toLowerCase();
    
    let name = pathname.split('/')
        .filter(part => part && !part.match(/^\d/))
        .join('-')
        .replace(/-p-/, '-')
        .replace(/-\d+$/, '')
        .replace(/mlb-\d+/gi, '')
        .replace(/[^a-z0-9-]/g, '')
        .replace(/-+/g, '-')
        .replace(/^-|-$/g, '');
    
    return name || 'produto';
}

function isElectroElectronic(productName) {
    const keywords = [
        'fogao', 'microondas', 'lava-louca', 'maquina-de-lavar', 'depurador',
        'purificador', 'fritadeira', 'multiprocessador', 'batedeira', 'mixer',
        'chaleira', 'sanduicheira', 'grill', 'torradeira', 'centrifuga',
        'panificadora', 'waffle', 'panquequeira', 'crepeira', 'pipoqueira',
        'churrasqueira', 'balanca', 'panela-de-pressao-eletrica'
    ];
    return keywords.some(keyword => productName.includes(keyword));
}

async function loadProducts() {
    try {
        // Primeiro carrega o mapeamento de imagens
        await loadImageLinks();
        
        const response = await fetch('links.txt');
        const text = await response.text();
        const lines = text.trim().split('\n');
        
        allProducts = lines.map((line, index) => {
            const parts = line.split('\t');
            if (parts.length >= 2) {
                const priceStr = parts[0].trim();
                const url = parts[1].trim();
                
                const priceMatch = priceStr.match(/R\$\s*([\d.,]+)/);
                let price = 0;
                
                if (priceMatch) {
                    price = parseFloat(priceMatch[1].replace('.', '').replace(',', '.'));
                }
                
                // Extrai o nome sujo (com hífens) para usar na busca da imagem
                const rawExtractedName = extractProductName(url);
                // Limpa o nome para exibir na tela
                let name = rawExtractedName.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
                
                if (!name || name.length < 5) {
                    name = `Produto ${index + 1}`;
                }
                
                // Busca a imagem correta usando a URL completa
                const image = findBestImageMatch(url);
                
                return {
                    name: name,
                    price: price,
                    originalPrice: priceStr,
                    url: url,
                    image: image,
                    isElectroElectronic: isElectroElectronic(name.toLowerCase()),
                    index: index + 1
                };
            }
            return null;
        }).filter(product => product !== null);
        
        allProducts.sort((a, b) => b.price - a.price);
        
        filteredProducts = [...allProducts];
        updateProductDisplay();
        updateStats();
        
    } catch (error) {
        console.error('Erro ao carregar produtos:', error);
        showFallbackProducts();
    }
}

// Produtos de fallback caso o arquivo não carregue
function showFallbackProducts() {
    allProducts = [
        {
            name: 'Fogão Brastemp 4 Bocas',
            price: 1500.00,
            originalPrice: 'R$ 1.500,00',
            image: 'imagens_unidas/Fogão Brastemp 4 Bocas Preto Com Mesa De Vidro E Dupla Chama BIVOLT.webp',
            isElectroElectronic: true
        },
        {
            name: 'Microondas Panasonic',
            price: 700.00,
            originalPrice: 'R$ 700,00',
            image: 'imagens_unidas/Microondas Panasonic Dupla Refeição 34L Black Glass - NN-ST66NBRU.webp',
            isElectroElectronic: true
        },
        {
            name: 'Lava Louça Electrolux',
            price: 2000.00,
            originalPrice: 'R$ 2.000,00',
            image: 'imagens_unidas/Lava-louça Electrolux 8 Serviços Lava E Seca 50 Min (lp08e) Preto.webp',
            isElectroElectronic: true
        }
    ];
    
    filteredProducts = [...allProducts];
    updateProductDisplay();
    updateStats();
}

// Função para filtrar produtos por faixa de preço
function filterProductsByPrice(range) {
    selectedPriceRange = range;
    
    if (range === 'all') {
        filteredProducts = [...allProducts];
    } else {
        const [min, max] = range.split('-').map(Number);
        filteredProducts = allProducts.filter(product => {
            if (range === '1001-2000') {
                return product.price > 1000;
            }
            return product.price >= min && product.price <= max;
        });
    }
    
    updateProductDisplay();
    updateStats();
    updateActiveFilters();
}

// Função para atualizar a exibição dos produtos
function updateProductDisplay() {
    const productsGrid = document.getElementById('productsGrid');
    const noProductsMessage = document.getElementById('noProductsMessage');
    
    if (!productsGrid) return;
    
    // Limpar grid
    productsGrid.innerHTML = '';
    
    if (filteredProducts.length === 0) {
        noProductsMessage.style.display = 'block';
        return;
    }
    
    noProductsMessage.style.display = 'none';
    
    // Adicionar produtos ao grid
    filteredProducts.forEach(product => {
        const productCard = createProductCard(product);
        productsGrid.appendChild(productCard);
    });
}

// Função para criar um card de produto
function createProductCard(product) {
    const card = document.createElement('div');
    card.className = 'product-card';
    
    // Determinar ícone baseado no tipo de produto
    const iconClass = product.isElectroElectronic ? 'fas fa-plug' : 'fas fa-gift';
    
    card.innerHTML = `
<div class="product-image" style="background-image: url('${encodeURI(product.image)}')">
            <i class="${iconClass}"></i>
        </div>
        <div class="product-info">
            <h4 class="product-name">${product.name}</h4>
            <div class="product-price">${product.originalPrice}</div>
            <div class="product-actions">
                <button class="btn-presentear" data-product='${JSON.stringify(product)}'>
                    <i class="fas fa-gift"></i> Presentear
                </button>
                <a href="${product.url}" target="_blank" class="btn-comprar-externo">
                    <i class="fas fa-external-link-alt"></i> Ver produto
                </a>
            </div>
        </div>
    `;
    
    // Adicionar evento ao botão Presentear
    const giftButton = card.querySelector('.btn-presentear');
    giftButton.addEventListener('click', () => handleGiftClick(product));
    
    return card;
}

// Função para atualizar estatísticas
function updateStats() {
    const totalItems = document.getElementById('totalItems');
    const filteredItems = document.getElementById('filteredItems');
    
    if (totalItems) totalItems.textContent = allProducts.length;
    if (filteredItems) filteredItems.textContent = filteredProducts.length;
}

// Função para atualizar filtros ativos
function updateActiveFilters() {
    // Atualizar badges de preço
    document.querySelectorAll('.price-badge').forEach(badge => {
        const range = badge.getAttribute('data-range');
        badge.classList.remove('active');
        
        if (range === selectedPriceRange || 
            (selectedPriceRange === 'all' && range === 'all') ||
            (selectedPriceRange === range)) {
            badge.classList.add('active');
        }
    });
    
    // Atualizar radio buttons
    document.querySelectorAll('input[name="priceFilter"]').forEach(radio => {
        radio.checked = radio.value === selectedPriceRange;
    });
}

// Função para lidar com clique no botão "Presentear"
function handleGiftClick(product) {
    currentProduct = product;
    
    // Mostrar modal de voltagem se for eletroeletrônico
    if (product.isElectroElectronic) {
        showVoltageModal();
    } else {
        // Se não for eletroeletrônico, ir direto para o checkout
        proceedToCheckout();
    }
}

// Função para mostrar modal de voltagem
function showVoltageModal() {
    const modal = document.getElementById('voltageModal');
    if (modal) {
        modal.classList.add('active');
        document.body.style.overflow = 'hidden';
    }
}

// Função para fechar modal
function closeModal() {
    const modal = document.getElementById('voltageModal');
    if (modal) {
        modal.classList.remove('active');
        document.body.style.overflow = 'auto';
    }
}

// Função para prosseguir para checkout
function proceedToCheckout() {
    if (!currentProduct) return;
    
    // Salvar produto selecionado no localStorage
    localStorage.setItem('selectedProduct', JSON.stringify(currentProduct));
    
    // Redirecionar para página de checkout
    window.location.href = 'checkout.html';
}

// Função para inicializar eventos
function initializeEvents() {
    // Eventos dos badges de preço
    document.querySelectorAll('.price-badge').forEach(badge => {
        badge.addEventListener('click', () => {
            const range = badge.getAttribute('data-range');
            filterProductsByPrice(range);
        });
    });
    
    // Eventos dos radio buttons de filtro
    document.querySelectorAll('input[name="priceFilter"]').forEach(radio => {
        radio.addEventListener('change', (e) => {
            if (e.target.checked) {
                filterProductsByPrice(e.target.value);
            }
        });
    });
    
    // Evento do botão limpar filtro
    const clearFilterBtn = document.getElementById('clearFilterBtn');
    if (clearFilterBtn) {
        clearFilterBtn.addEventListener('click', () => {
            filterProductsByPrice('all');
        });
    }
    
    // Eventos do modal
    const closeModalBtn = document.getElementById('closeModal');
    const cancelBtn = document.getElementById('cancelBtn');
    const understandBtn = document.getElementById('understandBtn');
    
    if (closeModalBtn) {
        closeModalBtn.addEventListener('click', closeModal);
    }
    
    if (cancelBtn) {
        cancelBtn.addEventListener('click', closeModal);
    }
    
    if (understandBtn) {
        understandBtn.addEventListener('click', () => {
            closeModal();
            proceedToCheckout();
        });
    }
    
    // Fechar modal clicando fora
    const modalOverlay = document.getElementById('voltageModal');
    if (modalOverlay) {
        modalOverlay.addEventListener('click', (e) => {
            if (e.target === modalOverlay) {
                closeModal();
            }
        });
    }
    
    // Eventos das opções de mensagem
    document.querySelectorAll('.message-option').forEach(option => {
        option.addEventListener('click', () => {
            document.querySelectorAll('.message-option').forEach(opt => {
                opt.classList.remove('active');
            });
            option.classList.add('active');
        });
    });
    
    // Selecionar primeira opção de mensagem por padrão
    const firstMessage = document.querySelector('.message-option');
    if (firstMessage) {
        firstMessage.classList.add('active');
    }
}

// Inicialização quando o DOM estiver carregado
document.addEventListener('DOMContentLoaded', () => {
    loadProducts();
    initializeEvents();
});