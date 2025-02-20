const gitUrlRegex = /^(?:git@[\w.-]+:[\w./-]+\.git|https?:\/\/[\w.-]+\/[\w./-]+\.git)$/;

export function isValidGitCloneUrl(url: string) {
    return gitUrlRegex.test(url);
}