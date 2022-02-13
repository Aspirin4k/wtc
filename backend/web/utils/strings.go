package utils

import (
	"regexp"
	"unicode"
)

var regexSpecial = regexp.MustCompile("#.*[\\S\\n]?")
var regexLineBreak = regexp.MustCompile("[\\n\\r]")

func StringEscape(str string) string {
	str = regexSpecial.ReplaceAllString(str, "")
	return regexLineBreak.ReplaceAllString(str, "&#10;")
}

func StringCutByWords(str string, length int) string {
	strRunes := []rune(str)
	if len(strRunes) <= length {
		return str
	}

	lastSpace := -1
	for i := 0; i < length; i++ {
		if unicode.IsSpace(strRunes[i]) {
			lastSpace = i
		}
	}

	if lastSpace == -1 {
		return string(strRunes[:length]) + ".."
	}

	return string(strRunes[:lastSpace]) + ".."
}
