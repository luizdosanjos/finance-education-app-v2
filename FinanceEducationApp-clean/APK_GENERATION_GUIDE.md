# 📱 GUIA COMPLETO - GERAR APK ANDROID

## ⚠️ **IMPORTANTE:**
O ambiente sandbox não possui Java/Android SDK instalado. 
Para gerar a APK, você precisa configurar o ambiente localmente.

## 🔧 **CONFIGURAÇÃO DO AMBIENTE:**

### **1. Instalar Java JDK 17+:**
```bash
# Ubuntu/Debian
sudo apt update
sudo apt install openjdk-17-jdk

# Windows
# Baixar de: https://www.oracle.com/java/technologies/downloads/

# macOS
brew install openjdk@17
```

### **2. Instalar Android Studio:**
- Baixar de: https://developer.android.com/studio
- Instalar Android SDK
- Configurar variáveis de ambiente

### **3. Configurar Variáveis de Ambiente:**
```bash
export ANDROID_HOME=$HOME/Android/Sdk
export PATH=$PATH:$ANDROID_HOME/emulator
export PATH=$PATH:$ANDROID_HOME/tools
export PATH=$PATH:$ANDROID_HOME/tools/bin
export PATH=$PATH:$ANDROID_HOME/platform-tools
```

## 🚀 **GERAR APK:**

### **1. Clonar o Repositório:**
```bash
git clone https://github.com/luizdosanjos/finance-education-app-v2.git
cd finance-education-app-v2
```

### **2. Instalar Dependências:**
```bash
npm install
```

### **3. Criar arquivo .env:**
```bash
cp .env.example .env
# Editar .env com suas chaves reais
```

### **4. Gerar APK Debug (Rápido):**
```bash
cd android
./gradlew assembleDebug
```

### **5. Gerar APK Release (Produção):**
```bash
cd android
./gradlew assembleRelease
```

## 📁 **LOCALIZAÇÃO DA APK:**

### **APK Debug:**
```
android/app/build/outputs/apk/debug/app-debug.apk
```

### **APK Release:**
```
android/app/build/outputs/apk/release/app-release.apk
```

## 📲 **INSTALAR NO CELULAR:**

### **1. Ativar Modo Desenvolvedor:**
- Configurações > Sobre o telefone
- Tocar 7x em "Número da versão"

### **2. Ativar Instalação de Fontes Desconhecidas:**
- Configurações > Segurança
- Ativar "Fontes desconhecidas"

### **3. Transferir e Instalar:**
- Copiar APK para o celular
- Abrir arquivo APK
- Confirmar instalação

## 🔑 **CONFIGURAR CHAVES:**

### **Arquivo .env necessário:**
```
OPENAI_API_KEY=sua-chave-aqui
FIREBASE_API_KEY=sua-chave-firebase
FIREBASE_AUTH_DOMAIN=seu-projeto.firebaseapp.com
FIREBASE_PROJECT_ID=seu-projeto-id
FIREBASE_STORAGE_BUCKET=seu-projeto.firebasestorage.app
FIREBASE_MESSAGING_SENDER_ID=123456789
FIREBASE_APP_ID=1:123456789:web:abcdef123456
```

## 🎯 **SUAS CHAVES ESPECÍFICAS:**
```
OPENAI_API_KEY=sk-proj-[SUA_CHAVE_OPENAI_AQUI]
FIREBASE_API_KEY=[SUA_CHAVE_FIREBASE_AQUI]
FIREBASE_AUTH_DOMAIN=alcancar-931eb.firebaseapp.com
FIREBASE_PROJECT_ID=alcancar-931eb
FIREBASE_STORAGE_BUCKET=alcancar-931eb.firebasestorage.app
FIREBASE_MESSAGING_SENDER_ID=472031652887
FIREBASE_APP_ID=1:472031652887:web:c4fbde2d8befa8cdf2c052
```

## 🆘 **SOLUÇÃO DE PROBLEMAS:**

### **Erro de Permissão:**
```bash
chmod +x android/gradlew
```

### **Erro de SDK:**
```bash
# Abrir Android Studio
# Tools > SDK Manager
# Instalar Android SDK 33+
```

### **Erro de Build:**
```bash
cd android
./gradlew clean
./gradlew assembleDebug
```

## 🎉 **RESULTADO:**
Após seguir estes passos, você terá:
- ✅ APK instalável no seu celular
- ✅ App funcionando com suas credenciais
- ✅ Chat IA personalizado
- ✅ Todas as funcionalidades ativas

