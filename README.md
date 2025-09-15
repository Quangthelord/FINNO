# Finno App - Demo Prototype

## Tổng quan

Finno App là một ứng dụng tài chính cá nhân sử dụng AI/ML để phân tích và đưa ra khuyến nghị tài chính thông minh. Demo này triển khai kiến trúc thuật toán theo 3 nguyên tắc cốt lõi:

1. **Architectural Cohesion** - Các thành phần liên kết và chuẩn hóa
2. **Data Asset Reusability** - Tái sử dụng đối tượng dữ liệu đã xử lý  
3. **Sustainable Competitive Moat** - Sử dụng mô hình tùy chỉnh với dữ liệu độc quyền

## Cài đặt

```bash
# Cài đặt dependencies
pip install -r requirements.txt

# Chạy demo
python finno_demo.py
```

## Kiến trúc hệ thống

### Phần 1: Transaction Enrichment
- **Mô hình**: Rule-Based Parser với Regex và Keyword Matching
- **Mục tiêu**: Chuyển đổi text giao dịch thô thành JSON có cấu trúc
- **Input**: Chuỗi text tiếng Việt (ví dụ: "Chuyển tiền cho Nguyễn Văn A - 500000 VND")
- **Output**: JSON với các trường: amount, recipient, category, intent, timestamp_reference, raw_text

### Phần 2.1: Financial Health Scoring Engine
- **Mô hình**: LightGBM với SHAP explanations
- **Mục tiêu**: Tính điểm sức khỏe tài chính (0-100) có thể giải thích
- **Features**: debt-to-income ratio, savings stability, expense volatility, etc.
- **Output**: Score + explanations (SHAP values)

### Phần 2.2: Forecasting & Simulation Engine
- **Mô hình**: ARIMA Time Series Forecasting + Arithmetic Simulation
- **Mục tiêu**: Dự báo tương lai và mô phỏng can thiệp
- **Input**: Lịch sử giao dịch + tham số can thiệp
- **Output**: Forecasted series + simulation insights

### Phần 3: Action & Retention Engine
- **Mô hình**: Hybrid Recommendation System
- **Phương pháp**: Collaborative Filtering + Content-Based
- **Mục tiêu**: Đưa ra khuyến nghị hành động cá nhân hóa
- **Output**: 3-5 recommendations với expected impact và confidence

## Cấu trúc Code

```
finno_demo.py
├── SyntheticDataGenerator      # Tạo dữ liệu tổng hợp
├── RuleBasedEnrichment         # Phần 1: Rule-based parsing
├── FinancialHealthScoring      # Phần 2.1: Health Scoring
├── ForecastingSimulation       # Phần 2.2: ARIMA Forecasting
├── ActionRetentionEngine       # Phần 3: Recommendations
└── FinnoDemo                   # Demo runner chính
```

## Tính năng chính

### Transaction Enrichment
- Xử lý text tiếng Việt với regex parsing và keyword matching
- Trích xuất thông tin có cấu trúc từ mô tả giao dịch
- Tạo JSON chuẩn hóa cho downstream processing

### Financial Health Scoring
- Tính điểm sức khỏe tài chính đa chiều
- Giải thích với SHAP values
- Dựa trên 8 features quan trọng

### Forecasting & Simulation
- Dự báo chi tiêu với ARIMA time series
- Mô phỏng can thiệp với arithmetic simulation
- Phân tích tác động của các thay đổi

### Action & Retention Engine
- Khuyến nghị cá nhân hóa
- Kết hợp collaborative và content-based filtering
- Đánh giá confidence và expected impact

## Dữ liệu Demo

Demo sử dụng dữ liệu tổng hợp bao gồm:
- 20 người dùng với 50 giao dịch mỗi người
- Text giao dịch tiếng Việt đa dạng
- Các category: income, food, transport, shopping, bills, health, education, entertainment
- Timestamps trong 6 tháng qua

## Kết quả Demo

Demo sẽ hiển thị:
1. **Enriched JSON** từ raw transaction text
2. **Health Score** với SHAP explanations
3. **Forecast** chi tiêu 4 tuần tới
4. **Simulation** tác động của can thiệp
5. **Recommendations** cá nhân hóa với confidence scores

## Thư viện sử dụng

- **LightGBM**: Gradient boosting cho health scoring
- **SHAP**: Model explanations
- **Statsmodels**: ARIMA time series forecasting
- **Scikit-learn**: Clustering và preprocessing
- **Pandas/NumPy**: Data processing
- **Matplotlib/Seaborn**: Visualization

## Lưu ý

- Demo này chỉ dành cho mục đích prototype và học tập
- Không sử dụng cho production mà không có validation đầy đủ
- Dữ liệu tổng hợp chỉ để minh họa, không phản ánh dữ liệu thực tế
- Các mô hình được train trên dữ liệu nhỏ, cần scale up cho production

## Phát triển tiếp

Để phát triển thành ứng dụng production:
1. Tích hợp với APIs ngân hàng thực tế
2. Mở rộng dataset training
3. Thêm authentication và security
4. Implement real-time processing
5. Thêm monitoring và logging
6. Scale infrastructure cho nhiều users
# FINNO
