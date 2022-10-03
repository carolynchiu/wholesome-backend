# MFEE27 前端工程師養成班畢業專題 - Wholesome 後端

### 部屬步驟
1. 先將專案從 github 上 clone 到本地端，並安裝套件
```
git clone https://github.com/carolynchiu/wholesome-project.git
cd  wholesome-be/
npm install
```
**注意**：若本地端沒有安裝nodemon 請另外安裝nodemon
```
npm i nodemon
```

2. 修改環境建置

   安裝完後於檔案根目錄建.env檔，將.env.example檔裡的內容複製到.env檔裡，並將資料庫的使用者、密碼及session加密修改成：
```
DB_USER=admin
DB_PASSWORD=12345

SESSION_SECRET= testtest
```
3. 資料庫建置

    請安裝XAMPP並啟用Apache和MySQL，並在 MySQL 建立 wholesome_project 資料庫，並匯入位於後端根目錄的 wholesome_project.sql
4. 啟動後端專案　
```
npm run dev
```
**注意**：本倉儲只有運行後端的部分，需要連同前端一起運行，前端請至[Wholesome 前端](https://github.com/carolynchiu/wholesome-project.git)







