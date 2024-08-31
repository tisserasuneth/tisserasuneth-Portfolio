import { Button } from '~/components/button';
import { DecoderText } from '~/components/decoder-text';
import { Image } from '~/components/image';
import { Divider } from '~/components/divider';
import { Heading } from '~/components/heading';
import { Link } from '~/components/link';
import { Section } from '~/components/section';
import { Text } from '~/components/text';
import { Transition } from '~/components/transition';
import { Fragment, useState } from 'react';
import katakana from './katakana.svg';
import styles from './profile.module.css';
import pmgTeam from '~/assets/pmg-team.jpg';

const ProfileText = ({ visible, titleId }) => (
  <Fragment>
    <Heading className={styles.title} data-visible={visible} level={3} id={titleId}>
      <DecoderText text="Hey 👋" start={visible} delay={100} />
    </Heading>
    <Image
        src={`${pmgTeam}`}
        alt="My overused headshot from LinkedIn"
        style={{ 
          width: '500px', 
          zIndex: 1,
        }}
      />
      <br/>
    <Text className={styles.description} data-visible={visible} size="l" as="p">
      I'm Suneth Tissera. <br/> I currently work as a Software Engineer II 
      <br/> for <Link href="https://www.pmg.com"> PMG Digital Agency </Link> in Dallas, TX 🏙️.

      <br/><br/>
      My workday includes many beep boops on the computer, 
      and it's always rewarding to see how it all comes together in the end.
    </Text>
  </Fragment>
);

export const Profile = ({ id, visible, sectionRef }) => {
  const [focused, setFocused] = useState(false);
  const titleId = `${id}-title`;

  return (
    <Section
      className={styles.profile}
      onFocus={() => setFocused(true)}
      onBlur={() => setFocused(false)}
      as="section"
      id={id}
      ref={sectionRef}
      aria-labelledby={titleId}
      tabIndex={-1}
    >
      <Transition in={visible || focused} timeout={0}>
        {({ visible, nodeRef }) => (
          <div className={styles.content} ref={nodeRef}>
            <div className={styles.column}>
              <ProfileText visible={visible} titleId={titleId} />
              <Button
                secondary
                className={styles.button}
                data-visible={visible}
                href="/contact"
                icon="send"
              >
                Send me a message
              </Button>
            </div>
            <div className={styles.column}>
              <div className={styles.tag} aria-hidden>
                <Divider
                  notchWidth="64px"
                  notchHeight="8px"
                  collapsed={!visible}
                  collapseDelay={1000}
                />
                <div className={styles.tagText} data-visible={visible}>
                  About me
                </div>
              </div>
              <div className={styles.image}>
                <svg className={styles.svg} data-visible={visible} viewBox="0 0 136 766">
                  <use href={`${katakana}#katakana-profile`} />
                </svg>
              </div>
            </div>
          </div>
        )}
      </Transition>
    </Section>
  );
};
