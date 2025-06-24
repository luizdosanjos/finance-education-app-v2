# 📱 Guia de Geração de APK - Finance Education App

Este guia detalha como gerar a APK do aplicativo Finance Education App em diferentes ambientes.

## 🛠️ Pré-requisitos

### Ambiente de Desenvolvimento Completo

#### 1. Java Development Kit (JDK)
```bash
# Ubuntu/Debian
sudo apt update
sudo apt install openjdk-17-jdk

# macOS (com Homebrew)
brew install openjdk@17

# Windows
# Baixar e instalar do site oficial da Oracle
```

#### 2. Android Studio
- Baixar do site oficial: https://developer.android.com/studio
- Instalar Android SDK
- Configurar Android SDK Build-Tools
- Configurar emulador ou conectar dispositivo físico

#### 3. Variáveis de Ambiente
```bash
# Adicionar ao ~/.bashrc ou ~/.zshrc
export ANDROID_HOME=$HOME/Android/Sdk
export PATH=$PATH:$ANDROID_HOME/emulator
export PATH=$PATH:$ANDROID_HOME/tools
export PATH=$PATH:$ANDROID_HOME/tools/bin
export PATH=$PATH:$ANDROID_HOME/platform-tools
export JAVA_HOME=/usr/lib/jvm/java-17-openjdk-amd64
```

## 🚀 Métodos de Geração de APK

### Método 1: Script Automatizado (Recomendado)
```bash
# Executar o script de deploy
./deploy.sh

# Escolher opção 1 (APK Debug) ou 2 (APK Release)
```

### Método 2: NPM Scripts
```bash
# APK Debug
npm run build:android:debug

# APK Release
npm run build:android:release
```

### Método 3: Gradle Direto
```bash
# Navegar para o diretório Android
cd android

# APK Debug
./gradlew assembleDebug

# APK Release
./gradlew assembleRelease

# Limpar e rebuild
./gradlew clean assembleRelease
```

### Método 4: Android Studio
1. Abrir o projeto no Android Studio
2. Ir em Build > Build Bundle(s) / APK(s) > Build APK(s)
3. Aguardar o build completar
4. APK será gerada em `android/app/build/outputs/apk/`

## 📦 Localização dos Arquivos

### APK Debug
```
android/app/build/outputs/apk/debug/app-debug.apk
```

### APK Release
```
android/app/build/outputs/apk/release/app-release.apk
```

## 🔧 Configurações de Build

### Configuração de Assinatura (Release)
Para APK de produção, configure a assinatura em `android/app/build.gradle`:

```gradle
android {
    signingConfigs {
        release {
            if (project.hasProperty('MYAPP_UPLOAD_STORE_FILE')) {
                storeFile file(MYAPP_UPLOAD_STORE_FILE)
                storePassword MYAPP_UPLOAD_STORE_PASSWORD
                keyAlias MYAPP_UPLOAD_KEY_ALIAS
                keyPassword MYAPP_UPLOAD_KEY_PASSWORD
            }
        }
    }
    buildTypes {
        release {
            signingConfig signingConfigs.release
            minifyEnabled enableProguardInReleaseBuilds
            proguardFiles getDefaultProguardFile("proguard-android.txt"), "proguard-rules.pro"
        }
    }
}
```

### Gerar Keystore
```bash
keytool -genkeypair -v -storetype PKCS12 -keystore my-upload-key.keystore -alias my-key-alias -keyalg RSA -keysize 2048 -validity 10000
```

## 🐛 Solução de Problemas

### Erro: JAVA_HOME não configurado
```bash
export JAVA_HOME=/usr/lib/jvm/java-17-openjdk-amd64
```

### Erro: Android SDK não encontrado
```bash
export ANDROID_HOME=$HOME/Android/Sdk
```

### Erro: Gradle build failed
```bash
cd android
./gradlew clean
./gradlew assembleDebug --stacktrace
```

### Erro: Out of memory
```bash
# Aumentar heap size no gradle.properties
org.gradle.jvmargs=-Xmx4096m -XX:MaxPermSize=512m -XX:+HeapDumpOnOutOfMemoryError -Dfile.encoding=UTF-8
```

## 📱 Instalação da APK

### Via ADB (Android Debug Bridge)
```bash
# Instalar APK no dispositivo conectado
adb install android/app/build/outputs/apk/debug/app-debug.apk

# Desinstalar versão anterior
adb uninstall com.financeeducationapp

# Reinstalar
adb install -r android/app/build/outputs/apk/debug/app-debug.apk
```

### Via Dispositivo Físico
1. Transferir APK para o dispositivo
2. Habilitar "Fontes desconhecidas" nas configurações
3. Abrir o arquivo APK e instalar

### Via Emulador
1. Arrastar e soltar APK no emulador
2. Ou usar adb install

## 🔒 Configurações de Segurança

### Permissões no AndroidManifest.xml
```xml
<uses-permission android:name="android.permission.INTERNET" />
<uses-permission android:name="android.permission.ACCESS_NETWORK_STATE" />
<uses-permission android:name="android.permission.WRITE_EXTERNAL_STORAGE" />
```

### Configurações de Rede (Network Security Config)
```xml
<!-- android/app/src/main/res/xml/network_security_config.xml -->
<?xml version="1.0" encoding="utf-8"?>
<network-security-config>
    <domain-config cleartextTrafficPermitted="true">
        <domain includeSubdomains="true">localhost</domain>
        <domain includeSubdomains="true">10.0.2.2</domain>
        <domain includeSubdomains="true">10.0.3.2</domain>
    </domain-config>
</network-security-config>
```

## 📊 Otimizações de Build

### Reduzir Tamanho da APK
```gradle
android {
    buildTypes {
        release {
            minifyEnabled true
            shrinkResources true
            proguardFiles getDefaultProguardFile('proguard-android-optimize.txt'), 'proguard-rules.pro'
        }
    }
    
    splits {
        abi {
            reset()
            enable true
            universalApk false
            include "arm64-v8a", "armeabi-v7a", "x86", "x86_64"
        }
    }
}
```

### Bundle AAB (Recomendado para Play Store)
```bash
./gradlew bundleRelease
```

## 🚀 Deploy Automatizado

### GitHub Actions (CI/CD)
```yaml
name: Build APK
on:
  push:
    branches: [ main ]
  pull_request:
    branches: [ main ]

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
    - uses: actions/checkout@v3
    - name: Setup Node.js
      uses: actions/setup-node@v3
      with:
        node-version: '18'
    - name: Setup Java
      uses: actions/setup-java@v3
      with:
        distribution: 'temurin'
        java-version: '17'
    - name: Install dependencies
      run: npm install
    - name: Build APK
      run: cd android && ./gradlew assembleDebug
    - name: Upload APK
      uses: actions/upload-artifact@v3
      with:
        name: app-debug
        path: android/app/build/outputs/apk/debug/app-debug.apk
```

## 📋 Checklist de Build

### Antes do Build
- [ ] Dependências instaladas (`npm install`)
- [ ] Variáveis de ambiente configuradas
- [ ] Java e Android SDK instalados
- [ ] Dispositivo/emulador conectado (para teste)

### Durante o Build
- [ ] Verificar logs de erro
- [ ] Monitorar uso de memória
- [ ] Aguardar conclusão completa

### Após o Build
- [ ] Verificar se APK foi gerada
- [ ] Testar instalação
- [ ] Verificar funcionalidades principais
- [ ] Testar chat com OpenAI
- [ ] Validar análises financeiras

## 🎯 Próximos Passos

### Para Produção
1. Configurar assinatura de release
2. Otimizar bundle size
3. Configurar ProGuard/R8
4. Testar em múltiplos dispositivos
5. Preparar para Google Play Store

### Para Distribuição
1. Criar página de download
2. Configurar analytics
3. Implementar crash reporting
4. Configurar atualizações automáticas

---

**💡 Dica**: Para desenvolvimento rápido, use sempre APK Debug. Para distribuição, use APK Release com assinatura adequada.

