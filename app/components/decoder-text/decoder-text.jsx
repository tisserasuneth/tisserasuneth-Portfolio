import { VisuallyHidden } from '~/components/visually-hidden';
import { useReducedMotion, useSpring } from 'framer-motion';
import { memo, useEffect, useRef } from 'react';
import { delay } from '~/utils/delay';
import { classes } from '~/utils/style';
import styles from './decoder-text.module.css';

// prettier-ignore
const glyphs = [
  'අ', 'ඉ', 'උ', 'එ', 'ඔ',
  'ක', 'ක', 'ක', 'ක', 'ක',
  'ස', 'ස', 'ස', 'ස', 'ස',
  'ට', 'ට', 'ට', 'ට', 'ට',
  'න', 'න', 'න', 'න', 'න',
  'හ', 'හ', 'හ', 'හ', 'හ',
  'ම', 'ම', 'ම', 'ම', 'ම',
  'ය', 'ය', 'ය', 'ා',
  'ර', 'ර', 'ර', 'ර', 'ර',
  'ව', 'ව', 'ව', 'ව', 'ං',
  'ග', 'ග', 'ග', 'ග', 'ග',
  'ස', 'ස', 'ස', 'ස', 'ස',
  'ද', 'ද', 'ද', 'ද', 'ද',
  'බ', 'බ', 'බ', 'බ', 'බ',
  'ප', 'ප', 'ප', 'ප', 'ප'
];


const CharType = {
  Glyph: 'glyph',
  Value: 'value',
};

function shuffle(content, output, position) {
  return content.map((value, index) => {
    if (index < position) {
      return { type: CharType.Value, value };
    }

    if (position % 1 < 0.5) {
      const rand = Math.floor(Math.random() * glyphs.length);
      return { type: CharType.Glyph, value: glyphs[rand] };
    }

    return { type: CharType.Glyph, value: output[index].value };
  });
}

export const DecoderText = memo(
  ({ text, start = true, delay: startDelay = 0, className, ...rest }) => {
    const output = useRef([{ type: CharType.Glyph, value: '' }]);
    const container = useRef();
    const reduceMotion = useReducedMotion();
    const decoderSpring = useSpring(0, { stiffness: 8, damping: 5 });

    useEffect(() => {
      const containerInstance = container.current;
      const content = text.split('');
      let animation;

      const renderOutput = () => {
        const characterMap = output.current.map(item => {
          return `<span class="${styles[item.type]}">${item.value}</span>`;
        });

        containerInstance.innerHTML = characterMap.join('');
      };

      const unsubscribeSpring = decoderSpring.on('change', value => {
        output.current = shuffle(content, output.current, value);
        renderOutput();
      });

      const startSpring = async () => {
        await delay(startDelay);
        decoderSpring.set(content.length);
      };

      if (start && !animation && !reduceMotion) {
        startSpring();
      }

      if (reduceMotion) {
        output.current = content.map((value, index) => ({
          type: CharType.Value,
          value: content[index],
        }));
        renderOutput();
      }

      return () => {
        unsubscribeSpring?.();
      };
    }, [decoderSpring, reduceMotion, start, startDelay, text]);

    return (
      <span className={classes(styles.text, className)} {...rest}>
        <VisuallyHidden className={styles.label}>{text}</VisuallyHidden>
        <span aria-hidden className={styles.content} ref={container} />
      </span>
    );
  }
);
