import styles from './FileDropzone.module.css';
import { formatBytes } from '@features/text-editor/utils/formatBytes';
import ImageIcon from '@shared/assets/icons/image-icon.svg';
import { Typography } from '@shared/ui/Typography';
import { toast } from '@shared/ui/toast';

interface FileDropzoneProps {
  onFileSelect: (file: File) => void;
  acceptedExtensions: readonly string[];
  formatsLabel: string;
  maxFileSize: number;
  hint: string;
}

export const FileDropzone = ({
  onFileSelect,
  maxFileSize,
  hint,
  acceptedExtensions,
  formatsLabel,
}: FileDropzoneProps) => {
  const maxFileSizeMB = formatBytes(maxFileSize, 'MB');
  console.log(maxFileSizeMB);
  const handleUploadFile = (file?: File) => {
    if (!file) return;

    const isAccepted = acceptedExtensions.some((extension) =>
      file.name.toLowerCase().endsWith(extension),
    );

    if (!isAccepted) {
      toast.add({
        type: 'error',
        title: 'Неверный формат файла',
        description: `Допустимые форматы: ${formatsLabel}`,
      });
      return;
    }

    if (file.size > maxFileSize) {
      toast.add({
        type: 'error',
        title: 'Файл слишком большой',
        description: `Ограничение по размеру: ${maxFileSizeMB} МБ`,
      });
      return;
    }

    onFileSelect(file);
  };

  return (
    <label
      data-isolate-block="true"
      onDragOver={(event) => {
        event.preventDefault();
      }}
      onDrop={(event) => {
        event.preventDefault();
        handleUploadFile(event.dataTransfer.files[0]);
      }}
    >
      <div className={styles.dropzone}>
        <ImageIcon className={styles.icon} />
        <Typography variant="text-label">{hint}</Typography>
        <Typography variant="caption">{`${formatsLabel} до ${maxFileSizeMB} МБ`}</Typography>
      </div>
      <input
        hidden
        type="file"
        name="filepicker"
        accept={acceptedExtensions.join(',')}
        onChange={(event) => {
          handleUploadFile(event.target.files?.[0]);
        }}
      />
    </label>
  );
};
