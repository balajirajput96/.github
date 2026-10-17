## 2024-05-18 - Caching static file reads in Python loops
**Learning:** In `job-outreach/automation/run.py`, the script was repeatedly reading static `.md` prompt files from disk inside a loop for every job URL processed, creating a significant disk I/O bottleneck.
**Action:** When a function reads static configuration or template files from disk and is called multiple times within a loop or across requests, use `@functools.lru_cache(maxsize=None)` to cache the file contents in memory and eliminate redundant disk reads.
