# Workflow notes

Automation workflows that can publish generated data to `main` use the shared `automation-main-writer` concurrency group so the daily scanner and continuous orchestrator do not publish concurrently.