# 📱 Guia Completo para Gerar APK

## 🎯 **Pré-requisitos**

### **1. Java JDK 17+**
```bash
# Verificar instalação
java -version
javac -version

# Se não estiver instalado:
sudo apt update
sudo apt install openjdk-17-jdk
```

### **2. Android SDK**
```bash
# Baixar Android Command Line Tools
wget https://dl.google.com/android/repository/commandlinetools-linux-11076708_latest.zip
unzip commandlinetools-linux-11076708_latest.zip
mkdir -p android-sdk/cmdline-tools
mv cmdline-tools android-sdk/cmdline-tools/latest

# Configurar variáveis de ambiente
export ANDROID_HOME=$HOME/android-sdk
export JAVA_HOME=/usr/lib/jvm/java-17-openjdk-amd64
export PATH=$PATH:$ANDROID_HOME/cmdline-tools/latest/bin:$ANDROID_HOME/platform-tools

# Instalar componentes necessários
yes | sdkmanager --licenses
sdkmanager "platform-tools" "platforms;android-34" "build-tools;34.0.0"
```

### **3. Node.js e NPM**
```bash
# Verificar instalação
node -v
npm -v

# Se não estiver instalado:
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs
```

## 🔧 **Configuração do Projeto**

### **1. Clonar o Repositório**
```bash
git clone https://github.com/luizdosanjos/finance-education-app-v2.git
cd finance-education-app-v2/FinanceEducationApp-clean
```

### **2. Instalar Dependências**
```bash
npm install
```

### **3. Configurar Variáveis de Ambiente**
```bash
# Copiar template
cp .env.example .env

# Editar .env com suas chaves
nano .env
```

**Conteúdo do .env:**
```env
OPENAI_API_KEY=sua_chave_openai_aqui
FIREBASE_API_KEY=sua_chave_firebase_aqui
FIREBASE_PROJECT_ID=seu_projeto_firebase_aqui
```

### **4. Configurar Android SDK**
```bash
# Criar arquivo local.properties
echo "sdk.dir=$ANDROID_HOME" > android/local.properties
```

## 🏗️ **Gerar APK**

### **APK Debug (Mais Rápida)**
```bash
cd android
export ANDROID_HOME=$HOME/android-sdk
export JAVA_HOME=/usr/lib/jvm/java-17-openjdk-amd64
./gradlew assembleDebug
```

### **APK Release (Produção)**
```bash
cd android
export ANDROID_HOME=$HOME/android-sdk
export JAVA_HOME=/usr/lib/jvm/java-17-openjdk-amd64
./gradlew assembleRelease
```

## 📍 **Localização da APK**

### **Debug APK**
```
android/app/build/outputs/apk/debug/app-debug.apk
```

### **Release APK**
```
android/app/build/outputs/apk/release/app-release.apk
```

## 🔑 **Keystore (Para Release)**

O projeto já inclui um keystore configurado:
- **Arquivo**: `android/app/finance-app-release-key.keystore`
- **Alias**: `finance-app`
- **Senha**: `035258Lz@`

## 🚨 **Solução de Problemas**

### **Erro: SDK location not found**
```bash
echo "sdk.dir=$ANDROID_HOME" > android/local.properties
```

### **Erro: JAVA_HOME not set**
```bash
export JAVA_HOME=/usr/lib/jvm/java-17-openjdk-amd64
```

### **Erro: hermesEnabled not found**
Já corrigido no `android/app/build.gradle`

### **Build muito lento**
```bash
# Usar daemon do Gradle
./gradlew --daemon assembleDebug
```

## 📱 **Instalar APK**

### **Via ADB**
```bash
adb install app-debug.apk
```

### **Via Arquivo**
1. Copie a APK para o celular
2. Abra o arquivo no celular
3. Permita instalação de fontes desconhecidas
4. Instale o app

## ✅ **Verificação Final**

Após instalar, verifique se:
- ✅ App abre sem erros
- ✅ Chat funciona (precisa de internet)
- ✅ Dashboard carrega
- ✅ Análises aparecem
- ✅ Firebase sincroniza

## 🎯 **Configurações Específicas**

### **Para Luiz Henrique:**
- **Package**: `com.luizdosanjos.financeeducation`
- **Versão**: `0.0.1`
- **Keystore**: Já configurado
- **Firebase**: Projeto `alcancar-931eb`

---

**🎊 Sua APK personalizada está pronta!**

*App de educação financeira baseado nos 3 livros fundamentais!*

