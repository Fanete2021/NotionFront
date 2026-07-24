import { fn } from "storybook/test";
import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { Input } from "./Input";
import SearchIcon from '../../assets/icons/search.svg';
import EyeIcon from "../../assets/icons/eye.svg";
import Image from "next/image";

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
        addonLeft: <Image src={SearchIcon} alt="" />,
        placeholder: "Поиск...",
        value: "",
    },
};

export const WithRightIcon: Story = {
    args: {
        addonRight: <Image src={EyeIcon} alt="" />,
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
