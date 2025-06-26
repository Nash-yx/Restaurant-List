# 餐廳管理系統 Restaurant Management System

這是一個全功能的餐廳管理系統，提供使用者註冊、登入、新增、編輯和管理餐廳資訊的完整功能。系統支援多種搜尋方式，並整合了 Google Maps 和社群登入功能。

## ✨ 主要功能 Features

### 🔍 餐廳瀏覽與搜尋
- 依照餐廳名稱、類別、地址等多重條件搜尋
- 檢視餐廳詳細資訊（類別、地址、電話、評分、描述）
- 餐廳圖片展示
- Google Maps 地圖整合

### 👤 用戶系統
- 用戶註冊與登入
- Facebook 第三方登入
- 個人化餐廳收藏管理
- 安全的密碼加密儲存

### 📝 餐廳管理
- 新增餐廳資訊
- 編輯現有餐廳資料
- 刪除餐廳記錄
- 個人餐廳清單管理

### 🔒 安全性
- bcrypt 密碼加密
- Express Session 會話管理
- Passport.js 身份驗證
- Flash 訊息提示


## 📸 系統畫面 Screenshots

![首頁](https://github.com/Nash-yx/Restaurant-List/blob/main/public/img/home.png)
*主頁面 - 餐廳列表與搜尋功能*

![詳細頁面](https://github.com/Nash-yx/Restaurant-List/blob/main/public/img/detail.png)
*餐廳詳細資訊頁面*

## 🚀 安裝與設定 Installation

### 執行環境(RTE)
*   Node.js (v20.0.11)
*   MySQL (v8.0.15)

### 步驟說明

1. **複製專案到本機**
```bash
git clone https://github.com/Nash-yx/Restaurant-List.git
cd Restaurant-List
```

2. **安裝專案依賴**
```bash
npm install
```

3. **環境變數設定**
   - 複製 `.env.example` 為 `.env`
   - 設定資料庫連線資訊
   - 設定 Facebook 應用程式 ID 和密鑰（如需使用 Facebook 登入）


4. **資料庫設定**
```bash
# 執行資料庫遷移
npm run migrate

# (可選) 植入種子資料
npx sequelize-cli db:seed:all
```

5. **啟動應用程式**
```bash
# 開發環境
npm run dev

# 正式環境
npm start
```

當終端機顯示 `Server is running on http://localhost:3000` 時，表示啟動成功。
請開啟瀏覽器前往 [http://localhost:3000](http://localhost:3000) 開始使用。

## 📝 使用說明 Usage

### 基本操作
1. **註冊帳號**: 點擊註冊按鈕建立新帳號
2. **登入系統**: 使用帳號密碼或 Facebook 登入
3. **瀏覽餐廳**: 在首頁瀏覽所有餐廳資訊
4. **搜尋餐廳**: 使用搜尋列輸入關鍵字查找餐廳
5. **查看詳情**: 點擊餐廳卡片查看詳細資訊
6. **管理餐廳**: 新增、編輯或刪除個人的餐廳資料

### 進階功能
- **地圖檢視**: 在詳細頁面查看餐廳在 Google Maps 上的位置
- **評分系統**: 查看和管理餐廳評分


## 🗂️ 專案結構 Project Structure

```
.
├───.env.example
├───.gitignore
├───app.js
├───package-lock.json
├───package.json
├───README.md
├───.ebextensions
│   └───migration.config
├───config
│   ├───config.json
│   └───passport.js
├───middlewares
│   ├───auth-handler.js
│   ├───error-handler.js
│   └───message-handler.js
├───migrations
│   ├───20250403072201-create-restaurant.js
│   └───...
├───models
│   ├───index.js
│   ├───restaurant.js
│   └───user.js
├───public
│   ├───img
│   │   ├───detail.png
│   │   └───home.png
│   ├───javascripts
│   │   └───bootstrap.bundle.min.js
│   ├───jsons
│   │   └───restaurant.json
│   └───stylesheets
│       └───main.css
├───routes
│   ├───index.js
│   ├───restaurants.js
│   └───users.js
├───seeders
│   └───20250403081346-initial-data.js
└───views
    ├───create.hbs
    ├───detail.hbs
    ├───edit.hbs
    ├───index.hbs
    ├───login.hbs
    ├───register.hbs
    ├───layouts
    │   └───main.hbs
    └───partials
        ├───message.hbs
        └───navbar.hbs
```

## 🔧 開發指令 Development Scripts

*   `npm start`: 啟動應用程式 (正式環境)
*   `npm run dev`: 使用 nodemon 啟動應用程式 (開發環境)
*   `npm run migrate`: 執行資料庫遷移

## 🛠️ 技術架構 Tech Stack

### 後端框架
- **Node.js** - JavaScript 執行環境
- **Express.js** - Web 應用程式框架
- **Express-Handlebars** - 模板引擎

### 資料庫
- **MySQL** - 關聯式資料庫
- **Sequelize** - ORM 資料庫管理工具
- **Sequelize CLI** - 資料庫遷移工具

### 身份驗證
- **Passport.js** - 身份驗證中介軟體
- **Passport-Local** - 本地用戶認證
- **Passport-Facebook** - Facebook 第三方登入
- **bcryptjs** - 密碼加密

### 其他工具
- **Method-Override** - HTTP 方法覆寫
- **Connect-Flash** - Flash 訊息
- **Express-Session** - 會話管理
- **dotenv** - 環境變數管理
- **Cross-env** - 跨平台環境變數設定


## 👨‍💻 開發者 Developer

**Nash** - [GitHub Profile](https://github.com/Nash-yx)
