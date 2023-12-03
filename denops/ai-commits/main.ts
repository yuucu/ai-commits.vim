import { Denops } from "https://deno.land/x/denops_std@v2.0.0/mod.ts";
import { OpenAIChat } from "npm:langchain/llms/openai";
import { PromptTemplate } from "npm:langchain/prompts";
export * as path from "https://deno.land/std@0.117.0/path/mod.ts";

// NOTE: export OPENAI_API_KEY="YOUR_OPENAI_API_KEY"
const llm = new OpenAIChat({});

const promptTemplate = new PromptTemplate({
  inputVariables: ["input"],
  template: `
以下のGitDiffを元にcommitMessageを生成してください。

### GitDiff
{input}
`,
});

async function sendChatMessage(text: string) {
  const prompt = await promptTemplate.format({ input: text });
  const commitMessage = await llm.call(prompt);
  return commitMessage;
}

async function runGitCommand(args: string[]): Promise<string> {
  const command = new Deno.Command("git", {
    args: args,
    stdout: "piped",
    stderr: "piped",
  });
  const { code, stdout, stderr } = await command.output();
  if (code !== 0) {
    const errorOutput = new TextDecoder().decode(stderr);
    console.error(errorOutput);
    throw new Error(`Git diff failed: ${errorOutput}`);
  }
  return new TextDecoder().decode(stdout);
}

export async function main(denops: Denops): Promise<void> {
  denops.dispatcher = {
    async aiCommits(): Promise<void> {
      try {
        const gitDiffResult = await runGitCommand(["diff"]);
        if (gitDiffResult === "") {
          console.log("No changes to commit.");
          return;
        }
        const commitMessage = await sendChatMessage(gitDiffResult);
        const shouldCommit = await denops.call(
          "input",
          `Commit this? / message: ${commitMessage}) [y/n]: `
        );
        if (shouldCommit.toLowerCase() === "y") {
          await runGitCommand(["add", "."]);
          await runGitCommand(["commit", "-m", commitMessage]);
        }
      } catch (error) {
        console.error("Error in aiCommits:", error);
      }
    },
  };

  await denops.cmd(
    `command! AICommits call denops#notify("${denops.name}", "aiCommits", [])`
  );
}
