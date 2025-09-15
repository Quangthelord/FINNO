"""
Flask Backend for Finno App Mobile Interface
Integrates with the existing Python ML components
"""

from flask import Flask, render_template, request, jsonify
from flask_cors import CORS
import json
import random
import numpy as np
import pandas as pd
from datetime import datetime, timedelta
from typing import List, Dict, Any, Tuple
import warnings
warnings.filterwarnings('ignore')

# Import the existing Finno components
from finno_demo import (
    SyntheticDataGenerator,
    RuleBasedEnrichment,
    FinancialHealthScoring,
    ForecastingSimulation,
    ActionRetentionEngine
)

app = Flask(__name__)
CORS(app)

# Initialize components
data_generator = SyntheticDataGenerator()
enrichment = RuleBasedEnrichment()
health_scoring = FinancialHealthScoring()
forecasting = ForecastingSimulation()
recommendation_engine = ActionRetentionEngine()

# Generate synthetic data for demo
synthetic_users = []
for i in range(20):
    user_transactions = data_generator.generate_transaction_data(50)
    synthetic_users.append(user_transactions)

# Train models
health_scoring.train_model(synthetic_users)
forecasting.train_arima_models(synthetic_users)

# User features for clustering
user_features = [health_scoring.extract_features(user_txns) for user_txns in synthetic_users]
recommendation_engine.cluster_users(user_features)

@app.route('/')
def index():
    """Serve the main mobile app interface"""
    return render_template('index.html')

@app.route('/api/dashboard', methods=['GET'])
def get_dashboard_data():
    """Get dashboard data for a user"""
    user_id = request.args.get('user_id', 0)
    user_transactions = synthetic_users[int(user_id) % len(synthetic_users)]
    
    # Calculate health score
    score, explanations = health_scoring.score_financial_health(user_transactions)
    
    # Calculate financial metrics
    df = pd.DataFrame(user_transactions)
    df['amount'] = pd.to_numeric(df['amount'])
    
    total_income = df[df['category'] == 'income']['amount'].sum()
    total_expenses = df[df['category'] != 'income']['amount'].sum()
    current_balance = total_income - total_expenses
    savings_rate = (current_balance / max(total_income, 1)) * 100
    
    # Get recent transactions
    recent_transactions = user_transactions[-5:]
    
    return jsonify({
        'healthScore': round(score, 1),
        'currentBalance': int(current_balance),
        'monthlyIncome': int(total_income),
        'monthlyExpenses': int(total_expenses),
        'savingsRate': round(savings_rate, 1),
        'recentTransactions': recent_transactions
    })

@app.route('/api/transactions', methods=['GET'])
def get_transactions():
    """Get all transactions for a user"""
    user_id = request.args.get('user_id', 0)
    user_transactions = synthetic_users[int(user_id) % len(synthetic_users)]
    
    return jsonify({
        'transactions': user_transactions
    })

@app.route('/api/insights', methods=['GET'])
def get_insights():
    """Get insights and forecasts for a user"""
    user_id = request.args.get('user_id', 0)
    user_transactions = synthetic_users[int(user_id) % len(synthetic_users)]
    
    # Get forecast
    forecast_results = forecasting.forecast(user_transactions, weeks_ahead=4)
    
    # Prepare forecast data for chart
    forecast_data = {
        'weeks': [f'Tuần {i+1}' for i in range(4)],
        'amounts': []
    }
    
    if forecast_results:
        for result in forecast_results:
            forecast_data['amounts'].append(result['forecasted_amount'])
    else:
        # Fallback data
        forecast_data['amounts'] = [2300000, 2400000, 2200000, 2300000]
    
    # Category breakdown
    df = pd.DataFrame(user_transactions)
    df['amount'] = pd.to_numeric(df['amount'])
    category_spending = df.groupby('category')['amount'].sum().to_dict()
    
    category_data = {
        'labels': list(category_spending.keys()),
        'amounts': list(category_spending.values())
    }
    
    return jsonify({
        'forecast': forecast_data,
        'categoryBreakdown': category_data
    })

@app.route('/api/simulation', methods=['POST'])
def run_simulation():
    """Run intervention simulation"""
    data = request.get_json()
    user_id = data.get('user_id', 0)
    category = data.get('category', 'food')
    reduction_percent = data.get('reduction_percent', 15)
    
    user_transactions = synthetic_users[int(user_id) % len(synthetic_users)]
    
    # Run simulation
    intervention = {
        'category': category,
        'reduction_percent': reduction_percent
    }
    
    simulation_result = forecasting.simulate_intervention(user_transactions, intervention)
    
    return jsonify({
        'result': simulation_result
    })

@app.route('/api/recommendations', methods=['GET'])
def get_recommendations():
    """Get personalized recommendations for a user"""
    user_id = request.args.get('user_id', 0)
    user_transactions = synthetic_users[int(user_id) % len(synthetic_users)]
    
    # Get health score
    score, explanations = health_scoring.score_financial_health(user_transactions)
    
    # Get forecast
    forecast_results = forecasting.forecast(user_transactions, weeks_ahead=4)
    
    # Generate recommendations
    goals = ['savings', 'expense_reduction']
    recommendations = recommendation_engine.generate_recommendations(
        user_transactions, score, forecast_results, goals
    )
    
    return jsonify({
        'recommendations': recommendations
    })

@app.route('/api/enrich', methods=['POST'])
def enrich_transaction():
    """Enrich a raw transaction text"""
    data = request.get_json()
    raw_text = data.get('raw_text', '')
    
    if not raw_text:
        return jsonify({'error': 'No text provided'}), 400
    
    # Enrich transaction
    enriched = enrichment.enrich_transaction(raw_text)
    
    return jsonify({
        'enriched': enriched
    })

@app.route('/api/add-transaction', methods=['POST'])
def add_transaction():
    """Add a new transaction"""
    data = request.get_json()
    user_id = data.get('user_id', 0)
    transaction_data = data.get('transaction', {})
    
    # Enrich the transaction if raw text is provided
    if 'raw_text' in transaction_data:
        enriched = enrichment.enrich_transaction(transaction_data['raw_text'])
        transaction_data.update(enriched)
    
    # Add timestamp if not provided
    if 'timestamp_reference' not in transaction_data:
        transaction_data['timestamp_reference'] = datetime.now().isoformat()
    
    # Add to user's transactions
    user_transactions = synthetic_users[int(user_id) % len(synthetic_users)]
    user_transactions.append(transaction_data)
    
    return jsonify({
        'success': True,
        'transaction': transaction_data
    })

@app.route('/api/health-score', methods=['GET'])
def get_health_score():
    """Get detailed health score with explanations"""
    user_id = request.args.get('user_id', 0)
    user_transactions = synthetic_users[int(user_id) % len(synthetic_users)]
    
    score, explanations = health_scoring.score_financial_health(user_transactions)
    
    return jsonify({
        'score': round(score, 1),
        'explanations': explanations
    })

if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0', port=5000)

