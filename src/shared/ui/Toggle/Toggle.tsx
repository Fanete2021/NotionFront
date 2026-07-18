import { FC } from "react";
import styles from "./Toggle.module.css";

type ToggleState = "on" | "off" | "onDisabled" | "offDisabled";

interface ToggleProps {
    state: ToggleState;
    onToggle?: () => void;
    className?: string;
}

export const Toggle: FC<ToggleProps> = ({ state, onToggle, className }) => {
    const getContainerClass = () => {
        switch (state) {
            case "on":
                return styles.on;
            case "onDisabled":
                return styles.onDisabled;
            case "offDisabled":
                return styles.offDisabled;
            default:
                return styles.off;
        }
    };

    const isOn = state === "on" || state === "onDisabled";
    const isDisabled = state === "offDisabled" || state === "onDisabled";

    const handleClick = () => {
        if (!isDisabled && onToggle) {
            onToggle();
        }
    };

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if ((e.key === "Enter" || e.key === " ") && !isDisabled) {
            e.preventDefault();
            onToggle?.();
        }
    };

    return (
        <div
            className={`${styles.container} ${getContainerClass()} ${className || ""}`}
            role="switch"
            aria-checked={isOn}
            aria-disabled={isDisabled}
            tabIndex={isDisabled ? -1 : 0}
            onClick={handleClick}
            onKeyDown={handleKeyDown}
        >
            <div
                className={`${styles.thumb} ${isOn ? styles.thumbOn : styles.thumbOff}`}
            />
        </div>
    );
};
