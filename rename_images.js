const fs = require('fs');
const path = require('path');

// Função para remover acentos e caracteres especiais
function normalizeFileName(filename) {
    return filename
        .normalize('NFD') // Decompor caracteres acentuados
        .replace(/[\u0300-\u036f]/g, '') // Remover diacríticos
        .replace(/[^a-zA-Z0-9\s.\-()]/g, ' ') // Remover caracteres especiais
        .replace(/\s+/g, ' ') // Remover múltiplos espaços
        .trim()
        .replace(/\.webp$/i, '.webp'); // Garantir extensão correta
}

// Pasta das imagens
const imagesDir = path.join(__dirname, 'imagens_unidas');

// Ler todos os arquivos da pasta
fs.readdir(imagesDir, (err, files) => {
    if (err) {
        console.error('Erro ao ler diretório:', err);
        return;
    }
    
    console.log(`Encontrados ${files.length} arquivos na pasta imagens_unidas`);
    
    const renameMap = {};
    
    // Processar cada arquivo
    files.forEach(file => {
        const originalName = file;
        const normalizedName = normalizeFileName(file);
        
        if (originalName !== normalizedName) {
            const oldPath = path.join(imagesDir, originalName);
            const newPath = path.join(imagesDir, normalizedName);
            
            renameMap[originalName] = normalizedName;
            
            console.log(`${originalName} -> ${normalizedName}`);
            
            // Renomear arquivo
            fs.rename(oldPath, newPath, (renameErr) => {
                if (renameErr) {
                    console.error(`Erro ao renomear ${originalName}:`, renameErr);
                } else {
                    console.log(`✓ Renomeado: ${originalName} -> ${normalizedName}`);
                }
            });
        } else {
            console.log(`- Mantido: ${originalName}`);
        }
    });
    
    // Salvar mapeamento em arquivo para referência
    fs.writeFileSync(
        path.join(__dirname, 'rename_mapping.json'),
        JSON.stringify(renameMap, null, 2)
    );
    
    console.log('\nMapeamento salvo em rename_mapping.json');
    console.log('Processo concluído!');
});