import { fn } from "storybook/test";
import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { Input } from "./Input";

const SearchIcon = () => (
    <svg width="16" height="16" viewBox="0 0 20 20" fill="none">
        <path
            d="M9 17C13.4183 17 17 13.4183 17 9C17 4.58172 13.4183 1 9 1C4.58172 1 1 4.58172 1 9C1 13.4183 4.58172 17 9 17Z"
            stroke="#9CA3AF"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
        />
        <path
            d="M19 19L14.65 14.65"
            stroke="#9CA3AF"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
        />
    </svg>
);

const EmailIcon = () => (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
        <path
            d="M3.33337 3.33337H16.6667C17.5834 3.33337 18.3334 4.08337 18.3334 5.00004V15C18.3334 15.9167 17.5834 16.6667 16.6667 16.6667H3.33337C2.41671 16.6667 1.66671 15.9167 1.66671 15V5.00004C1.66671 4.08337 2.41671 3.33337 3.33337 3.33337Z"
            stroke="#9CA3AF"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
        />
        <path
            d="M18.3334 5L10 10.8333L1.66671 5"
            stroke="#9CA3AF"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
        />
    </svg>
);

const meta = {
    title: "Input",
    component: Input,
    tags: ["autodocs"],
    args: {
        onChange: fn(),
        placeholder: "Введите текст...",
        size: "m",
    },
} satisfies Meta<typeof Input>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
    args: {
        placeholder: "Введите текст...",
        value: "",
    },
};

export const WithValue: Story = {
    args: {
        placeholder: "Введите текст...",
        value: "Пример текста",
    },
};

export const WithLabel: Story = {
    args: {
        label: "Email",
        placeholder: "Введите email",
        value: "",
    },
};

export const WithError: Story = {
    args: {
        label: "Email",
        placeholder: "Введите email",
        value: "неверный-email",
        error: "Некорректный формат email",
    },
};

export const Disabled: Story = {
    args: {
        placeholder: "Поле недоступно",
        value: "Заблокированный текст",
        readonly: true,
    },
};

export const Password: Story = {
    args: {
        type: "password",
        placeholder: "Введите пароль",
        value: "secret123",
        label: "Пароль",
    },
};

export const WithLeftIcon: Story = {
    args: {
        addonLeft: <SearchIcon />,
        placeholder: "Поиск...",
        value: "",
    },
};

export const WithRightIcon: Story = {
    args: {
        addonRight: <EmailIcon />,
        placeholder: "Введите email",
        value: "",
    },
};

export const Small: Story = {
    args: {
        size: "s",
        placeholder: "Маленький размер",
        value: "",
    },
};

export const Medium: Story = {
    args: {
        size: "m",
        placeholder: "Средний размер",
        value: "",
    },
};
