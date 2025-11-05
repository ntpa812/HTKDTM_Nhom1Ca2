# --- Bước 1: Chọn image Node (phiên bản ổn định)
FROM node:20-alpine

# --- Bước 2: Đặt thư mục làm việc
WORKDIR /app

# --- Bước 3: Copy file cấu hình trước để tận dụng cache
COPY package*.json ./

# --- Bước 4: Cài đặt dependency
RUN npm install

# --- Bước 5: Copy toàn bộ mã nguồn vào container
COPY . .

# --- Bước 6: Chỉ định cổng Railway sẽ dùng
ENV PORT=3000
EXPOSE 3000

# --- Bước 7: Lệnh khởi động app
CMD ["npm", "start"]
