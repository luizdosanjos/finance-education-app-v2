# 🌐 DEPLOY WEB CONFIGURADO!

## ✅ **GitHub Pages Ativado:**
- **URL**: https://luizdosanjos.github.io/finance-education-app-v2/
- **Status**: Ativo
- **Branch**: main
- **HTTPS**: Forçado

## 🚀 **Para Deploy da Versão Web:**

### **1. Preparar Versão Web:**
```bash
cd finance-education-web-demo
npm run build
```

### **2. Copiar para GitHub Pages:**
```bash
cp -r dist/* ../FinanceEducationApp-clean/docs/
git add docs/
git commit -m "🌐 Deploy versão web"
git push
```

### **3. Configurar GitHub Pages:**
- Ir em Settings > Pages
- Source: Deploy from a branch
- Branch: main
- Folder: /docs

## 📱 **Para APK Android:**

### **Requisitos:**
- Java JDK 17+
- Android Studio
- Android SDK

### **Comandos:**
```bash
cd android
./gradlew assembleRelease
```

### **APK gerada em:**
```
android/app/build/outputs/apk/release/app-release.apk
```

## 🔧 **Configurações Necessárias:**

### **Arquivo .env (criar localmente):**
```
OPENAI_API_KEY=sk-proj-[SUA_CHAVE_OPENAI_AQUI]
FIREBASE_API_KEY=[SUA_CHAVE_FIREBASE_AQUI]
FIREBASE_AUTH_DOMAIN=alcancar-931eb.firebaseapp.com
FIREBASE_PROJECT_ID=alcancar-931eb
FIREBASE_STORAGE_BUCKET=alcancar-931eb.firebasestorage.app
FIREBASE_MESSAGING_SENDER_ID=472031652887
FIREBASE_APP_ID=1:472031652887:web:c4fbde2d8befa8cdf2c052
```

