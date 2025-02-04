import logging
import numpy as np
import pandas as pd
from datetime import datetime
from django.contrib.auth import get_user_model
from sklearn.preprocessing import MinMaxScaler
import keras
from keras import layers
import requests
import krakenex
from django.views.decorators.csrf import csrf_exempt
from django.http import JsonResponse
import json
from scipy import optimize as sci_opt

logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(levelname)s - %(message)s')
logger = logging.getLogger(__name__)
User = get_user_model()

KRAKEN_API_KEY = "n8aOKKyqteyoEcdXMFdz8N+FU7WU9wROYZbPfMWV7k2dVY0ettASlxnZ"
KRAKEN_API_SECRET = "9N5xAeBEuTxv6Fc2SgSq2neysQhJo7FfFdxxrnaovF5//hkyW01dPlxYtk6L3LuPBIbxdTCqp9g9MGLb32eCqQ=="

KRAKEN_ASSET_MAP = {
    "XXBT": "BTC", "XBT": "BTC", "XETH": "ETH",
    "XLTC": "LTC", "XXRP": "XRP", "ADA": "ADA",
}

CRYPTOCOMPARE_API_KEY = "4f87a300bc12383eb78e1b17dd71afc3d1abf503ce1095a3c6c618a8115839e8"


@csrf_exempt
def get_portfolio(request):
    """
    API to fetch the user's portfolio based on provided user data.
    """
    logger.info("Received request: POST /api/get_portfolio/")

    if request.method == "POST":
        try:
            data = json.loads(request.body)
            user_email = data.get("email")

            if not user_email:
                return JsonResponse({"error": "User email is required"}, status=400)

            # Fetch user's portfolio from the database
            portfolio = get_user_portfolio_dB(user_email)

            if not portfolio:
                logger.warning("No portfolio data found for user: %s. Using default.", user_email)
                portfolio, best_coin, ai_insights, trend_df = fallback_best_crypto()
                trend_df = trend_df.to_json(orient='records')[1:-1].replace('},{', '} {')

                return JsonResponse({
                    "message": "No portfolio data found. Using default portfolio for trend analysis.",
                    "portfolio": portfolio,
                    "best_coin": best_coin,
                    "ai_insights": ai_insights,
                    "trend_df": trend_df
                }, status=200)
            
            trend_df = build_trend_dataset(portfolio, days=30)
            model, scaler = train_trend_model(trend_df, sequence_length=30, epochs=100, batch_size=32)
            predicted_trends = predict_next_trends(model, scaler, trend_df, sequence_length=30)
            best_coin = get_best_investment(predicted_trends)
            current_trends = trend_df.iloc[-1].values
            logger.info(f"Current Day Trends (returns): {current_trends}")
            ai_insights=[]
            for i, symbol in enumerate(portfolio.keys()):
                if predicted_trends[i] > current_trends[i]:
                    ai_insights.append(f"📈 {symbol}: BUY (Predicted return: {predicted_trends[i]:.4f}, Current return: {current_trends[i]:.4f})")
                else:
                    ai_insights.append(f"🚫 {symbol}: HOLD/SELL (Predicted return: {predicted_trends[i]:.4f}, Current return: {current_trends[i]:.4f})")
            logger.info("Recommended best coin: %s", best_coin)
            logger.info("Successfully retrieved portfolio for user: %s", user_email)
            top_coins = get_top_coins()
            print("Top 3 Cryptocurrencies by Market Cap:")
            top_movers = []
            for coin in top_coins:
                df = get_historical_data(coin['Symbol'])
                df = analyze_trend(df)
                latest_trend = df.iloc[-1]['Trend']
                
                top_movers.append({
                    "name": coin['Symbol'],
                    "change": float(latest_trend),  # Ensure numeric value
                    "value": float(coin['MarketCap']) if "MarketCap" in coin else 0.0  # Handle missing MarketCap
                })

            return JsonResponse({
                "message": "Portfolio data found",
                "portfolio": portfolio,
                "best_coin": best_coin,
                "ai_insights": ai_insights,
                "trend_df": trend_df,
                "top_movers": top_movers,
            }, status=200)


        except json.JSONDecodeError:
            logger.error("Invalid JSON data received.")
            return JsonResponse({"error": "Invalid JSON data"}, status=400)
        except Exception as e:
            logger.error("Unexpected error: %s", str(e))
            return JsonResponse({"error": "Internal server error"}, status=500)

    logger.error("Invalid request method: %s", request.method)
    return JsonResponse({"error": "Invalid request method"}, status=405)

def get_top_coins(limit=3):
    url = 'https://min-api.cryptocompare.com/data/top/mktcapfull'
    params = {'limit': limit, 'tsym': 'USD'}
    response = requests.get(url, params=params)
    data = response.json()
    coins = []
    for item in data['Data']:
        coin = {
            'Symbol': item['CoinInfo']['Name'],
            'FullName': item['CoinInfo']['FullName'],
            'MarketCap': item['RAW']['USD']['MKTCAP']
        }
        coins.append(coin)
    return coins

def get_historical_data(symbol, days=7):
    url = f'https://min-api.cryptocompare.com/data/v2/histoday'
    params = {'fsym': symbol, 'tsym': 'USD', 'limit': days}
    response = requests.get(url, params=params)
    data = response.json()
    df = pd.DataFrame(data['Data']['Data'])
    df['time'] = pd.to_datetime(df['time'], unit='s')
    return df

def analyze_trend(df):
    df['PriceChange'] = df['close'].diff()
    df['Trend'] = df['PriceChange'].apply(lambda x: 'Profit' if x > 0 else 'Loss')
    return df

def get_crypto_data(symbol, currency="USD", days=30):
    url = "https://min-api.cryptocompare.com/data/v2/histoday"
    params = {
        "fsym": symbol,
        "tsym": currency,
        "limit": days - 1,
        "api_key": CRYPTOCOMPARE_API_KEY
    }
    logger.info(f"Querying the API for {symbol}")
    response = requests.get(url, params=params)
    data = response.json()
    if data.get("Response") == "Error":
        logger.error("Error fetching data for %s: %s", symbol, data.get("Message"))
        df = pd.DataFrame(columns=['time', 'open', 'close'], index=pd.date_range(end=datetime.today(), periods=days, freq='D'))
        df['time'] = df.index
        return df
    if data.get("Data") and data["Data"].get("Data"):
        logger.info(f"Succefully fetched for {symbol}")
        df = pd.DataFrame(data["Data"]["Data"])
        df['time'] = pd.to_datetime(df['time'], unit='s')
        return df[['time', 'open', 'close']]
    else:
        logger.error("No data returned for %s", symbol)
        df = pd.DataFrame(columns=['time', 'open', 'close'], index=pd.date_range(end=datetime.today(), periods=days, freq='D'))
        df['time'] = df.index
        return df

def get_user_portfolio_dB(user_email):
    """
    Fetch the user's portfolio from the database based on email.
    """
    try:
        user = User.objects.get(email=user_email)
        return user.portfolio  # Returns the stored portfolio JSON
    except User.DoesNotExist:
        logger.warning("User with email %s not found in database.", user_email)
        return None
    except Exception as e:
        logger.error("Error retrieving user portfolio: %s", str(e))
        return None

def fallback_best_crypto():
    logger.info("Using fallback best crypto data for trend analysis...")
    
    default_coins = ["BTC", "ETH", "LTC", "XRP", "ADA"]
    portfolio = {coin: 10 for coin in default_coins}
    logger.info("Fallback portfolio created: %s", portfolio)

    trend_df = build_trend_dataset(portfolio, days=30)
    model, scaler = train_trend_model(trend_df, sequence_length=30, epochs=100, batch_size=32)
    predicted_trends = predict_next_trends(model, scaler, trend_df, sequence_length=30)
    best_coin = get_best_investment(predicted_trends)
    current_trends = trend_df.iloc[-1].values
    logger.info(f"Current Day Trends (returns): {current_trends}")
    ai_insights=[]
    for i, symbol in enumerate(portfolio.keys()):
        if predicted_trends[i] > current_trends[i]:
            ai_insights.append(f"📈 {symbol}: BUY (Predicted return: {predicted_trends[i]:.4f}, Current return: {current_trends[i]:.4f})")
        else:
            ai_insights.append(f"🚫 {symbol}: HOLD/SELL (Predicted return: {predicted_trends[i]:.4f}, Current return: {current_trends[i]:.4f})")
    logger.info("Recommended best coin: %s", best_coin)
    return portfolio, best_coin, ai_insights, trend_df

def get_best_investment(predicted_trends):
    """ Returns the best coin to invest in based on highest predicted trend. """
    default_coins = ["BTC", "ETH", "LTC", "XRP", "ADA"]
    best_idx = np.argmax(predicted_trends)
    return default_coins[best_idx]


def build_trend_dataset(portfolio, days=30):
    logger.info("Building trend dataset for %d days...", days)
    
    asset_data = {}
    for symbol in portfolio.keys():
        df = get_crypto_data(symbol, days=days)
        if df is not None:
            df["daily_return"] = (df["close"] - df["open"]) / df["open"]
            df.set_index("time", inplace=True)
            asset_data[symbol] = df["daily_return"]

    if not asset_data:
        logger.error("No market trend data retrieved from CryptoCompare.")
        raise ValueError("No market trend data retrieved.")

    merged_df = pd.concat(asset_data, axis=1)
    merged_df.fillna(method='ffill', inplace=True)
    return merged_df


def train_trend_model(data_df, sequence_length=30, epochs=100, batch_size=32):
    logger.info("Training trend prediction model...")

    scaler = MinMaxScaler(feature_range=(0, 1))
    scaled_data = scaler.fit_transform(data_df)


    X, y = [], []
    if len(scaled_data) <= sequence_length:
        print(f"Error: Not enough data to create sequences. Data length: {len(scaled_data)}, Required: {sequence_length}")
        model = keras.Sequential([layers.Dense(units=data_df.shape[1], input_shape=(sequence_length, data_df.shape[1]))])
        model.compile(optimizer='adam', loss='mean_squared_error')
        return model, scaler

    for i in range(sequence_length, len(scaled_data)):
        X.append(scaled_data[i-sequence_length:i])
        y.append(scaled_data[i])
    X, y = np.array(X), np.array(y)
    model = keras.Sequential([
        layers.LSTM(units=100, return_sequences=True, input_shape=(X.shape[1], X.shape[2])),
        layers.Dropout(0.2),
        layers.LSTM(units=100),
        layers.Dropout(0.2),
        layers.Dense(units=data_df.shape[1])
    ])

    model.compile(optimizer='adam', loss='mean_squared_error')
    model.fit(X, y, epochs=epochs, batch_size=batch_size, verbose=0)

    logger.info("Model training completed.")
    return model, scaler

def predict_next_trends(model, scaler, data_df, sequence_length=30):
    logger.info("Generating trend predictions...")

    scaled_data = scaler.transform(data_df)
    last_sequence = scaled_data[-sequence_length:].reshape(1, sequence_length, data_df.shape[1])
    predicted_scaled = model.predict(last_sequence)
    predicted_scaled = np.squeeze(predicted_scaled)

    if predicted_scaled.ndim == 1:
        predicted_scaled = predicted_scaled.reshape(1, -1)

    predicted = scaler.inverse_transform(predicted_scaled)[0]
    logger.info("Trend predictions generated successfully.")
    return predicted

@csrf_exempt
def optimize_portfolio(request):
    logger.info("Received request: POST /api/optimize_portfolio/")
    
    if request.method == "POST":
        data = json.loads(request.body)
        portfolio = data.get("portfolio")

        if not portfolio:
            return JsonResponse({
                "message": "No portfolio data found",
            }, status=501)

        logger.info("Successfully received portfolio data: %s", portfolio)
        try:
            price_df = build_price_dataset(portfolio, days=30)
            log_return = np.log(1 + price_df.pct_change()).iloc[1:]
            opt_sharpe_w, opt_vol_w, opt_sharpe_metrics, opt_vol_metrics = optimizer(log_return)
            print("\nPortfolio Optimization Results:")
            print(f"Optimized Weights (Max Sharpe): {opt_sharpe_w}")
            print(f"Metrics (Return, Volatility, Sharpe): {opt_sharpe_metrics}")
            print(f"Optimized Weights (Min Volatility): {opt_vol_w}")
            print(f"Metrics (Return, Volatility, Sharpe): {opt_vol_metrics}")
        except Exception as e:
            print("Portfolio optimization skipped due to error:", e)
        return JsonResponse({"portfolio": portfolio}, status=200)

    logger.error("Invalid request method: %s", request.method)
    return JsonResponse({"error": "Invalid request method"}, status=405)

def build_price_dataset(portfolio, days=30):
    """
    For portfolio optimization, fetch the historical close prices (from CryptoCompare) for each asset.
    """
    price_data = {}
    for symbol in portfolio.keys():
        df = get_crypto_data(symbol, days=days)
        if df is not None:
            df.set_index("time", inplace=True)
            price_data[symbol] = df["close"]
    if not price_data:
        raise ValueError("No price data retrieved.")
    prices_df = pd.concat(price_data, axis=1)
    prices_df.columns = prices_df.columns.droplevel(1)
    prices_df.fillna(method='ffill', inplace=True)
    return prices_df

def optimizer(log_return):
    """
    Compute portfolio metrics (annualized return, volatility, Sharpe ratio) and optimize for:
      - Maximum Sharpe ratio
      - Minimum volatility
    """
    def get_metrics(weights):
        weights = np.array(weights)
        annual_return = np.sum(log_return.mean() * weights) * 252
        annual_vol = np.sqrt(np.dot(weights.T, np.dot(log_return.cov() * 252, weights)))
        sharpe_ratio = annual_return / annual_vol
        return np.array([annual_return, annual_vol, sharpe_ratio])

    n = log_return.shape[1]
    bounds = tuple((0, 1) for _ in range(n))
    constraints = {'type': 'eq', 'fun': lambda w: np.sum(w) - 1}
    guess = [1./n] * n

    optimized_sharpe = sci_opt.minimize(lambda w: -get_metrics(w)[2], guess, method='SLSQP', bounds=bounds, constraints=constraints)
    optimized_volatility = sci_opt.minimize(lambda w: get_metrics(w)[1], guess, method='SLSQP', bounds=bounds, constraints=constraints)

    return optimized_sharpe.x, optimized_volatility.x, get_metrics(optimized_sharpe.x), get_metrics(optimized_volatility.x)

@csrf_exempt
def create_portfolio(request):
    """
    API endpoint to save or update the user's portfolio.
    """
    logger.info("Received request: POST /api/create_portfolio/")

    if request.method == "POST":
        try:
            data = json.loads(request.body)
            portfolio = data.get("portfolio")

            if not portfolio:
                return JsonResponse({"message": "No portfolio data found"}, status=400)

            logger.info("Received portfolio data: %s", portfolio)

            # Update the authenticated user's portfolio
            user = request.user
            user.update_portfolio(portfolio)

            return JsonResponse({"message": "Portfolio updated successfully", "portfolio": user.portfolio}, status=200)

        except Exception as e:
            logger.error("Error updating portfolio: %s", str(e))
            return JsonResponse({"error": "Error updating portfolio"}, status=500)

    return JsonResponse({"error": "Invalid request method"}, status=405)