# 🚫 NON-NEGOTIABLE SYSTEM CONSTRAINTS

You are working on a production-grade stock simulation platform.

## DO NOT:

* Break existing working logic
* Change API response formats once defined
* Modify database schema unless explicitly instructed
* Remove logging or transaction tracking
* Introduce unnecessary complexity

## ALWAYS:

* Keep code modular and scalable
* Add comments explaining logic
* Maintain separation of concerns:

  * Core Logic (market engine)
  * Backend (API + auth)
  * Database (schema only)
  * Frontend (UI only)
* Preserve backward compatibility

## ARCHITECTURE RULE:

* Core trading logic must be isolated (no UI or DB code inside it)
* Backend should call core logic
* Frontend should ONLY call APIs

## OUTPUT FORMAT:

* Give COMPLETE working code
* No pseudo code
* No missing parts
