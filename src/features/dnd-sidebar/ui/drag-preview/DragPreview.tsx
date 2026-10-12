'use client';

import styles from './DragPreview.module.css';
import { Project } from '@/entities/project';
import { Page, PAGE_TYPE } from '@/shared/const/pageType';
import { Typography } from '@/shared/ui/Typography';
import { getIconByName } from '@/shared/ui/icon-picker';
import PageIcon from '@shared/assets/icons/page.svg';

interface DragPreviewProps {
  id: string;
  projects: Project[];
  pages: Page[];
}

export function DragPreview({ id, projects, pages }: DragPreviewProps) {
  const project = projects.find((p) => p.id === id);
  const page = pages.find((p) => p.id === id);

  if (project) {
    const ProjectIcon = typeof project.icon === 'string' ? getIconByName(project.icon) : null;

    return (
      <div className={styles.preview}>
        {ProjectIcon ? (
          // eslint-disable-next-line
          <ProjectIcon
            className={styles.icon}
            style={project.color ? { color: project.color } : undefined}
          />
        ) : project.color ? (
          <span className={styles.colorDot} style={{ backgroundColor: project.color }} />
        ) : null}

        <Typography className={styles.title} variant="label">
          {project.name}
        </Typography>
      </div>
    );
  }

  if (page) {
    const PageIconComponent = typeof page.icon === 'string' ? getIconByName(page.icon) : null;
    const FallbackIcon = page.type === PAGE_TYPE.ARTICLE ? null : PageIcon;

    return (
      <div className={styles.preview}>
        {PageIconComponent ? (
          // getIconByName returns a reference to an existing component, not creates a new one
          // eslint-disable-next-line
          <PageIconComponent className={styles.icon} />
        ) : FallbackIcon ? (
          <FallbackIcon className={styles.icon} />
        ) : null}

        <Typography className={styles.title} variant="label">
          {page.title}
        </Typography>
      </div>
    );
  }

  return null;
}
