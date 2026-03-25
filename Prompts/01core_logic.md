# 🧠 CORE MARKET ENGINE PROMPT

Build a pure core logic module for a stock market simulation.

## REQUIREMENTS:

* No database calls
* No frontend/UI
* No frameworks

## FEATURES:

1. Stock price update algorithm:
   price = price + (buy_volume - sell_volume) * factor + randomness

2. Functions:

* createStock()
* updatePrice()
* processBuyOrder()
* processSellOrder()
* calculatePortfolioValue()

3. Maintain:

* stock state
* user holdings (in-memory structure)

4. Add:

* transaction logs (in-memory)

## OUTPUT:

* Single file (JS or Python)
* Fully functional logic
* Clean and modular functions

## IMPORTANT:

This module will be imported into backend later.
