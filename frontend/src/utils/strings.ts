const SentencesRegexp = new RegExp(/([^.!?\n]|,)+?(?!,)[.!?\n]/g);
const MentionsRegexp = new RegExp(/\[(.+?)\|(.+?)\]/g);
const LinkRegexp = new RegExp(/(https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+~#?&\/\/=]*))/g)

export const SubstrBySentences = (
  str: string,
  sentencesNum: number = 1,
  charactersNum: number = 180,
  cutSymbol: string = '..'
): [string, boolean] => {
  if ('' === str) {
    return [str, false];
  }

  str = SubstrByWords(str, charactersNum, '[(CUTTED)].');
  let sentences = str.match(SentencesRegexp)
  if (!sentences) {
    return [str, false];
  }

  let was_cut = false;
  if (sentences.length > sentencesNum) {
    sentences = sentences.slice(0, sentencesNum);
  } else {
    const lastSentence = sentences[sentences.length - 1];
    if (lastSentence.length > 11 && lastSentence.substr(lastSentence.length - 11) === '[(CUTTED)].') {
      was_cut = true;
      sentences[sentences.length - 1] = lastSentence.substr(0, lastSentence.length - 11) + cutSymbol;
    }
  }

  return [sentences.map((sentence) => sentence.trim()).join(' '), was_cut];
}

export const SubstrByWords = (str: string, charactersNum: number = 180, cutSymbol: string = '..'): string => {
  if (str.length <= charactersNum) {
    return str;
  }

  for (let i = charactersNum - 1; i >= 0; i--) {
    if (str[i] === ' ') {
      return str.substr(0, i).trim() + cutSymbol;
    }
  }

  return str.substr(0, charactersNum).trim() + cutSymbol;
}

export const ReplaceMentions = (str: string): string => {
  return str.replace(MentionsRegexp, '<a target="_blank" href="https://vk.com/$1">$2</a>');
}

export const ReplaceByTags = (str: string): string => {
  return str
    .replace(/(&amp;#10;|\n)/g, '<br>')
    .replace(LinkRegexp, '<a target="_blank" href="$1">$1</a>')
}

export const EscapeHTML = (str: string): string => {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}
