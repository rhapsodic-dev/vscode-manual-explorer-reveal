import type { ExtensionContext, Tab, Uri } from 'vscode';
import {
  commands,
  ConfigurationTarget,
  TabInputCustom,
  TabInputNotebook,
  TabInputNotebookDiff,
  TabInputText,
  TabInputTextDiff,
  window,
  workspace,
} from 'vscode';

const AUTO_REVEAL_SECTION = 'explorer';
const AUTO_REVEAL_KEY = 'autoReveal';
const DISABLE_AUTO_REVEAL_KEY = 'manualExplorerReveal.disableAutoReveal';

export async function activate(context: ExtensionContext): Promise<void> {
  context.subscriptions.push(commands.registerCommand('manualExplorerReveal.revealActiveFile', revealActiveFile));

  await disableExplorerAutoRevealIfRequested();

  context.subscriptions.push(workspace.onDidChangeConfiguration(async (event) => {
    if (event.affectsConfiguration(DISABLE_AUTO_REVEAL_KEY)) {
      await disableExplorerAutoRevealIfRequested();
    }
  }));
}

async function disableExplorerAutoRevealIfRequested(): Promise<void> {
  const shouldDisable = workspace
    .getConfiguration()
    .get(DISABLE_AUTO_REVEAL_KEY, true);

  if (!shouldDisable) {
    return;
  }

  const explorerConfig = workspace.getConfiguration(AUTO_REVEAL_SECTION);

  if (explorerConfig.get(AUTO_REVEAL_KEY) !== false) {
    await explorerConfig.update(AUTO_REVEAL_KEY, false, ConfigurationTarget.Global);
  }
}

async function revealActiveFile(): Promise<void> {
  const activeUri = getActiveTabUri();

  if (!activeUri) {
    window.showInformationMessage('No active editor to reveal in Explorer.');
    return;
  }

  await commands.executeCommand('revealInExplorer', activeUri);
}

function getActiveTabUri(): Uri | undefined {
  const activeEditorUri = window.activeTextEditor?.document.uri;

  if (activeEditorUri) {
    return activeEditorUri;
  }

  const activeTab = window.tabGroups.activeTabGroup.activeTab;

  if (!activeTab) {
    return undefined;
  }

  return getTabUri(activeTab);
}

function getTabUri(tab: Tab): Uri | undefined {
  const { input } = tab;

  if (
    input instanceof TabInputText
    || input instanceof TabInputCustom
    || input instanceof TabInputNotebook
  ) {
    return input.uri;
  }

  if (input instanceof TabInputTextDiff || input instanceof TabInputNotebookDiff) {
    return input.modified;
  }

  return undefined;
}
