// Dados do produto selecionado
let selectedProduct = null;

// Chave PIX dos noivos (exemplo)
const PIX_KEY = '14604110646';

// Função para carregar o produto selecionado
function loadSelectedProduct() {
    try {
        // Recuperar produto do localStorage
        const productData = localStorage.getItem('selectedProduct');
        
        if (!productData) {
            // Se não houver produto, redirecionar para a página principal
            window.location.href = 'index.html';
            return;
        }
        
        selectedProduct = JSON.parse(productData);
        updateProductDisplay();
        updatePIXDetails();
        
    } catch (error) {
        console.error('Erro ao carregar produto:', error);
        window.location.href = 'index.html';
    }
}

// Função para atualizar a exibição do produto
function updateProductDisplay() {
    if (!selectedProduct) return;
    
    // Atualizar nome do produto
    const productNameElement = document.getElementById('productName');
    if (productNameElement) {
        productNameElement.textContent = selectedProduct.name;
    }
    
    // Atualizar preço
    const productPriceElement = document.getElementById('productPrice');
    const pixValueElement = document.getElementById('pixValue');
    
    if (productPriceElement) {
        productPriceElement.textContent = selectedProduct.originalPrice;
    }
    
    if (pixValueElement) {
        pixValueElement.textContent = selectedProduct.originalPrice;
    }
    
    // Atualizar imagem
    const productImageElement = document.getElementById('productImage');
    if (productImageElement) {
        productImageElement.style.backgroundImage = `url('${selectedProduct.image}')`;
        
        // Remover ícone placeholder se houver imagem
        if (selectedProduct.image !== 'imagens/placeholder.jpg' && !selectedProduct.image.includes('placeholder')) {
            productImageElement.innerHTML = '';
        } else {
            productImageElement.innerHTML = '<i class="fas fa-gift"></i>';
        }
    }
    
    // Mostrar/ocultar aviso de voltagem
    const voltageWarning = document.getElementById('voltageWarning');
    if (voltageWarning) {
        if (selectedProduct.isElectroElectronic) {
            voltageWarning.style.display = 'flex';
        } else {
            voltageWarning.style.display = 'none';
        }
    }
    
    // Atualizar informações de compra externa
    updateExternalPurchaseInfo();
}

// Função para atualizar detalhes do PIX
function updatePIXDetails() {
    const pixKeyElement = document.getElementById('pixKey');
    if (pixKeyElement) {
        pixKeyElement.textContent = PIX_KEY;
    }
}

// Função para atualizar informações de compra externa
function updateExternalPurchaseInfo() {
    if (!selectedProduct) return;
    
    const externalProductName = document.getElementById('externalProductName');
    const externalProductPrice = document.getElementById('externalProductPrice');
    const externalStore = document.getElementById('externalStore');
    const externalLinkBtn = document.getElementById('externalLinkBtn');
    
    if (externalProductName) {
        externalProductName.textContent = selectedProduct.name;
    }
    
    if (externalProductPrice) {
        externalProductPrice.textContent = selectedProduct.originalPrice;
    }
    
    if (externalStore) {
        // Extrair nome da loja da URL
        let storeName = 'Loja Online';
        if (selectedProduct.url.includes('mercadolivre.com.br')) {
            storeName = 'Mercado Livre';
        } else if (selectedProduct.url.includes('magazineluiza.com.br')) {
            storeName = 'Magazine Luiza';
        } else if (selectedProduct.url.includes('carrefour.com.br')) {
            storeName = 'Carrefour';
        } else if (selectedProduct.url.includes('shopee.com.br')) {
            storeName = 'Shopee';
        } else if (selectedProduct.url.includes('westwing.com.br')) {
            storeName = 'Westwing';
        }
        externalStore.textContent = storeName;
    }
    
    if (externalLinkBtn) {
        externalLinkBtn.href = selectedProduct.url;
    }
}

// Função para copiar chave PIX
function copyPIXKey() {
    navigator.clipboard.writeText(PIX_KEY)
        .then(() => {
            showToast('Chave PIX copiada para a área de transferência!');
        })
        .catch(err => {
            console.error('Erro ao copiar chave PIX:', err);
            showToast('Erro ao copiar chave PIX');
        });
}

// Função para copiar link do produto
function copyProductLink() {
    if (!selectedProduct) return;
    
    navigator.clipboard.writeText(selectedProduct.url)
        .then(() => {
            showToast('Link do produto copiado para a área de transferência!');
        })
        .catch(err => {
            console.error('Erro ao copiar link:', err);
            showToast('Erro ao copiar link');
        });
}

// Função para mostrar toast de confirmação
function showToast(message) {
    const toast = document.getElementById('copyToast');
    const toastContent = toast.querySelector('span');
    
    if (toastContent) {
        toastContent.textContent = message;
    }
    
    toast.classList.add('show');
    
    // Esconder toast após 3 segundos
    setTimeout(() => {
        toast.classList.remove('show');
    }, 3000);
}

// Função para gerar mensagem do WhatsApp
function generateWhatsAppMessage(recipient) {
    if (!selectedProduct) return '';
    
    let message = `Oi ${recipient}! Acabei de garantir o presente "${selectedProduct.name}" da lista de vocês! `;
    
    if (selectedProduct.isElectroElectronic) {
        message += `Verifiquei que a voltagem é 110V. `;
    }
    
    message += `Segue o comprovante/aviso para atualizarem a lista. Obrigado!`;
    
    return encodeURIComponent(message);
}

// Função para abrir WhatsApp
function openWhatsApp(phoneNumber, recipientName) {
    const message = generateWhatsAppMessage(recipientName);
    const whatsappUrl = `https://wa.me/${phoneNumber}?text=${message}`;
    window.open(whatsappUrl, '_blank');
}

// Função para inicializar eventos
function initializeCheckoutEvents() {
    // Botão copiar chave PIX
    const copyPixBtn = document.getElementById('copyPixBtn');
    if (copyPixBtn) {
        copyPixBtn.addEventListener('click', copyPIXKey);
    }
    
    // Botão copiar link do produto
    const copyLinkBtn = document.getElementById('copyLinkBtn');
    if (copyLinkBtn) {
        copyLinkBtn.addEventListener('click', copyProductLink);
    }
    
    // Botões WhatsApp
    const whatsappJoaoBtn = document.getElementById('whatsappJoaoBtn');
    const whatsappMaisaBtn = document.getElementById('whatsappMaisaBtn');
    const whatsappBothBtn = document.getElementById('whatsappBothBtn');
    
    if (whatsappJoaoBtn) {
        whatsappJoaoBtn.addEventListener('click', () => {
            openWhatsApp('5531986750249', 'João');
        });
    }
    
    if (whatsappMaisaBtn) {
        whatsappMaisaBtn.addEventListener('click', () => {
            openWhatsApp('5531996997590', 'Maisa');
        });
    }
    
    if (whatsappBothBtn) {
        whatsappBothBtn.addEventListener('click', () => {
            // Abre WhatsApp para João
            const message = generateWhatsAppMessage('João e Maisa');
            const whatsappUrl = `https://wa.me/5531986750249?text=${message}`;
            window.open(whatsappUrl, '_blank');
            
            // Pequeno delay e abre para Maisa também
            setTimeout(() => {
                window.open(`https://wa.me/5531996997590?text=${message}`, '_blank');
            }, 500);
        });
    }
    
    // Efeito hover nas opções
    const optionCards = document.querySelectorAll('.option-card');
    optionCards.forEach(card => {
        card.addEventListener('mouseenter', () => {
            card.style.transform = 'translateY(-5px)';
            card.style.boxShadow = '0 10px 25px rgba(0, 0, 0, 0.15)';
        });
        
        card.addEventListener('mouseleave', () => {
            card.style.transform = 'translateY(0)';
            card.style.boxShadow = '0 4px 12px rgba(0, 0, 0, 0.08)';
        });
    });
    
    // Botões de WhatsApp hover effect
    const whatsappButtons = document.querySelectorAll('.btn-whatsapp');
    whatsappButtons.forEach(button => {
        button.addEventListener('mouseenter', () => {
            button.style.transform = 'translateY(-3px) scale(1.02)';
        });
        
        button.addEventListener('mouseleave', () => {
            button.style.transform = 'translateY(0) scale(1)';
        });
    });
    
    // Botão de compra externa hover effect
    const externalLinkBtn = document.getElementById('externalLinkBtn');
    if (externalLinkBtn) {
        externalLinkBtn.addEventListener('mouseenter', () => {
            externalLinkBtn.style.transform = 'translateY(-2px)';
        });
        
        externalLinkBtn.addEventListener('mouseleave', () => {
            externalLinkBtn.style.transform = 'translateY(0)';
        });
    }
    
    // Opção recomendada destaque
    const recommendedOption = document.getElementById('pixOption');
    if (recommendedOption) {
        recommendedOption.addEventListener('click', () => {
            recommendedOption.style.borderColor = 'var(--dark-blue)';
            setTimeout(() => {
                recommendedOption.style.borderColor = 'var(--accent-blue)';
            }, 300);
        });
    }
}

// Inicialização quando o DOM estiver carregado
document.addEventListener('DOMContentLoaded', () => {
    loadSelectedProduct();
    initializeCheckoutEvents();
    
    // Adicionar efeito de entrada
    setTimeout(() => {
        document.body.style.opacity = '1';
    }, 100);
});

// Adicionar estilo de transição de entrada
document.head.insertAdjacentHTML('beforeend', `
    <style>
        body {
            opacity: 0;
            transition: opacity 0.5s ease;
        }
        
        .product-summary,
        .checkout-options,
        .confirmation-section {
            opacity: 0;
            transform: translateY(20px);
            animation: fadeInUp 0.6s ease forwards;
        }
        
        .product-summary {
            animation-delay: 0.1s;
        }
        
        .checkout-options {
            animation-delay: 0.2s;
        }
        
        .confirmation-section {
            animation-delay: 0.3s;
        }
        
        @keyframes fadeInUp {
            to {
                opacity: 1;
                transform: translateY(0);
            }
        }
    </style>
`);