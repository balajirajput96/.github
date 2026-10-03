sed -i '229,239c\
    it("POST /api/assistant/chat uses Gemini when configured", async () => {\
      const mockStream = { on: jest.fn((event, cb) => { if (event === "data") cb(Buffer.from("data: {\\"candidates\\":[{\\"content\\":{\\"parts\\":[{\\"text\\":\\"Gemini stream response\\"}]}}]}\\n\\n")); if (event === "end") cb(); }) };\
      axios.post.mockResolvedValue({ data: mockStream });\
      const res = await request(app).post("/api/assistant/chat").set("x-api-key", "test-api-key").send({ prompt: "Say hello" });\
      expect(res.statusCode).toBe(200);\
      expect(res.headers["content-type"]).toBe("text/event-stream");\
      expect(res.text).toContain("data: {\\"type\\":\\"FINAL_RESPONSE\\",\\"content\\":\\"Gemini stream response\\"}");\
      expect(axios.post).toHaveBeenCalledWith(\
        expect.stringContaining("/v1beta/models/gemini-2.5-flash:streamGenerateContent?alt=sse"),\
        { contents: [{ role: "user", parts: [{ text: "Say hello" }] }] },\
        { params: { key: "gemini-test-key" }, headers: { "Content-Type": "application/json" }, responseType: "stream" }\
      );\
    });' web-app/server/index.test.js
