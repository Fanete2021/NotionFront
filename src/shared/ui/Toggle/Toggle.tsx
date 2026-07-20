import { FC } from "react";
import classNames from "classnames";
import styles from "./Toggle.module.css";

interface ToggleProps extends React.ComponentPropsWithoutRef<"div"> {
    checked: boolean;
    disabled?: boolean;
    onToggle?: () => void;
    className?: string;
}

const getContainerClass = (checked: boolean, disabled: boolean): string => {
    if (disabled) {
        return checked ? styles.onDisabled : styles.offDisabled;
    }
    return checked ? styles.on : styles.off;
};

export const Toggle: FC<ToggleProps> = ({
    checked,
    disabled = false,
    onToggle,
    className,
    ...restProps
}) => {
    const handleClick = () => {
        if (!disabled && onToggle) {
            onToggle();
        }
    };

    const thumbMods = {
        [styles.thumbOn]: checked,
        [styles.thumbOff]: !checked,
    };

    return (
        <div
            className={classNames(
                styles.container,
                getContainerClass(checked, disabled),
                className,
                {
                    [styles.disabled]: disabled,
                },
            )}
            role="switch"
            aria-checked={checked}
            aria-disabled={disabled}
            tabIndex={disabled ? -1 : 0}
            onClick={handleClick}
            {...restProps}
        >
            <div className={classNames(styles.thumb, thumbMods)} />
        </div>
    );
};
