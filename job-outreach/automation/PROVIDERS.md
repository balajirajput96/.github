# Choosing an AI provider (fix the 401 key error)

The 401 error means the LLM key is invalid. Pick ONE provider below, set the key in
**Secrets** and the config in **Variables**, then re-run the workflow.

- Secrets page:   https://github.com/balajirajput96/.github/settings/secrets/actions
- Variables page: https://github.com/balajirajput96/.github/settings/variables/actions
- Run workflow:   https://github.com/balajirajput96/.github/actions/workflows/daily-jobs.yml

Paste keys WITHOUT quotes or spaces. Never commit a key to code.

---

## ⭐ Option A — Google Gemini  (FREE, easiest — recommended)
1. Get a free key: https://aistudio.google.com/apikey  (sign in with Google -> "Create API key")
2. Secrets -> New secret:
   - Name: `LLM_API_KEY`   Value: (your Gemini key, starts with `AIza...`)
3. Variables -> New variable (add each):
   - `LLM_BASE_URL` = `https://generativelanguage.googleapis.com/v1beta/openai`
   - `LLM_MODEL`    = `gemini-2.0-flash`
4. Run the workflow. Done. (Free tier is generous; no card needed.)

---

## Option B — OpenRouter  (you already set this up)
1. Create a valid key: https://openrouter.ai/keys  (must start with `sk-or-v1-...`)
2. Secrets -> update `OPENROUTER_API_KEY` with the new key.
3. Variables (optional): `LLM_MODEL` = `openai/gpt-4o-mini` (cheap) — needs a few $ credit,
   or use a free model like `LLM_MODEL` = `meta-llama/llama-3.3-70b-instruct:free`.
4. Run the workflow.

---

## Option C — Azure OpenAI  (student subscription; advanced)
Requires creating a resource + deploying a model. Steps:
1. Azure Portal: https://portal.azure.com  -> Create resource -> "Azure OpenAI" -> create.
   (If you don't see it, Azure OpenAI access may need enabling on your subscription.)
2. Open the resource -> "Model deployments" / Azure AI Foundry -> **Deploy** a model
   (e.g. `gpt-4o-mini`). Note the **Deployment name**.
3. Resource -> Keys and Endpoint -> copy **KEY 1** and the **Endpoint**
   (like `https://YOUR-RESOURCE.openai.azure.com`).
4. Secrets -> `LLM_API_KEY` = your Azure key.
5. Variables (add each):
   - `LLM_API_STYLE` = `azure`
   - `LLM_BASE_URL`  = `https://YOUR-RESOURCE.openai.azure.com/openai/deployments/YOUR-DEPLOYMENT`
   - `LLM_MODEL`     = `YOUR-DEPLOYMENT`  (same deployment name)
   - `LLM_API_VERSION` = `2024-08-01-preview`
6. Run the workflow.

---

After setting a provider, open `dashboard.md`. If it still shows 0 jobs, read the
**Run log** section — it now prints the exact error (401 = bad key, 402 = no credits,
404 = wrong model/deployment name).
