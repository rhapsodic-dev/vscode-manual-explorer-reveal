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

export async function activate(context: ExtensionContext): Promise<void> {
  context.subscriptions.push(
    commands.registerCommand('manualExplorerReveal.revealActiveFile', revealActiveFile),
    commands.registerCommand('manualExplorerReveal.restoreAutoReveal', restoreExplorerAutoReveal),
  );
}

async function restoreExplorerAutoReveal(): Promise<void> {
  await workspace
    .getConfiguration('explorer')
    .update('autoReveal', undefined, ConfigurationTarget.Global);

  window.showInformationMessage('Explorer auto reveal restored to the VS Code default.');
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
