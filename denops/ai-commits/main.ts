import { Denops } from "https://deno.land/x/denops_std@v2.0.0/mod.ts";
import { ensureString } from "https://deno.land/x/unknownutil@v1.0.0/mod.ts";
import { OpenAIChat } from "npm:langchain/llms/openai";
import { PromptTemplate } from "npm:langchain/prompts";

export async function main(denops: Denops): Promise<void> {
  const llm = new OpenAIChat({
    openAIApiKey: "TODO",
  });

  const promptTemplate = new PromptTemplate({
    inputVariables: ["input"],
    template: `
    {input}
    `,
  });

  denops.dispatcher = {
    async sendChatMessage(text: unknown) {
      ensureString(text);
      const prompt = await promptTemplate.format({ input: text });
      const result = await llm.call(prompt);
      console.log(result);
      return Promise.resolve(result);
    },
  };

  const n = denops.name;
  await denops.cmd(
    `command! SendChatMessage call denops#notify("${n}", "sendChatMessage", [input("Enter your message: ")])`
  );
}
