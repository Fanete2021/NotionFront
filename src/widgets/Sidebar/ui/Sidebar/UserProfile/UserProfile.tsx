import { Avatar } from '@/shared/ui/Avatar';
import styles from '../Sidebar.module.css';
import { Typography } from '@/shared/ui/Typography';
import { Button } from '@/shared/ui/Button';

export function UserProfile({ name, email }: { name: string; email: string }) {
    return (
        <div className={styles.profile}>
            <Avatar name={name} size="lg" className={styles.avatar} />

            <div className={styles.userInfo}>
                <Typography variant="label" className={styles.name}>
                    {name}
                </Typography>
                <Typography variant="caption" className={styles.email}>
                    {email}
                </Typography>
            </div>

            <Button size="sm" variant="clear" className={styles.moreBtn}>
                •••
            </Button>
        </div>
    );
}
