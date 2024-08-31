import { DecoderText } from '~/components/decoder-text';
import { Heading } from '~/components/heading';
import { Section } from '~/components/section';
import { useTheme } from '~/components/theme-provider';
import { tokens } from '~/components/theme-provider/theme';
import { Transition } from '~/components/transition';
import { VisuallyHidden } from '~/components/visually-hidden';
import { Link as RouterLink } from '@remix-run/react';
import { useScrollToHash } from '~/hooks';
import { Suspense, lazy } from 'react';
import { cssProps } from '~/utils/style';
import config from '~/config.json';
import { useHydrated } from '~/hooks/useHydrated';
import styles from './intro.module.css';

import profileImg from '~/assets/profile.jpg';
import { Image } from '~/components/image';

const DisplacementSphere = lazy(() =>
  import('./displacement-sphere').then(module => ({ default: module.DisplacementSphere }))
);

export function Intro({ id, sectionRef, scrollIndicatorHidden, ...rest }) {
  const { theme } = useTheme();

  const titleId = `${id}-title`;
  const scrollToHash = useScrollToHash();
  const isHydrated = useHydrated();

  const handleScrollClick = event => {
    event.preventDefault();
    scrollToHash(event.currentTarget.href);
  };

  return (
    
    <Section
      className={styles.intro}
      as="section"
      ref={sectionRef}
      id={id}
      aria-labelledby={titleId}
      tabIndex={-1}
      {...rest}
    >

      <Image
        delay={100}
        src={`${profileImg}`}
        alt="My overused headshot from LinkedIn"
        style={{ 
          width: '200px', 
          height: '100px', 
          top: '-140px', 
          left: '-300px',
          zIndex: 1,
        }}
        data-shape="circle"
      />

      <Transition in key={theme} timeout={3000}>
        {({ visible, status }) => (
          <>
            {isHydrated && (
              <Suspense>
                <DisplacementSphere />
              </Suspense>
            )}
            <header className={styles.text}>
              <Heading level={0} as="h2" className={styles.title}>
                <span aria-hidden className={styles.row}>
                  <span
                    className={styles.word}
                    data-status={status}
                    style={cssProps({ delay: tokens.base.durationXS })}
                  >
                    {config.name}
                  </span>
                  <span className={styles.line} data-status={status} />
                </span>
                <h1 className={styles.name} data-visible={visible} id={titleId}>
                    <DecoderText text={config.role} delay={500} />
                </h1>
              </Heading>
            </header>
            <RouterLink
              to="/#project-1"
              className={styles.scrollIndicator}
              data-status={status}
              data-hidden={scrollIndicatorHidden}
              onClick={handleScrollClick}
            >
              <VisuallyHidden>Scroll to projects</VisuallyHidden>
            </RouterLink>
            <RouterLink
              to="/#project-1"
              className={styles.mobileScrollIndicator}
              data-status={status}
              data-hidden={scrollIndicatorHidden}
              onClick={handleScrollClick}
            >
              <VisuallyHidden>Scroll to projects</VisuallyHidden>
              <svg
                aria-hidden
                stroke="currentColor"
                width="43"
                height="15"
                viewBox="0 0 43 15"
              >
                <path d="M1 1l20.5 12L42 1" strokeWidth="2" fill="none" />
              </svg>
            </RouterLink>
          </>
        )}
      </Transition>
    </Section>
  );
}
