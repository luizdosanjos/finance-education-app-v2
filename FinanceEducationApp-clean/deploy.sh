#!/bin/bash

# Finance Education App - Deploy Script
# Este script automatiza o processo de build e deploy do aplicativo

set -e  # Exit on any error

echo "🚀 Finance Education App - Deploy Script"
echo "========================================"

# Cores para output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Função para log colorido
log() {
    echo -e "${GREEN}[INFO]${NC} $1"
}

warn() {
    echo -e "${YELLOW}[WARN]${NC} $1"
}

error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Verificar se estamos no diretório correto
if [ ! -f "package.json" ]; then
    error "package.json não encontrado. Execute este script na raiz do projeto."
    exit 1
fi

# Verificar se Node.js está instalado
if ! command -v node &> /dev/null; then
    error "Node.js não está instalado. Instale Node.js 18+ para continuar."
    exit 1
fi

# Verificar versão do Node.js
NODE_VERSION=$(node -v | cut -d'v' -f2 | cut -d'.' -f1)
if [ "$NODE_VERSION" -lt 18 ]; then
    error "Node.js versão 18+ é necessária. Versão atual: $(node -v)"
    exit 1
fi

log "Node.js versão: $(node -v) ✓"

# Verificar se as dependências estão instaladas
if [ ! -d "node_modules" ]; then
    log "Instalando dependências..."
    npm install
fi

# Verificar se o arquivo .env existe
if [ ! -f ".env" ]; then
    warn "Arquivo .env não encontrado. Copiando .env.example..."
    cp .env.example .env
    warn "⚠️  Configure suas variáveis de ambiente no arquivo .env antes de continuar!"
    echo "Especialmente a OPENAI_API_KEY para o chat funcionar."
fi

# Executar testes TypeScript
log "Verificando tipos TypeScript..."
if npm run type-check; then
    log "Verificação de tipos passou ✓"
else
    error "Erro na verificação de tipos. Corrija os erros antes de continuar."
    exit 1
fi

# Executar linting
log "Executando linting..."
if npm run lint; then
    log "Linting passou ✓"
else
    warn "Avisos de linting encontrados. Considere corrigir antes do deploy."
fi

# Menu de opções de deploy
echo ""
echo "Escolha o tipo de deploy:"
echo "1) 📱 Build APK Debug (Android)"
echo "2) 📱 Build APK Release (Android)"
echo "3) 🌐 Deploy Web (Expo)"
echo "4) 🔄 Apenas verificar projeto"
echo "5) 📦 Preparar para produção"

read -p "Digite sua escolha (1-5): " choice

case $choice in
    1)
        log "Construindo APK Debug para Android..."
        if [ -d "android" ]; then
            cd android
            if ./gradlew assembleDebug; then
                log "APK Debug criado com sucesso! ✓"
                log "Localização: android/app/build/outputs/apk/debug/app-debug.apk"
            else
                error "Falha ao criar APK Debug"
                exit 1
            fi
            cd ..
        else
            error "Diretório android não encontrado. Este é um projeto React Native?"
            exit 1
        fi
        ;;
    2)
        log "Construindo APK Release para Android..."
        if [ -d "android" ]; then
            cd android
            if ./gradlew assembleRelease; then
                log "APK Release criado com sucesso! ✓"
                log "Localização: android/app/build/outputs/apk/release/app-release.apk"
            else
                error "Falha ao criar APK Release"
                exit 1
            fi
            cd ..
        else
            error "Diretório android não encontrado. Este é um projeto React Native?"
            exit 1
        fi
        ;;
    3)
        log "Preparando deploy web..."
        if command -v expo &> /dev/null; then
            expo build:web
            log "Build web concluído! ✓"
        else
            warn "Expo CLI não encontrado. Instalando..."
            npm install -g @expo/cli
            expo build:web
        fi
        ;;
    4)
        log "Verificando projeto..."
        log "✓ Dependências instaladas"
        log "✓ Tipos TypeScript verificados"
        log "✓ Linting executado"
        log "✓ Projeto está pronto para deploy!"
        ;;
    5)
        log "Preparando para produção..."
        
        # Limpar cache
        log "Limpando cache..."
        npm run clean || true
        
        # Reinstalar dependências
        log "Reinstalando dependências..."
        rm -rf node_modules package-lock.json
        npm install
        
        # Verificar segurança
        log "Verificando vulnerabilidades..."
        npm audit --audit-level moderate
        
        # Otimizar bundle
        log "Otimizando bundle..."
        npm run bundle || true
        
        log "Projeto preparado para produção! ✓"
        ;;
    *)
        error "Opção inválida. Escolha entre 1-5."
        exit 1
        ;;
esac

echo ""
log "Deploy concluído com sucesso! 🎉"
echo ""
echo "📋 Próximos passos:"
echo "   1. Teste o aplicativo em dispositivos reais"
echo "   2. Configure as variáveis de ambiente de produção"
echo "   3. Faça upload para as lojas de aplicativos"
echo "   4. Configure monitoramento e analytics"
echo ""
echo "📚 Documentação: README.md"
echo "🐛 Issues: https://github.com/seu-usuario/finance-education-app/issues"
echo ""
echo "💰 Transforme sua relação com o dinheiro através da educação financeira!"

