import { Stage, Text } from "createjs-module";
import {
    TEXT_COLOR_BLUE,
    TEXT_COLOR_DEFAULT,
    TEXT_COLOR_PURPLE,
    TEXT_COLOR_RED,
    TEXT_FONT_FAMILY,
    TEXT_FONT_SIZE,
    TEXT_WIDTH
} from "./Constants";

interface TextTokenInterface {
    text: string;
    color: string;
    offset_y: number;
    offset_x: number;
    line_num: number;
}

class RenderTokenCalculator {
    public calculate(text: string): TextTokenInterface[] {
        const createJsText = new Text();
        createJsText.font = `${TEXT_FONT_SIZE}px ${TEXT_FONT_FAMILY}`;

        return text
            // Двойной перенос строки считаем за начало нового абзаца
            .split("\n\n")
            .map((line: string, index: number): TextTokenInterface => ({
                text: line,
                color: TEXT_COLOR_DEFAULT,
                offset_y: index * TEXT_FONT_SIZE,
                offset_x: 0,
                line_num: 0
            }))
            // Учитываем одинарные переносы строки
            .reduce((result: TextTokenInterface[], line: TextTokenInterface) => {
                const added_lines = line.text
                    .split("\n")
                    .map((subline) => ({
                        text: subline,
                        color: TEXT_COLOR_DEFAULT,
                        offset_y: line.offset_y,
                        offset_x: 0,
                        line_num: 0
                    }))
                return [...result, ...added_lines];
            }, [])
            // Разбиваем на линии по ширине экрана с учетом цветов
            .reduce((result: TextTokenInterface[], line: TextTokenInterface) => {
                const first_line_num = !!result.length ? result[result.length - 1].line_num + 1 : 0;
                const added_lines = this.getTextBrokenToLines(createJsText, line).map((line) => ({
                    ...line,
                    line_num: line.line_num + first_line_num
                }));
                return [...result, ...added_lines];
            }, []);
    }

    /**
     * Разбить текст на линии, чтобы влазили в экран
     */
    private getTextBrokenToLines(createJsText: Text, line: TextTokenInterface): TextTokenInterface[] {
        const result_lines = [];
        let colored_sublines = line.text
            .split(/(<red>.*?<\/red>|<purple>.*?<\/purple>|<blue>.*?<\/blue>)/)
            .map((subline: string) => subline.trim())
            .filter((subline: string) => subline.length > 0);

        let text_color;
        let offset_x_current = 0;
        let line_num_current = 0;
        let result_words = [];
        colored_sublines.forEach((colored_subline: string) => {
            switch (true) {
                case colored_subline.match(/<red>.*<\/red>/) !== null:
                    colored_subline = colored_subline.substring(5, colored_subline.length - 6);
                    text_color = TEXT_COLOR_RED;
                    break;
                case colored_subline.match(/<purple>.*<\/purple>/) !== null:
                    colored_subline = colored_subline.substring(8, colored_subline.length - 9);
                    text_color = TEXT_COLOR_PURPLE;
                    break;
                case colored_subline.match(/<blue>.*<\/blue>/) !== null:
                    colored_subline = colored_subline.substring(6, colored_subline.length - 7);
                    text_color = TEXT_COLOR_BLUE;
                    break;
                default:
                    text_color = TEXT_COLOR_DEFAULT;
                    break;
            }

            const words = colored_subline.split(' ');

            // Сценарий: в предыдущей линии влезли все слова в строку, однако
            // новое слово из этой линии в оставшееся пространство не помещается
            // Решение: перенос на новую строку
            createJsText.text = words[0];
            if (offset_x_current + createJsText.getMeasuredWidth() > TEXT_WIDTH) {
                line_num_current++;
                offset_x_current = 0;
            }

            // Хак: добавляет пробел перед цветным текстом
            // Но при этом нужно учитывать, что перед некоторыми символами пробел не нужен
            const last_character = result_lines.length && result_lines[result_lines.length - 1].text.length
                ? result_lines[result_lines.length - 1].text.charAt(result_lines[result_lines.length - 1].text.length - 1)
                : '';
            let line_prefix = offset_x_current <= 0 || ['"'].includes(last_character) || (words.length === 1 && words[0] === '"')
                ? ''
                : ' ';

            words.forEach((word: string) => {
                createJsText.text = line_prefix + word;
                if (createJsText.getMeasuredWidth() > TEXT_WIDTH) {
                    // TODO: слово не влазит в строку (Нахера такое слово?)
                    // может потребоваться для японского, в котором нет пробелов (Нахера на сайте японский?)
                    return;
                }
                
                createJsText.text = line_prefix + [...result_words, word].join(' ');
                if (offset_x_current + createJsText.getMeasuredWidth() > TEXT_WIDTH) {
                    result_lines.push({
                        text: line_prefix + result_words.join(' '),
                        color: text_color,
                        offset_y: line.offset_y,
                        offset_x: offset_x_current,
                        line_num: line_num_current
                    });
                    result_words = [word]
                    offset_x_current = 0;
                    line_prefix = '';
                    line_num_current++;
                } else {
                    result_words.push(word);
                }
            });

            if (result_words.length) {
                result_lines.push({
                    text: line_prefix + result_words.join(' '),
                    color: text_color,
                    offset_y: line.offset_y,
                    offset_x: offset_x_current,
                    line_num: line_num_current
                })

                createJsText.text = line_prefix + result_words.join(' ');
                offset_x_current += createJsText.getMeasuredWidth();
                result_words = [];
            }
        })

        return result_lines;
    }
}

export { RenderTokenCalculator, TextTokenInterface };