import React from 'react';
import { FiGithub, FiLinkedin, FiMail, FiExternalLink } from 'react-icons/fi';

const ICONS: Record<string, React.ReactNode> = {
  github: <FiGithub size={18} />,
  linkedin: <FiLinkedin size={18} />,
  mail: <FiMail size={18} />,
  external: <FiExternalLink size={16} />,
};

interface SocialIconProps {
  name: string;
  size?: number;
}

export const SocialIcon: React.FC<SocialIconProps> = ({ name }) => {
  return <>{ICONS[name] ?? null}</>;
};

export const ExternalLinkIcon = () => ICONS.external;
