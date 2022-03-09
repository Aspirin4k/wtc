import { TEXT_COLOR_BLUE, TEXT_COLOR_PURPLE, TEXT_COLOR_RED, TEXT_FONT_FAMILY } from '../scenes/novel/text/Constants';
import { ExactPosition } from '../ui/Interfaces';

export interface TextTokenInterface {
  text: string;
  color: string;
  offset: ExactPosition,
  width: number,
  line_num: number;
}

type CalculationOptions = {
  text: string,
  color: {
    default: string,
  },
  size: {
    width: number,
    font: number,
    line_height: number,
  }
}

export const calculateRows = (context: CanvasRenderingContext2D, options: CalculationOptions): TextTokenInterface[] => {
  context.font = `${options.size.font}px ${TEXT_FONT_FAMILY}`;
  return options.text
    // Двойной перенос строки считаем за начало нового абзаца
    .split("\n\n")
    .map((line: string, index: number): TextTokenInterface => ({
      text: line,
      color: options.color.default,
      offset: {
        y: index * options.size.font,
        x: 0
      },
      width: context.measureText(line).width,
      line_num: 0
    }))
    // Учитываем одинарные переносы строки
    .reduce((result: TextTokenInterface[], line: TextTokenInterface) => {
      const added_lines = line.text
        .split("\n")
        .map((subline) => ({
          text: subline,
          color: options.color.default,
          offset: {
            y: line.offset.y,
            x: 0
          },
          width: context.measureText(subline).width,
          line_num: 0
        }))
      return [...result, ...added_lines];
    }, [])
    // Разбиваем на линии по ширине экрана с учетом цветов
    .reduce((result: TextTokenInterface[], line: TextTokenInterface) => {
      const first_line_num = !!result.length ? result[result.length - 1].line_num + 1 : 0;
      const added_lines = getTextBrokenToLines(context, line, options).map((line) => ({
        ...line,
        line_num: line.line_num + first_line_num
      }));
      return [...result, ...added_lines];
    }, [])
    .map((line: TextTokenInterface) => {
      line.offset.y = line.offset.y + line.line_num * options.size.line_height;
      return line;
    });
}

/**
 * Разбить текст на линии, чтобы влазили в экран
 */
const getTextBrokenToLines = (context: CanvasRenderingContext2D, line: TextTokenInterface, options: CalculationOptions): TextTokenInterface[] => {
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
        text_color = options.color.default;
        break;
    }

    const words = colored_subline.split(' ');

    // Сценарий: в предыдущей линии влезли все слова в строку, однако
    // новое слово из этой линии в оставшееся пространство не помещается
    // Решение: перенос на новую строку
    if (offset_x_current + context.measureText(words[0]).width > options.size.width) {
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
      if (context.measureText(line_prefix + word).width > options.size.width) {
        // TODO: слово не влазит в строку (Нахера такое слово?)
        // может потребоваться для японского, в котором нет пробелов (Нахера на сайте японский?)
      } else if (offset_x_current + context.measureText(line_prefix + [...result_words, word].join(' ')).width > options.size.width) {
        result_lines.push({
          text: line_prefix + result_words.join(' '),
          color: text_color,
          offset: {
            y: line.offset.y,
            x: offset_x_current,
          },
          width: context.measureText(line_prefix + result_words.join(' ')).width,
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
        offset: {
          y: line.offset.y,
          x: offset_x_current,
        },
        width: context.measureText(line_prefix + result_words.join(' ')).width,
        line_num: line_num_current
      })
      offset_x_current +=  context.measureText(line_prefix + result_words.join(' ')).width;
      result_words = [];
    }
  })

  return result_lines;
}